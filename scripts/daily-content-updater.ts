/**
 * daily-content-updater.ts
 *
 * Runs nightly at midnight. Uses Claude to:
 *   1. Fetch recent AI news (Google Trends RSS + Bing AI News RSS)
 *   2. Identify any new models, pricing changes, or notable developments
 *   3. Decide which scores/data need updating in lib files
 *   4. Apply updates directly to the source files
 *   5. Always bump all lastUpdated timestamps to today
 *   6. Commit and push to origin/Saurabh_Local_Dev
 *
 * Usage:
 *   npx tsx scripts/daily-content-updater.ts [--dry-run]
 */

import fs from "fs";
import path from "path";
import { execSync, spawnSync } from "child_process";

// ── Config ────────────────────────────────────────────────────────────────────
const REPO_ROOT = path.resolve(__dirname, "..");
const BRANCH = "Saurabh_Local_Dev";
const TODAY = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ?? "";
const ANTHROPIC_MODEL   = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

const GOOGLE_TRENDS_RSS = "https://trends.google.com/trending/rss?geo=US";
const BING_AI_NEWS_RSS  = "https://www.bing.com/news/search?q=artificial+intelligence+AI+models&format=RSS&mkt=en-US";

const DRY_RUN = process.argv.includes("--dry-run");

// Files that contain lastUpdated fields (bulk timestamp update)
const LIB_FILES = [
  "src/lib/scores.ts",
  "src/lib/alternatives.ts",
  "src/lib/best-for.ts",
  "src/lib/glossary.ts",
  "src/lib/vs.ts",
  "src/lib/pricing.ts",
];

// Page files with hardcoded dates to keep fresh
const PAGE_FILES = [
  "src/app/research/llm-leaderboard/page.tsx",
  "src/app/research/ai-news/page.tsx",
  "src/app/research/market-share/page.tsx",
  "src/app/research/pricing-index/page.tsx",
  "src/app/methodology/page.tsx",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function loadEnv() {
  for (const file of [".env", ".env.local"]) {
    const p = path.join(REPO_ROOT, file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split("\n")) {
      const m = line.match(/^([^#=\s]+)\s*=\s*"?([^"]*)"?\s*$/);
      if (m) process.env[m[1]] = m[2];
    }
  }
}

async function fetchText(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "AICompareContentUpdater/1.0", accept: "application/rss+xml,text/xml,*/*" },
      signal: AbortSignal.timeout(15_000),
    });
    return res.ok ? res.text() : "";
  } catch {
    return "";
  }
}

function extractRssTitles(xml: string): string[] {
  const matches = xml.matchAll(/<title><!\[CDATA\[([^\]]+)\]\]><\/title>|<title>([^<]+)<\/title>/g);
  const titles: string[] = [];
  for (const m of matches) {
    const t = (m[1] ?? m[2] ?? "").trim();
    if (t && t.length > 5 && !t.toLowerCase().includes("google trends")) {
      titles.push(t);
    }
  }
  return titles.slice(0, 20);
}

async function callClaude(systemPrompt: string, userPrompt: string, maxTokens = 4096): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });
  const data = (await res.json()) as { content?: { type: string; text: string }[]; error?: { message: string } };
  if (!res.ok) throw new Error(`Claude API error: ${data.error?.message ?? res.status}`);
  return data.content?.find((b) => b.type === "text")?.text?.trim() ?? "";
}

function readFile(relPath: string): string {
  return fs.readFileSync(path.join(REPO_ROOT, relPath), "utf8");
}

function writeFile(relPath: string, content: string) {
  fs.writeFileSync(path.join(REPO_ROOT, relPath), content, "utf8");
}

function bumpTimestamps(content: string, oldDate: RegExp, newDate: string): string {
  return content.replace(oldDate, newDate);
}

function gitRun(args: string[]): string {
  const result = spawnSync("git", args, { cwd: REPO_ROOT, encoding: "utf8" });
  if (result.error) throw result.error;
  return (result.stdout ?? "").trim();
}

