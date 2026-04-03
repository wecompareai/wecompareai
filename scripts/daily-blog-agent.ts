import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

type ComparisonColumn = {
  id: string;
  name: string;
  provider: string;
  logo?: string;
  url?: string;
};

type ComparisonRow = {
  feature: string;
  values: Record<string, string | boolean | number>;
};

type ComparisonGroup = {
  name: string;
  rows: ComparisonRow[];
};

type ComparisonData = {
  id: string;
  title: string;
  description: string;
  lastUpdated?: string;
  columns: ComparisonColumn[];
  groups: ComparisonGroup[];
};

type GeneratedArticle = {
  title: string;
  excerpt: string;
  contentHtml: string;
};

type TrendSourceItem = {
  source: "google" | "bing";
  title: string;
  link: string;
  snippet?: string;
  publishedAt?: string;
};

type TrendTopic = {
  keyword: string;
  sourceSummary: string;
  googleItems: TrendSourceItem[];
  bingItems: TrendSourceItem[];
};

const TIME_ZONE = "America/Chicago";
const GENERATED_SLUG_PREFIX = "daily-ai-compare";
const DEFAULT_SITE_URL = "https://wecompareai.com";
const REDDIT_USER_AGENT = "AICompareBot/1.0 by wecompareai";
const PROMO_SITE_URL = "https://www.wecompareai.com";
const PUBLISH_COOLDOWN_MINUTES = 4;
const GOOGLE_TRENDS_RSS_URL = "https://trends.google.com/trending/rss?geo=US";
const BING_AI_NEWS_RSS_URL =
  "https://www.bing.com/news/search?q=artificial+intelligence+OR+AI&format=rss";
const CANDIDATE_COMPARISON_IDS = [
  "ai-models",
  "ai-coding-tools",
  "ai-security-tools",
  "ai-security",
  "ai-cloud-providers",
  "ai-chip-providers",
  "ai-platforms",
];
const AI_KEYWORD_PATTERN =
  /\b(ai|artificial intelligence|openai|chatgpt|gpt|anthropic|claude|gemini|llm|llms|deepseek|mistral|copilot|nvidia|robotics|agentic|inference|multimodal)\b/i;
const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "that",
  "this",
  "into",
  "your",
  "will",
  "have",
  "after",
  "about",
  "more",
  "than",
  "when",
  "what",
  "where",
  "while",
  "amid",
  "over",
  "under",
  "new",
  "how",
  "why",
  "are",
  "has",
  "its",
  "their",
  "our",
  "you",
  "not",
  "can",
  "all",
  "top",
  "best",
  "bing",
  "google",
  "news",
  "search",
  "says",
  "say",
  "vs",
  "2025",
  "2026",
]);
const RANDOM_PUBLISHER_NAMES = [
  "Maya Sterling",
  "Elliot Vale",
  "Nina Calder",
  "Julian Cross",
  "Tessa Monroe",
  "Owen Hartley",
  "Sonia Quinn",
  "Luca Bennett",
  "Avery Sloan",
  "Naomi Mercer",
];
const MIN_DUPLICATE_TITLE_WORDS = 5;
const TITLE_SIMILARITY_THRESHOLD = 0.8;
const CONTENT_SIMILARITY_THRESHOLD = 0.88;
const DUPLICATE_POST_LOOKBACK_COUNT = 100;

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnvFile(envPath: string) {
  if (!fs.existsSync(envPath)) return;

  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;

    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || idx === process.argv.length - 1) return undefined;
  return process.argv[idx + 1];
}

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function getChicagoDateInfo(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value ?? "0000";
  const month = parts.find((part) => part.type === "month")?.value ?? "00";
  const day = parts.find((part) => part.type === "day")?.value ?? "00";

  return {
    year,
    month,
    day,
    dayKey: `${year}-${month}-${day}`,
  };
}