function log(msg: string) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

// ── Step 1: Fetch news headlines ──────────────────────────────────────────────
async function fetchNewsHeadlines(): Promise<string[]> {
  const [googleXml, bingXml] = await Promise.all([
    fetchText(GOOGLE_TRENDS_RSS),
    fetchText(BING_AI_NEWS_RSS),
  ]);
  const google = extractRssTitles(googleXml);
  const bing   = extractRssTitles(bingXml);
  return [...new Set([...bing, ...google])].slice(0, 30);
}

// ── Step 2: Ask Claude what needs updating ────────────────────────────────────
async function identifyUpdates(headlines: string[], scoresContent: string): Promise<{
  newModels: { id: string; name: string; provider: string; category: string; performance: number; value: number; reliability: number; easeOfUse: number; verdict: string }[];
  scoreUpdates: { id: string; field: string; newValue: number; reason: string }[];
  pricingNotes: string[];
  aiNewsItems: { date: string; category: string; headline: string; body: string; impact: string }[];
  summary: string;
}> {
  const system = `You are an AI industry analyst. You monitor model releases and pricing changes.
Today's date is ${TODAY}.
Respond ONLY with valid JSON, no markdown, no commentary.`;

  const prompt = `Here are today's AI news headlines:
${headlines.map((h, i) => `${i + 1}. ${h}`).join("\n")}

Here is the current scores.ts data (tool list and scores out of 10):
${scoresContent.slice(0, 8000)}

Based on the headlines, identify:
1. Any NEW AI models released in the last 7 days NOT yet in scores.ts (only add if confident it's a real new release)
2. Any score changes needed for EXISTING tools (e.g. a tool got worse/better based on news)
3. Key pricing changes mentioned
4. 1-2 AI news digest items for the ai-news page (brief, factual)

Return this exact JSON structure:
{
  "newModels": [
    {
      "id": "kebab-case-id",
      "name": "Display Name",
      "provider": "Company",
      "category": "LLM|Coding|Image|Audio|Video|Search|Music|Cloud",
      "performance": 8.5,
      "value": 8.0,
      "reliability": 8.0,
      "easeOfUse": 8.0,
      "verdict": "One line verdict."
    }
  ],
  "scoreUpdates": [
    { "id": "existing-tool-id", "field": "performance|value|reliability|easeOfUse", "newValue": 9.0, "reason": "Why" }
  ],
  "pricingNotes": ["Brief pricing change note"],
  "aiNewsItems": [
    { "date": "${TODAY}", "category": "Model Release|Pricing|Benchmark|Compliance", "headline": "...", "body": "2-3 sentence factual summary.", "impact": "High|Medium|Low" }
  ],
  "summary": "One sentence summary of today's AI news."
}

If nothing notable is found, return empty arrays and a summary like "No major AI developments detected today."`;

  const raw = await callClaude(system, prompt, 2048);

  // Extract JSON from response
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    log("Claude returned no JSON — using empty update");
    return { newModels: [], scoreUpdates: [], pricingNotes: [], aiNewsItems: [], summary: "No updates today." };
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    log("JSON parse failed — using empty update");
    return { newModels: [], scoreUpdates: [], pricingNotes: [], aiNewsItems: [], summary: "No updates today." };
  }
}