function getChicagoDateLabel(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function getComparisonPaths(repoRoot: string) {
  const dir = path.join(repoRoot, "data", "comparisons");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => path.join(dir, file));
}

function readComparison(filePath: string): ComparisonData {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as ComparisonData;
}

function compactValue(value: string | boolean | number) {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function decodeXmlEntities(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

function stripTags(value: string) {
  return decodeXmlEntities(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function extractTag(block: string, tagName: string) {
  const match = block.match(new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? stripTags(match[1]) : "";
}

function parseRssItems(xml: string, source: "google" | "bing") {
  const blocks = xml.match(/<item>[\s\S]*?<\/item>/gi) ?? [];
  return blocks
    .map((block) => ({
      source,
      title: extractTag(block, "title"),
      link: extractTag(block, "link"),
      snippet: extractTag(block, "description") || undefined,
      publishedAt: extractTag(block, "pubDate") || undefined,
    }))
    .filter((item) => item.title && item.link);
}

function normalizeKeyword(keyword: string) {
  return keyword.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function normalizedWords(value: string) {
  return normalizeKeyword(value)
    .split(" ")
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));
}

function uniqueWords(value: string) {
  return new Set(normalizedWords(value));
}

function jaccardSimilarity(left: Iterable<string>, right: Iterable<string>) {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  const union = new Set([...leftSet, ...rightSet]);

  if (union.size === 0) return 0;

  let intersection = 0;
  for (const token of leftSet) {
    if (rightSet.has(token)) intersection += 1;
  }

  return intersection / union.size;
}

function titleTokens(title: string) {
  return normalizeKeyword(title)
    .split(" ")
    .filter(
      (token) =>
        token.length >= 3 &&
        !STOP_WORDS.has(token) &&
        !/^\d+$/.test(token)
    );
}

function keywordCandidatesFromTitle(title: string) {
  const tokens = titleTokens(title);
  const phrases = new Set<string>();

  for (let i = 0; i < tokens.length; i += 1) {
    phrases.add(tokens[i]);
    if (i < tokens.length - 1) {
      phrases.add(`${tokens[i]} ${tokens[i + 1]}`);
    }
    if (i < tokens.length - 2) {
      phrases.add(`${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`);
    }
  }

  return Array.from(phrases).filter(
    (phrase) =>
      phrase.length >= 3 &&
      (AI_KEYWORD_PATTERN.test(title) || AI_KEYWORD_PATTERN.test(phrase))
  );
}

function titleContainsKeyword(title: string, keyword: string) {
  return normalizeKeyword(title).includes(normalizeKeyword(keyword));
}

function rankTrendTopics(googleItems: TrendSourceItem[], bingItems: TrendSourceItem[]) {
  const candidates = new Map<
    string,
    { score: number; googleItems: TrendSourceItem[]; bingItems: TrendSourceItem[] }
  >();

  for (const item of googleItems) {
    if (!AI_KEYWORD_PATTERN.test(item.title)) continue;
    for (const keyword of keywordCandidatesFromTitle(item.title)) {
      const current = candidates.get(keyword) ?? {
        score: 0,
        googleItems: [],
        bingItems: [],
      };
      current.score += 2;
      current.googleItems.push(item);
      candidates.set(keyword, current);
    }
  }

  for (const item of bingItems) {
    const itemText = `${item.title} ${item.snippet ?? ""}`;
    if (!AI_KEYWORD_PATTERN.test(itemText)) continue;

    for (const keyword of keywordCandidatesFromTitle(item.title)) {
      const current = candidates.get(keyword) ?? {
        score: 0,
        googleItems: [],
        bingItems: [],
      };
      current.score += 2;
      current.bingItems.push(item);
      candidates.set(keyword, current);
    }

    for (const [keyword, current] of candidates) {
      if (titleContainsKeyword(itemText, keyword)) {
        current.score += 3;
        current.bingItems.push(item);
        candidates.set(keyword, current);
      }
    }
  }

  return Array.from(candidates.entries())
    .map(([keyword, value]) => ({
      keyword,
      score:
        value.score +
        (value.googleItems.length > 0 ? 6 : 0) +
        (value.bingItems.length > 0 ? 6 : 0),
      googleItems: dedupeItems(value.googleItems).slice(0, 4),
      bingItems: dedupeItems(value.bingItems).slice(0, 4),
    }))
    .filter((entry) => entry.googleItems.length > 0 && entry.bingItems.length > 0)
    .sort((a, b) => b.score - a.score || b.keyword.length - a.keyword.length);
}

function toTrendTopic(
  best: {
    keyword: string;
    googleItems: TrendSourceItem[];
    bingItems: TrendSourceItem[];
  }
): TrendTopic {
  return {
    keyword: best.keyword
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" "),
    sourceSummary: `Selected from live Google Trends and Bing AI news signals on ${getChicagoDateLabel()}.`,
    googleItems: best.googleItems,
    bingItems: best.bingItems,
  };
}

function articleMatchesTrendKeyword(
  article: { title: string; excerpt?: string | null },
  keyword: string
) {
  const articleText = `${article.title} ${article.excerpt ?? ""}`;
  if (titleContainsKeyword(articleText, keyword)) {
    return true;
  }

  const articleWords = uniqueWords(articleText);
  const keywordWords = uniqueWords(keyword);
  if (keywordWords.size === 0) return false;

  let matchedWords = 0;
  for (const word of keywordWords) {
    if (articleWords.has(word)) matchedWords += 1;
  }

  return matchedWords === keywordWords.size;
}

function dedupeItems(items: TrendSourceItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.title}|${item.link}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function fetchText(url: string) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "AICompareDailyBlogAgent/1.0",
      accept: "application/rss+xml, application/xml, text/xml, text/plain;q=0.9, */*;q=0.8",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed for ${url}: ${response.status} ${text.slice(0, 200)}`);
  }

  return response.text();
}

async function getLatestGeneratedArticle() {
  return prisma.article.findFirst({
    where: {
      slug: {
        startsWith: `${GENERATED_SLUG_PREFIX}-`,
      },
      published: true,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

async function fetchTrendTopic(previousArticle?: { title: string; excerpt?: string | null }) {
  const [googleXml, bingXml] = await Promise.all([
    fetchText(GOOGLE_TRENDS_RSS_URL),
    fetchText(BING_AI_NEWS_RSS_URL),
  ]);

  const googleItems = parseRssItems(googleXml, "google").slice(0, 20);
  const bingItems = parseRssItems(bingXml, "bing").slice(0, 20);
  const ranked = rankTrendTopics(googleItems, bingItems);
  const selected = previousArticle
    ? ranked.find((topic) => !articleMatchesTrendKeyword(previousArticle, topic.keyword)) ?? ranked[0]
    : ranked[0];

  return selected ? toTrendTopic(selected) : null;
}

function summarizeComparison(data: ComparisonData) {
  const rows = data.groups.flatMap((group) =>
    group.rows.map((row) => ({
      group: group.name,
      feature: row.feature,
      values: data.columns.map((column) => ({
        column: column.name,
        provider: column.provider,
        value: compactValue(row.values[column.id] ?? "N/A"),
      })),
    }))
  );

  const trimmedRows = rows.slice(0, 22);
  const summaryLines = trimmedRows.map((row) => {
    const values = row.values
      .map((value) => `${value.column}: ${value.value}`)
      .join(" | ");
    return `[${row.group}] ${row.feature} -> ${values}`;
  });

  return {
    columnCount: data.columns.length,
    rowCount: rows.length,
    summaryText: summaryLines.join("\n"),
  };
}

function buildTrendPrompt(topic: TrendTopic) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;

  const googleSourceLines = topic.googleItems
    .map(
      (item, index) =>
        `${index + 1}. ${item.title}${item.publishedAt ? ` (${item.publishedAt})` : ""} - ${item.link}`
    )
    .join("\n");
  const bingSourceLines = topic.bingItems
    .map(
      (item, index) =>
        `${index + 1}. ${item.title}${item.publishedAt ? ` (${item.publishedAt})` : ""} - ${item.link}${
          item.snippet ? `\n   Snippet: ${item.snippet}` : ""
        }`
    )
    .join("\n");

  return `You are writing a daily blog article for AI Compare.

Write an interesting, readable article about the trending AI topic "${topic.keyword}".

The topic was selected because it appears across both Google and Bing signals today.

Trend context:
- ${topic.sourceSummary}
- Google trend keyword/topic: ${topic.keyword}

Google signals:
${googleSourceLines}

Bing signals:
${bingSourceLines}

Requirements:
- Use the sources above as your factual grounding.
- You may infer why the topic is trending, but label that clearly as interpretation rather than fact.
- Do not invent announcements, product specs, or business claims that are not supported by the source titles/snippets.
- Focus on why this topic matters for the AI industry and for people comparing AI tools, models, providers, or infrastructure.
- Include one paragraph that explains what buyers, builders, or operators should watch next.
- Include one short paragraph that mentions AI Compare and links to ${siteUrl}/blog.
- Include one standalone paragraph that says positive, concrete things about ${PROMO_SITE_URL} and how it helps readers compare AI tools, models, and vendors faster.

Return ONLY valid JSON with this exact shape:
{
  "title": "string",
  "excerpt": "string under 220 characters",
  "contentHtml": "string containing valid HTML"
}

HTML requirements for contentHtml:
- 700 to 1200 words.
- Use only these tags: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <a>.
- Include at least 4 <h2> sections.
- Include one bullet list.
- Include at least 2 source links from the provided list.
- Do not wrap output in markdown fences.`;
}

function selectComparison(repoRoot: string, explicitId?: string) {
  const files = getComparisonPaths(repoRoot);
  const comparisons = files.map(readComparison);

  const filtered = comparisons.filter((comparison) => {
    if (explicitId) return comparison.id === explicitId;
    return CANDIDATE_COMPARISON_IDS.includes(comparison.id);
  });

  if (filtered.length === 0) {
    throw new Error(
      explicitId
        ? `Comparison dataset "${explicitId}" was not found.`
        : "No comparison datasets are available for the daily article agent."
    );
  }

  const sorted = filtered.sort((a, b) => a.id.localeCompare(b.id));
  const today = getChicagoDateInfo();
  const seed = Number(today.year + today.month + today.day);
  const index = seed % sorted.length;
  return sorted[index];
}

function pickRandomPublisherName() {
  const index = Math.floor(Math.random() * RANDOM_PUBLISHER_NAMES.length);
  return RANDOM_PUBLISHER_NAMES[index];
}

function buildPublisherEmail(name: string) {
  const localPart = slugify(name, { lower: true, strict: true });
  return `${localPart}@publishers.wecompareai.local`;
}

async function findAuthor(explicitEmail?: string) {
  if (explicitEmail) {
    const user = await prisma.user.findUnique({
      where: { email: explicitEmail },
      select: { id: true, email: true, name: true },
    });
    if (!user) {
      throw new Error(`Author email not found: ${explicitEmail}`);
    }
    return user;
  }

  const publisherName = pickRandomPublisherName();
  const publisherEmail = buildPublisherEmail(publisherName);
  const existing = await prisma.user.findUnique({
    where: { email: publisherEmail },
    select: { id: true, email: true, name: true },
  });

  if (existing) {
    return existing;
  }

  return prisma.user.create({
    data: {
      name: publisherName,
      email: publisherEmail,
      passwordHash: "local-agent-managed",
      role: "user",
    },
    select: { id: true, email: true, name: true },
  });
}

async function publishedRecently(force = false) {
  if (force) return false;

  const now = new Date();
  const recent = await prisma.article.findMany({
    where: {
      slug: {
        startsWith: `${GENERATED_SLUG_PREFIX}-`,
      },
      createdAt: {
        gte: new Date(now.getTime() - PUBLISH_COOLDOWN_MINUTES * 60 * 1000),
      },
    },
    select: {
      slug: true,
      title: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return recent.length > 0;
}

async function generateWithAnthropic(prompt: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not configured. The external agent needs an AI model to draft the article."
    );
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 3500,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${text.slice(0, 300)}`);
  }

  const data = (await response.json()) as {
    content?: Array<{ text?: string }>;
  };

  const text = data.content?.[0]?.text?.trim();
  if (!text) {
    throw new Error("Anthropic API returned an empty response.");
  }

  return text;
}