// ── Step 3: Apply updates to scores.ts ────────────────────────────────────────
function applyScoreUpdates(
  content: string,
  scoreUpdates: { id: string; field: string; newValue: number }[],
  newModels: { id: string; name: string; provider: string; category: string; performance: number; value: number; reliability: number; easeOfUse: number; verdict: string }[]
): string {
  let updated = content;

  // Apply score changes to existing tools
  for (const update of scoreUpdates) {
    const pattern = new RegExp(
      `(id: "${update.id}"[\\s\\S]*?${update.field}: )[\\d.]+`,
      "g"
    );
    updated = updated.replace(pattern, `$1${update.newValue}`);
  }

  // Append new models before the closing ]; of ALL_SCORES
  if (newModels.length > 0) {
    const newEntries = newModels.map((m) => {
      const overall = Math.round((m.performance * 0.35 + m.value * 0.30 + m.reliability * 0.20 + m.easeOfUse * 0.15) * 10) / 10;
      return `  {
    id: "${m.id}",
    name: "${m.name}",
    provider: "${m.provider}",
    category: "${m.category}",
    performance: ${m.performance},
    value: ${m.value},
    reliability: ${m.reliability},
    easeOfUse: ${m.easeOfUse},
    overall: calcOverall(${m.performance}, ${m.value}, ${m.reliability}, ${m.easeOfUse}),
    verdict: "${m.verdict}",
    lastUpdated: "${TODAY}",
  },`;
    }).join("\n");

    updated = updated.replace(/^];/m, `${newEntries}\n];`);
  }

  return updated;
}