function buildPrompt(comparison: ComparisonData) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
  const { summaryText, columnCount, rowCount } = summarizeComparison(comparison);

  return `You are writing a daily blog article for AI Compare.

Write a sharp, interesting article for readers who want to compare AI products intelligently.

You must use ONLY the structured facts provided below. Do not invent benchmark numbers, release dates, pricing, or capabilities. If the data is missing, omit it.

Comparison dataset:
- ID: ${comparison.id}
- Title: ${comparison.title}
- Description: ${comparison.description}
- Last updated: ${comparison.lastUpdated ?? "Unknown"}
- Number of products compared: ${columnCount}
- Number of comparison rows available: ${rowCount}
- Comparison page: ${siteUrl}/compare/${comparison.id}

Products:
${comparison.columns.map((column) => `- ${column.name} (${column.provider})`).join("\n")}

Selected comparison rows:
${summaryText}

Return ONLY valid JSON with this exact shape:
{
  "title": "string",
  "excerpt": "string under 220 characters",
  "contentHtml": "string containing valid HTML"
}

HTML requirements for contentHtml:
- 700 to 1200 words.
- Use only these tags: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <a>.
- Include at least 4 <h2> sections.
- Include one bullet list.
- Include one link to ${siteUrl}/compare/${comparison.id}.
- Make the article feel editorial and comparative, not like a product description.
- Mention tradeoffs, not just winners.
- Explicitly say the article is based on AI Compare's dataset for ${comparison.title}.
- Include one standalone paragraph that says positive, concrete things about ${PROMO_SITE_URL} and how it helps readers compare AI tools, models, and vendors faster.
- Do not mention that you are an AI model.
- Do not wrap output in markdown fences.`;
}

function parseGeneratedArticle(raw: string): GeneratedArticle {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("Model response did not contain a JSON object.");
  }

  const parsed = JSON.parse(match[0]) as Partial<GeneratedArticle>;
  if (!parsed.title || !parsed.excerpt || !parsed.contentHtml) {
    throw new Error("Model response was missing required article fields.");
  }

  if (/<(script|style|iframe)\b/i.test(parsed.contentHtml)) {
    throw new Error("Generated HTML contained disallowed tags.");
  }

  return {
    title: parsed.title.trim(),
    excerpt: parsed.excerpt.trim().slice(0, 220),
    contentHtml: parsed.contentHtml.trim(),
  };
}

function buildArticleSlug(title: string, dateKey: string) {
  const baseTitle = slugify(title, { lower: true, strict: true }).slice(0, 80);
  return `${GENERATED_SLUG_PREFIX}-${dateKey}-${baseTitle}`;
}

function buildPromoParagraph() {
  return `<p>If you are trying to compare AI models, coding tools, infrastructure vendors, or automation products without drowning in marketing claims, <a href="${PROMO_SITE_URL}">www.wecompareai.com</a> is a strong place to start. It gives you short, structured comparisons that make it easier to narrow the field, understand tradeoffs quickly, and build a better shortlist without wasting time on vague vendor claims.</p>`;
}