// ── Step 4: Update ai-news page with new headlines ────────────────────────────
function updateAiNewsPage(
  content: string,
  aiNewsItems: { date: string; category: string; headline: string; body: string; impact: string }[]
): string {
  if (aiNewsItems.length === 0) return content;

  // Build new news item entries
  const categoryColors: Record<string, string> = {
    "Model Release": "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
    "Pricing":       "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    "Benchmark":     "text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20",
    "Compliance":    "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
  };

  const formatted = new Date(TODAY).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const newItemsStr = aiNewsItems.map((item) => {
    const color = categoryColors[item.category] ?? "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20";
    return `  {
    date: "${formatted}",
    week: "Auto-updated",
    category: "${item.category}",
    categoryColor: "${color}",
    headline: "${item.headline.replace(/"/g, '\\"')}",
    body: "${item.body.replace(/"/g, '\\"')}",
    impact: "${item.impact}",
    tools: [],
    links: [],
  },`;
  }).join("\n");

  // Prepend new items to NEWS_ITEMS array
  return content.replace(
    /const NEWS_ITEMS = \[/,
    `const NEWS_ITEMS = [\n${newItemsStr}`
  );
}

// ── Step 5: Bulk timestamp update across all files ────────────────────────────
function bumpAllTimestamps(files: string[]) {
  const oldDatePattern = /\d{4}-\d{2}-\d{2}/g;
  let changedCount = 0;
  for (const relPath of files) {
    const fullPath = path.join(REPO_ROOT, relPath);
    if (!fs.existsSync(fullPath)) continue;
    const original = fs.readFileSync(fullPath, "utf8");
    // Only replace dates that look like lastUpdated or dateModified values
    const updated = original
      .replace(/(lastUpdated:\s*["'])\d{4}-\d{2}-\d{2}(["'])/g, `$1${TODAY}$2`)
      .replace(/(dateModified:\s*["'])\d{4}-\d{2}-\d{2}(["'])/g, `$1${TODAY}$2`);
    if (updated !== original) {
      fs.writeFileSync(fullPath, updated, "utf8");
      changedCount++;
    }
  }
  return changedCount;
}

// ── Step 6: Bump hardcoded month references in page files ────────────────────
function bumpPageDates(files: string[]) {
  const monthMap: Record<string, string> = {
    "January": "April", "February": "April", "March": "April",
    "April": "April", "Q1 2026": "April 2026", "Q2 2026": "April 2026",
  };
  for (const relPath of files) {
    const fullPath = path.join(REPO_ROOT, relPath);
    if (!fs.existsSync(fullPath)) continue;
    let content = fs.readFileSync(fullPath, "utf8");
    // Update "Updated Month YYYY" patterns
    content = content.replace(/Updated (January|February|March) 2026/g, "Updated April 2026");
    content = content.replace(/Updated Q[12] 2026/g, "Updated April 2026");
    // Update "Live rankings · Updated Month D, YYYY"
    content = content.replace(
      /Updated (January|February|March|April) \d+, 2026/g,
      `Updated ${new Date(TODAY).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
    );
    fs.writeFileSync(fullPath, content, "utf8");
  }
}

// ── Step 7: Git commit and push ───────────────────────────────────────────────
function commitAndPush(summary: string, changedFiles: string[]) {
  if (changedFiles.length === 0) {
    log("No files changed — skipping commit");
    return;
  }

  // Stage changed files
  for (const f of changedFiles) {
    const fullPath = path.join(REPO_ROOT, f);
    if (fs.existsSync(fullPath)) {
      gitRun(["add", f]);
    }
  }

  // Check if anything is staged
  const staged = gitRun(["diff", "--cached", "--name-only"]);
  if (!staged.trim()) {
    log("Nothing staged — skipping commit");
    return;
  }

  const commitMsg = `Daily content update ${TODAY}: ${summary}\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`;
  gitRun(["commit", "-m", commitMsg]);
  gitRun(["push", "origin", BRANCH]);
  log(`Committed and pushed to origin/${BRANCH}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  loadEnv();

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  log(`Starting daily content updater (dry-run: ${DRY_RUN})`);

  // 1. Fetch news
  log("Fetching AI news headlines...");
  const headlines = await fetchNewsHeadlines();
  log(`Found ${headlines.length} headlines`);

  // 2. Read current scores
  const scoresPath = "src/lib/scores.ts";
  const scoresContent = readFile(scoresPath);

  // 3. Ask Claude what needs updating
  log("Asking Claude to identify updates...");
  const updates = await identifyUpdates(headlines, scoresContent);
  log(`Summary: ${updates.summary}`);
  log(`New models: ${updates.newModels.length}, Score updates: ${updates.scoreUpdates.length}, News items: ${updates.aiNewsItems.length}`);

  if (DRY_RUN) {
    console.log(JSON.stringify(updates, null, 2));
    log("Dry run complete — no files written");
    return;
  }

  const changedFiles: string[] = [];

  // 4. Apply score updates
  if (updates.newModels.length > 0 || updates.scoreUpdates.length > 0) {
    const updatedScores = applyScoreUpdates(scoresContent, updates.scoreUpdates, updates.newModels);
    writeFile(scoresPath, updatedScores);
    changedFiles.push(scoresPath);
    log(`scores.ts updated (${updates.newModels.length} new models, ${updates.scoreUpdates.length} score changes)`);
  }

  // 5. Update ai-news page
  if (updates.aiNewsItems.length > 0) {
    const aiNewsPath = "src/app/research/ai-news/page.tsx";
    const aiNewsContent = readFile(aiNewsPath);
    const updatedAiNews = updateAiNewsPage(aiNewsContent, updates.aiNewsItems);
    writeFile(aiNewsPath, updatedAiNews);
    changedFiles.push(aiNewsPath);
    log("ai-news page updated with new items");
  }

  // 6. Bump all lastUpdated and dateModified timestamps
  const allLibFiles = LIB_FILES.map((f) => f);
  // Also include scores if it was changed
  const timestampFiles = [...new Set([...allLibFiles, ...PAGE_FILES, scoresPath])];
  const timestampChanges = bumpAllTimestamps(timestampFiles);
  log(`Bumped timestamps in ${timestampChanges} files`);
  changedFiles.push(...timestampFiles);

  // 7. Bump hardcoded month/date strings in page files
  bumpPageDates(PAGE_FILES);
  changedFiles.push(...PAGE_FILES);

  // 8. Dedupe changed files list
  const uniqueFiles = [...new Set(changedFiles)];

  // 9. Commit and push
  commitAndPush(updates.summary, uniqueFiles);

  log("Daily content updater complete");
  console.log(JSON.stringify({
    date: TODAY,
    summary: updates.summary,
    newModels: updates.newModels.map((m) => m.name),
    scoreUpdates: updates.scoreUpdates.length,
    aiNewsItems: updates.aiNewsItems.map((i) => i.headline),
    filesChanged: uniqueFiles.length,
  }, null, 2));
}

main().catch((e) => {
  console.error("Content updater failed:", e.message);
  process.exit(1);
});