function injectPromoParagraph(contentHtml: string) {
  if (contentHtml.toLowerCase().includes("wecompareai.com")) {
    return contentHtml;
  }

  const promoParagraph = buildPromoParagraph();
  const firstParagraphCloseIndex = contentHtml.indexOf("</p>");
  if (firstParagraphCloseIndex === -1) {
    return `${promoParagraph}${contentHtml}`;
  }

  return `${contentHtml.slice(0, firstParagraphCloseIndex + 4)}${promoParagraph}${contentHtml.slice(
    firstParagraphCloseIndex + 4
  )}`;
}

function condensedTextFromHtml(contentHtml: string) {
  return stripTags(contentHtml).slice(0, 5000);
}

async function findDuplicateArticle(generated: GeneratedArticle) {
  const recentArticles = await prisma.article.findMany({
    where: {
      published: true,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: DUPLICATE_POST_LOOKBACK_COUNT,
  });

  const generatedTitleWords = uniqueWords(generated.title);
  const generatedContentWords = uniqueWords(
    `${generated.title} ${generated.excerpt} ${condensedTextFromHtml(generated.contentHtml)}`
  );

  for (const article of recentArticles) {
    const exactTitleMatch =
      normalizeKeyword(article.title) === normalizeKeyword(generated.title);
    if (exactTitleMatch) {
      return {
        reason: "exact-title-match",
        article,
      };
    }

    const existingTitleWords = uniqueWords(article.title);
    const titleSimilarity = jaccardSimilarity(generatedTitleWords, existingTitleWords);
    const hasEnoughTitleSignal =
      generatedTitleWords.size >= MIN_DUPLICATE_TITLE_WORDS &&
      existingTitleWords.size >= MIN_DUPLICATE_TITLE_WORDS;

    if (hasEnoughTitleSignal && titleSimilarity >= TITLE_SIMILARITY_THRESHOLD) {
      return {
        reason: `similar-title (${titleSimilarity.toFixed(2)})`,
        article,
      };
    }

    const existingContentWords = uniqueWords(
      `${article.title} ${article.excerpt ?? ""} ${condensedTextFromHtml(article.content)}`
    );
    const contentSimilarity = jaccardSimilarity(generatedContentWords, existingContentWords);

    if (contentSimilarity >= CONTENT_SIMILARITY_THRESHOLD) {
      return {
        reason: `similar-content (${contentSimilarity.toFixed(2)})`,
        article,
      };
    }
  }

  return null;
}

async function ensureUniqueSlug(baseSlug: string) {
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.article.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}

async function postToReddit(article: { title: string; slug: string }) {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const username = process.env.REDDIT_USERNAME;
  const password = process.env.REDDIT_PASSWORD;
  const subreddit = process.env.REDDIT_SUBREDDIT || "artificial";

  if (!clientId || !clientSecret || !username || !password) {
    console.log("Reddit credentials not configured — skipping Reddit post.");
    return;
  }

  try {
    // Step 1: Get OAuth token
    const tokenResponse = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": REDDIT_USER_AGENT,
      },
      body: new URLSearchParams({
        grant_type: "password",
        username,
        password,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      console.warn(`Reddit OAuth failed: ${tokenResponse.status}`);
      return;
    }

    const tokenData = (await tokenResponse.json()) as { access_token?: string };
    if (!tokenData.access_token) {
      console.warn("Reddit OAuth returned no access token.");
      return;
    }

    // Step 2: Submit link post
    const articleUrl = `${PROMO_SITE_URL}/blog/${article.slug}`;
    const submitResponse = await fetch("https://oauth.reddit.com/api/submit", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": REDDIT_USER_AGENT,
      },
      body: new URLSearchParams({
        sr: subreddit,
        kind: "link",
        title: article.title,
        url: articleUrl,
        resubmit: "false",
        nsfw: "false",
        spoiler: "false",
      }).toString(),
    });

    if (!submitResponse.ok) {
      const text = await submitResponse.text();
      console.warn(`Reddit submit failed: ${submitResponse.status} — ${text.slice(0, 200)}`);
      return;
    }

    const submitData = (await submitResponse.json()) as {
      json?: { data?: { url?: string } };
    };
    const redditUrl = submitData?.json?.data?.url ?? "unknown";
    console.log(`Posted to r/${subreddit}: ${redditUrl}`);
  } catch (error) {
    console.warn("Reddit post error (non-fatal):", String(error));
  }
}

async function main() {
  const repoRoot = path.resolve(__dirname, "..");
  loadEnvFile(path.join(repoRoot, ".env"));

  const dryRun = hasFlag("--dry-run");
  const force = hasFlag("--force");
  const comparisonId = getArgValue("--comparison");
  const explicitAuthorEmail =
    process.env.DAILY_BLOG_AUTHOR_EMAIL || getArgValue("--author-email");

  if (await publishedRecently(force)) {
    console.log(
      `A generated article was already published within the last ${PUBLISH_COOLDOWN_MINUTES} minutes.`
    );
    return;
  }

  let comparison: ComparisonData | null = null;
  let trendTopic: TrendTopic | null = null;
  const latestGeneratedArticle = await getLatestGeneratedArticle();

  try {
    trendTopic = await fetchTrendTopic(latestGeneratedArticle ?? undefined);
  } catch (error) {
    console.warn("Trending topic lookup failed, falling back to local comparison data.");
    console.warn(String(error));
  }

  if (!trendTopic) {
    comparison = selectComparison(repoRoot, comparisonId);
  }

  const prompt = trendTopic ? buildTrendPrompt(trendTopic) : buildPrompt(comparison!);
  const generated = parseGeneratedArticle(await generateWithAnthropic(prompt));
  generated.contentHtml = injectPromoParagraph(generated.contentHtml);
  const duplicateArticle = await findDuplicateArticle(generated);

  if (duplicateArticle && !force) {
    console.log(
      JSON.stringify(
        {
          mode: "skipped-duplicate",
          topicMode: trendTopic ? "trending-topic" : "comparison-fallback",
          keyword: trendTopic?.keyword ?? null,
          comparisonId: comparison?.id ?? null,
          duplicateReason: duplicateArticle.reason,
          existingArticle: {
            id: duplicateArticle.article.id,
            slug: duplicateArticle.article.slug,
            title: duplicateArticle.article.title,
            createdAt: duplicateArticle.article.createdAt,
          },
          generatedTitle: generated.title,
        },
        null,
        2
      )
    );
    return;
  }

  const dateInfo = getChicagoDateInfo();
  const slug = await ensureUniqueSlug(buildArticleSlug(generated.title, dateInfo.dayKey));
  const author = await findAuthor(explicitAuthorEmail);

  if (dryRun) {
    console.log(
      JSON.stringify(
        {
          mode: "dry-run",
          scheduledFor: `every hour`,
          topicMode: trendTopic ? "trending-topic" : "comparison-fallback",
          keyword: trendTopic?.keyword ?? null,
          comparisonId: comparison?.id ?? null,
          authorName: author.name,
          authorEmail: author.email,
          slug,
          title: generated.title,
          excerpt: generated.excerpt,
          preview: generated.contentHtml.slice(0, 600),
        },
        null,
        2
      )
    );
    return;
  }

  const article = await prisma.article.create({
    data: {
      title: generated.title,
      slug,
      excerpt: generated.excerpt,
      content: generated.contentHtml,
      published: true,
      authorId: author.id,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      createdAt: true,
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  console.log(
    JSON.stringify(
      {
        mode: "published",
        topicMode: trendTopic ? "trending-topic" : "comparison-fallback",
        keyword: trendTopic?.keyword ?? null,
        comparisonId: comparison?.id ?? null,
        article,
      },
      null,
      2
    )
  );

  // Auto-post to Reddit after publishing
  await postToReddit({ title: article.title, slug: article.slug });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
