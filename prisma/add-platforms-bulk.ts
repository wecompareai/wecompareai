/**
 * Bulk-add 100 AI platforms to the ai-platforms comparison.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=<key> npx tsx prisma/add-platforms-bulk.ts
 *
 * What it does:
 *  1. Reads the current ai-platforms comparison from the DB.
 *  2. Reorders existing columns to match the desired sequence.
 *  3. For each new platform (not already present) asks Claude to fill
 *     in all 39 feature-row values in batches of 10.
 *  4. Saves the updated comparison back to the DB.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────
// 1.  Master ordered list of 100 platforms
// ─────────────────────────────────────────────────────────────
interface PlatformDef {
  id: string;
  name: string;
  provider: string;
  logo: string;
  url: string;
}

const ORDERED_PLATFORMS: PlatformDef[] = [
  // 1-10: Foundation model labs (West + China)
  { id: "openai",       name: "OpenAI",              provider: "OpenAI",           logo: "/logos/openai.svg",       url: "https://platform.openai.com" },
  { id: "google-ai",    name: "Google DeepMind",      provider: "Google DeepMind",  logo: "/logos/google.svg",       url: "https://deepmind.google" },
  { id: "anthropic",    name: "Anthropic",            provider: "Anthropic",        logo: "/logos/anthropic.svg",    url: "https://console.anthropic.com" },
  { id: "meta",         name: "Meta AI",              provider: "Meta",             logo: "/logos/meta.svg",         url: "https://ai.meta.com" },
  { id: "xai",          name: "xAI",                  provider: "xAI",              logo: "/logos/xai.svg",          url: "https://x.ai" },
  { id: "mistral",      name: "Mistral AI",           provider: "Mistral AI",       logo: "/logos/mistral.svg",      url: "https://mistral.ai" },
  { id: "cohere",       name: "Cohere",               provider: "Cohere",           logo: "/logos/cohere.svg",       url: "https://cohere.com" },
  { id: "ai21",         name: "AI21 Labs",            provider: "AI21 Labs",        logo: "/logos/ai21.svg",         url: "https://www.ai21.com" },
  { id: "deepseek",     name: "DeepSeek",             provider: "DeepSeek",         logo: "/logos/deepseek.svg",     url: "https://deepseek.com" },
  { id: "alibaba",      name: "Alibaba (Qwen)",        provider: "Alibaba",          logo: "/logos/alibaba.svg",      url: "https://qwen.ai" },
  // 11-20: Asian AI labs
  { id: "baidu",        name: "Baidu (ERNIE)",         provider: "Baidu",            logo: "/logos/baidu.svg",        url: "https://ernie.baidu.com" },
  { id: "tencent-ai",   name: "Tencent AI",            provider: "Tencent",          logo: "/logos/tencent.svg",      url: "https://ai.tencent.com" },
  { id: "huawei-ai",    name: "Huawei (Pangu)",        provider: "Huawei",           logo: "/logos/huawei.svg",       url: "https://www.huaweicloud.com/product/pangu.html" },
  { id: "naver-ai",     name: "Naver (HyperCLOVA X)", provider: "Naver",            logo: "/logos/naver.svg",        url: "https://clova.ai" },
  { id: "kakao-brain",  name: "Kakao Brain",           provider: "Kakao",            logo: "/logos/kakao.svg",        url: "https://kakaobrain.com" },
  { id: "samsung-ai",   name: "Samsung AI",            provider: "Samsung",          logo: "/logos/samsung.svg",      url: "https://research.samsung.com/aai" },
  { id: "lg-ai",        name: "LG AI Research",        provider: "LG",               logo: "/logos/lg.svg",           url: "https://www.lgresearch.ai" },
  { id: "bytedance-ai", name: "ByteDance (Doubao)",    provider: "ByteDance",        logo: "/logos/bytedance.svg",    url: "https://www.doubao.com" },
  { id: "sensetime",    name: "SenseTime",             provider: "SenseTime",        logo: "/logos/sensetime.svg",    url: "https://www.sensetime.com" },
  { id: "iflytek",      name: "iFLYTEK",               provider: "iFLYTEK",          logo: "/logos/iflytek.svg",      url: "https://www.iflytek.com" },
  // 21-40: Big-tech cloud AI
  { id: "azure-ai",         name: "Microsoft Azure AI",       provider: "Microsoft",  logo: "/logos/azure.svg",       url: "https://azure.microsoft.com/en-us/products/ai-services" },
  { id: "aws-bedrock",      name: "Amazon AWS / Bedrock",     provider: "Amazon",     logo: "/logos/aws.svg",         url: "https://aws.amazon.com/bedrock/" },
  { id: "google-vertex",    name: "Google Cloud Vertex AI",   provider: "Google",     logo: "/logos/google.svg",      url: "https://cloud.google.com/vertex-ai" },
  { id: "ibm",              name: "IBM watsonx",              provider: "IBM",        logo: "/logos/ibm.svg",         url: "https://www.ibm.com/watsonx" },
  { id: "oracle-ai",        name: "Oracle AI",                provider: "Oracle",     logo: "/logos/oracle.svg",      url: "https://www.oracle.com/artificial-intelligence/" },
  { id: "salesforce-ai",    name: "Salesforce Einstein",      provider: "Salesforce", logo: "/logos/salesforce.svg",  url: "https://www.salesforce.com/products/einstein/" },
  { id: "sap-ai",           name: "SAP Business AI",          provider: "SAP",        logo: "/logos/sap.svg",         url: "https://www.sap.com/products/artificial-intelligence.html" },
  { id: "servicenow-ai",    name: "ServiceNow AI",            provider: "ServiceNow", logo: "/logos/servicenow.svg",  url: "https://www.servicenow.com/now-platform/ai.html" },
  { id: "adobe-ai",         name: "Adobe AI (Firefly)",       provider: "Adobe",      logo: "/logos/adobe.svg",       url: "https://firefly.adobe.com" },
  { id: "apple-ai",         name: "Apple Intelligence",       provider: "Apple",      logo: "/logos/apple.svg",       url: "https://www.apple.com/apple-intelligence/" },
  { id: "intel-ai",         name: "Intel AI (Gaudi)",         provider: "Intel",      logo: "/logos/intel.svg",       url: "https://www.intel.com/content/www/us/en/developer/topic-technology/artificial-intelligence/overview.html" },
  { id: "nvidia",           name: "NVIDIA AI (NIM)",          provider: "NVIDIA",     logo: "/logos/nvidia.svg",      url: "https://build.nvidia.com" },
  { id: "qualcomm-ai",      name: "Qualcomm AI",              provider: "Qualcomm",   logo: "/logos/qualcomm.svg",    url: "https://www.qualcomm.com/research/artificial-intelligence" },
  { id: "amd-ai",           name: "AMD AI (ROCm)",            provider: "AMD",        logo: "/logos/amd.svg",         url: "https://www.amd.com/en/products/accelerators/instinct.html" },
  { id: "dell-ai",          name: "Dell AI Factory",          provider: "Dell",       logo: "/logos/dell.svg",        url: "https://www.dell.com/en-us/dt/ai.htm" },
  { id: "hpe-ai",           name: "HPE AI",                   provider: "HPE",        logo: "/logos/hpe.svg",         url: "https://www.hpe.com/us/en/solutions/artificial-intelligence.html" },
  { id: "lenovo-ai",        name: "Lenovo AI",                provider: "Lenovo",     logo: "/logos/lenovo.svg",      url: "https://www.lenovo.com/us/en/solutions/artificial-intelligence" },
  { id: "cisco-ai",         name: "Cisco AI",                 provider: "Cisco",      logo: "/logos/cisco.svg",       url: "https://www.cisco.com/c/en/us/solutions/artificial-intelligence.html" },
  { id: "vmware-ai",        name: "VMware (Broadcom) AI",     provider: "Broadcom",   logo: "/logos/vmware.svg",      url: "https://www.vmware.com/solutions/artificial-intelligence.html" },
  { id: "snowflake-ai",     name: "Snowflake AI / Cortex",   provider: "Snowflake",  logo: "/logos/snowflake.svg",   url: "https://www.snowflake.com/en/data-cloud/cortex/" },
  // 41-60: Enterprise AI / MLOps
  { id: "databricks",       name: "Databricks",               provider: "Databricks", logo: "/logos/databricks.svg",  url: "https://www.databricks.com" },
  { id: "palantir",         name: "Palantir",                 provider: "Palantir",   logo: "/logos/palantir.svg",    url: "https://www.palantir.com" },
  { id: "datarobot",        name: "DataRobot",                provider: "DataRobot",  logo: "/logos/datarobot.svg",   url: "https://www.datarobot.com" },
  { id: "dataiku",          name: "Dataiku",                  provider: "Dataiku",    logo: "/logos/dataiku.svg",     url: "https://www.dataiku.com" },
  { id: "h2oai",            name: "H2O.ai",                   provider: "H2O.ai",     logo: "/logos/h2oai.svg",       url: "https://h2o.ai" },
  { id: "c3ai",             name: "C3.ai",                    provider: "C3.ai",      logo: "/logos/c3ai.svg",        url: "https://c3.ai" },
  { id: "scale-ai",         name: "Scale AI",                 provider: "Scale AI",   logo: "/logos/scale.svg",       url: "https://scale.com" },
  { id: "domino",           name: "Domino Data Lab",          provider: "Domino",     logo: "/logos/domino.svg",      url: "https://domino.ai" },
  { id: "wandb",            name: "Weights & Biases",         provider: "W&B",        logo: "/logos/wandb.svg",       url: "https://wandb.ai" },
  { id: "mlflow",           name: "MLflow",                   provider: "Databricks", logo: "/logos/mlflow.svg",      url: "https://mlflow.org" },
  { id: "seldon",           name: "Seldon",                   provider: "Seldon",     logo: "/logos/seldon.svg",      url: "https://www.seldon.io" },
  { id: "iguazio",          name: "Iguazio",                  provider: "Iguazio",    logo: "/logos/iguazio.svg",     url: "https://www.iguazio.com" },
  { id: "tecton",           name: "Tecton",                   provider: "Tecton",     logo: "/logos/tecton.svg",      url: "https://www.tecton.ai" },
  { id: "anyscale",         name: "Anyscale (Ray)",           provider: "Anyscale",   logo: "/logos/anyscale.svg",    url: "https://www.anyscale.com" },
  { id: "cloudera",         name: "Cloudera",                 provider: "Cloudera",   logo: "/logos/cloudera.svg",    url: "https://www.cloudera.com" },
  { id: "elastic",          name: "Elastic (ESRE)",           provider: "Elastic",    logo: "/logos/elastic.svg",     url: "https://www.elastic.co/ai-search" },
  { id: "mongodb-ai",       name: "MongoDB Atlas AI",         provider: "MongoDB",    logo: "/logos/mongodb.svg",     url: "https://www.mongodb.com/products/platform/atlas-vector-search" },
  { id: "confluent",        name: "Confluent (Flink + AI)",   provider: "Confluent",  logo: "/logos/confluent.svg",   url: "https://www.confluent.io" },
  { id: "redis-ai",         name: "Redis (Vector + AI)",      provider: "Redis",      logo: "/logos/redis.svg",       url: "https://redis.io/solutions/vector-database/" },
  { id: "pinecone",         name: "Pinecone",                 provider: "Pinecone",   logo: "/logos/pinecone.svg",    url: "https://www.pinecone.io" },
  // 61-80: Open-source, inference & GPU cloud
  { id: "huggingface",      name: "Hugging Face",             provider: "Hugging Face",  logo: "/logos/huggingface.svg",  url: "https://huggingface.co" },
  { id: "stability",        name: "Stability AI",             provider: "Stability AI",  logo: "/logos/stability.svg",    url: "https://stability.ai" },
  { id: "together",         name: "Together AI",              provider: "Together AI",   logo: "/logos/together.svg",     url: "https://together.ai" },
  { id: "replicate",        name: "Replicate",                provider: "Replicate",     logo: "/logos/replicate.svg",    url: "https://replicate.com" },
  { id: "groq",             name: "Groq",                     provider: "Groq",          logo: "/logos/groq.svg",         url: "https://groq.com" },
  { id: "cerebras",         name: "Cerebras",                 provider: "Cerebras",      logo: "/logos/cerebras.svg",     url: "https://cerebras.ai" },
  { id: "sambanova",        name: "SambaNova",                provider: "SambaNova",     logo: "/logos/sambanova.svg",    url: "https://sambanova.ai" },
  { id: "graphcore",        name: "Graphcore",                provider: "Graphcore",     logo: "/logos/graphcore.svg",    url: "https://www.graphcore.ai" },
  { id: "tenstorrent",      name: "Tenstorrent",              provider: "Tenstorrent",   logo: "/logos/tenstorrent.svg",  url: "https://tenstorrent.com" },
  { id: "runpod",           name: "RunPod",                   provider: "RunPod",        logo: "/logos/runpod.svg",       url: "https://www.runpod.io" },
  { id: "lambda-labs",      name: "Lambda Labs",              provider: "Lambda",        logo: "/logos/lambda.svg",       url: "https://lambdalabs.com" },
  { id: "coreweave",        name: "CoreWeave",                provider: "CoreWeave",     logo: "/logos/coreweave.svg",    url: "https://www.coreweave.com" },
  { id: "crusoe",           name: "Crusoe",                   provider: "Crusoe",        logo: "/logos/crusoe.svg",       url: "https://crusoe.ai" },
  { id: "octoai",           name: "OctoAI",                   provider: "OctoAI",        logo: "/logos/octoai.svg",       url: "https://octo.ai" },
  { id: "fireworks-ai",     name: "Fireworks AI",             provider: "Fireworks AI",  logo: "/logos/fireworks.svg",    url: "https://fireworks.ai" },
  { id: "modal",            name: "Modal",                    provider: "Modal",         logo: "/logos/modal.svg",        url: "https://modal.com" },
  { id: "baseten",          name: "Baseten",                  provider: "Baseten",       logo: "/logos/baseten.svg",      url: "https://www.baseten.co" },
  { id: "openrouter",       name: "OpenRouter",               provider: "OpenRouter",    logo: "/logos/openrouter.svg",   url: "https://openrouter.ai" },
  { id: "lm-studio",        name: "LM Studio",                provider: "LM Studio",     logo: "/logos/lmstudio.svg",     url: "https://lmstudio.ai" },
  { id: "ollama",           name: "Ollama",                   provider: "Ollama",        logo: "/logos/ollama.svg",       url: "https://ollama.com" },
  // 81-100: GenAI apps, media & automation
  { id: "perplexity",       name: "Perplexity",               provider: "Perplexity",       logo: "/logos/perplexity.svg",      url: "https://docs.perplexity.ai" },
  { id: "midjourney",       name: "Midjourney",               provider: "Midjourney",       logo: "/logos/midjourney.svg",      url: "https://www.midjourney.com" },
  { id: "runway",           name: "Runway",                   provider: "Runway",           logo: "/logos/runway.svg",          url: "https://runwayml.com" },
  { id: "pika",             name: "Pika",                     provider: "Pika Labs",        logo: "/logos/pika.svg",            url: "https://pika.style/?via=wecompareai" },
  { id: "synthesia",        name: "Synthesia",                provider: "Synthesia",        logo: "/logos/synthesia.svg",       url: "https://www.synthesia.io" },
  { id: "descript",         name: "Descript",                 provider: "Descript",         logo: "/logos/descript.svg",        url: "https://www.descript.com" },
  { id: "elevenlabs",       name: "ElevenLabs",               provider: "ElevenLabs",       logo: "/logos/elevenlabs.svg",      url: "https://try.elevenlabs.io/wecompareai" },
  { id: "suno",             name: "Suno",                     provider: "Suno",             logo: "/logos/suno.svg",            url: "https://suno.com" },
  { id: "luma-ai",          name: "Luma AI",                  provider: "Luma AI",          logo: "/logos/luma.svg",            url: "https://lumalabs.ai" },
  { id: "jasper",           name: "Jasper",                   provider: "Jasper",           logo: "/logos/jasper.svg",          url: "https://www.jasper.ai" },
  { id: "grammarly",        name: "Grammarly",                provider: "Grammarly",        logo: "/logos/grammarly.svg",       url: "https://www.grammarly.com" },
  { id: "notion-ai",        name: "Notion AI",                provider: "Notion",           logo: "/logos/notion.svg",          url: "https://www.notion.so/product/ai" },
  { id: "canva-ai",         name: "Canva AI",                 provider: "Canva",            logo: "/logos/canva.svg",           url: "https://www.canva.com/ai-tools/" },
  { id: "figma-ai",         name: "Figma AI",                 provider: "Figma",            logo: "/logos/figma.svg",           url: "https://www.figma.com/ai/" },
  { id: "uipath",           name: "UiPath",                   provider: "UiPath",           logo: "/logos/uipath.svg",          url: "https://www.uipath.com" },
  { id: "automation-anywhere", name: "Automation Anywhere",  provider: "Automation Anywhere", logo: "/logos/automationanywhere.svg", url: "https://www.automationanywhere.com" },
  { id: "celonis",          name: "Celonis",                  provider: "Celonis",          logo: "/logos/celonis.svg",         url: "https://www.celonis.com" },
  { id: "crowdstrike-ai",   name: "CrowdStrike AI",           provider: "CrowdStrike",      logo: "/logos/crowdstrike.svg",     url: "https://www.crowdstrike.com/platform/charlotte-ai/" },
  { id: "darktrace",        name: "Darktrace",                provider: "Darktrace",        logo: "/logos/darktrace.svg",       url: "https://darktrace.com" },
  { id: "sentinelone-ai",   name: "SentinelOne AI",           provider: "SentinelOne",      logo: "/logos/sentinelone.svg",     url: "https://www.sentinelone.com/platform/purple-ai/" },
];

// ─────────────────────────────────────────────────────────────
// 2.  Feature rows (39 total) that Claude must fill
// ─────────────────────────────────────────────────────────────
const FEATURE_ROWS = [
  // General
  { group: "General", feature: "Company" },
  { group: "General", feature: "Headquarters" },
  { group: "General", feature: "Platform Type" },
  { group: "General", feature: "Free Tier" },
  { group: "General", feature: "Pay-as-you-go" },
  { group: "General", feature: "Open Source Models" },
  // API & Developer Experience
  { group: "API & Developer Experience", feature: "REST API" },
  { group: "API & Developer Experience", feature: "Python SDK" },
  { group: "API & Developer Experience", feature: "Node.js / TypeScript SDK" },
  { group: "API & Developer Experience", feature: "OpenAI-Compatible API" },
  { group: "API & Developer Experience", feature: "Playground / Studio" },
  { group: "API & Developer Experience", feature: "Batch API" },
  { group: "API & Developer Experience", feature: "Streaming Support" },
  // Platform Features
  { group: "Platform Features", feature: "Fine-tuning" },
  { group: "Platform Features", feature: "Function / Tool Calling" },
  { group: "Platform Features", feature: "RAG / Search Integration" },
  { group: "Platform Features", feature: "Structured Output (JSON)" },
  { group: "Platform Features", feature: "Custom Model Hosting" },
  { group: "Platform Features", feature: "Content Moderation" },
  // Pricing
  { group: "Pricing (Flagship Model per 1M tokens)", feature: "Input Price" },
  { group: "Pricing (Flagship Model per 1M tokens)", feature: "Output Price" },
  { group: "Pricing (Flagship Model per 1M tokens)", feature: "Budget Model Input" },
  // Enterprise & Compliance
  { group: "Enterprise & Compliance", feature: "SOC 2 Compliance" },
  { group: "Enterprise & Compliance", feature: "HIPAA Compliance" },
  { group: "Enterprise & Compliance", feature: "Data Residency Options" },
  { group: "Enterprise & Compliance", feature: "On-Premises Deployment" },
  { group: "Enterprise & Compliance", feature: "SLA Available" },
  // Models Portfolio - Text & Chat
  { group: "Models Portfolio - Text & Chat", feature: "Flagship LLM" },
  { group: "Models Portfolio - Text & Chat", feature: "Fast/Lite Model" },
  { group: "Models Portfolio - Text & Chat", feature: "Reasoning Model" },
  { group: "Models Portfolio - Text & Chat", feature: "Code Specialist" },
  // Models Portfolio - Multimodal & Media
  { group: "Models Portfolio - Multimodal & Media", feature: "Vision/Multimodal" },
  { group: "Models Portfolio - Multimodal & Media", feature: "Image Generation" },
  { group: "Models Portfolio - Multimodal & Media", feature: "Embedding Model" },
  { group: "Models Portfolio - Multimodal & Media", feature: "Speech & Audio" },
  { group: "Models Portfolio - Multimodal & Media", feature: "Video Generation" },
  // Models Portfolio - Key Use Cases
  { group: "Models Portfolio - Key Use Cases", feature: "Primary Strength" },
  { group: "Models Portfolio - Key Use Cases", feature: "Best For" },
  { group: "Models Portfolio - Key Use Cases", feature: "Target Audience" },
];

// ─────────────────────────────────────────────────────────────
// 3.  Claude API helper
// ─────────────────────────────────────────────────────────────
async function askClaude(prompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${txt}`);
  }
  const data = await res.json();
  return data.content[0].text as string;
}

// ─────────────────────────────────────────────────────────────
// 4.  Fetch values for a batch of platforms via Claude
// ─────────────────────────────────────────────────────────────
async function fetchBatchValues(
  batch: PlatformDef[]
): Promise<Record<string, Record<string, string | boolean>>> {
  const featureList = FEATURE_ROWS.map(
    (r) => `[${r.group}] "${r.feature}"`
  ).join("\n");

  const prompt = `You are an expert AI industry researcher. Fill in the comparison data for the following AI platforms.

Platforms:
${batch.map((p, i) => `${i + 1}. ${p.name} (${p.provider}) — ${p.url}`).join("\n")}

Features to fill (39 total):
${featureList}

Rules:
- For boolean features (Free Tier, Pay-as-you-go, Open Source Models, REST API, Python SDK, Node.js/TypeScript SDK, OpenAI-Compatible API, Playground/Studio, Batch API, Streaming Support, Fine-tuning, Function/Tool Calling, RAG/Search Integration, Structured Output (JSON), Custom Model Hosting, Content Moderation, SOC 2 Compliance, HIPAA Compliance, Data Residency Options, On-Premises Deployment, SLA Available) use JSON true or false.
- For string features use concise strings (≤60 chars). Use "N/A" when not applicable.
- For Pricing features use format like "$X.XX (Model Name)" or "N/A" or "Free / open source".

Return ONLY valid JSON — no markdown, no prose, no code fences:
{
  "<platform_id>": {
    "<exact feature name>": <value>
  }
}

Platform IDs to use as keys: ${batch.map((p) => p.id).join(", ")}`;

  const raw = await askClaude(prompt);

  // Strip any accidental markdown fences
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("No JSON found in response:", raw.slice(0, 200));
    throw new Error("Could not parse Claude response");
  }

  return JSON.parse(jsonMatch[0]);
}

// ─────────────────────────────────────────────────────────────
// 5.  Main
// ─────────────────────────────────────────────────────────────
async function main() {
  console.log("Loading current ai-platforms comparison from DB…");

  const category = await prisma.category.findUnique({
    where: { slug: "ai-platforms" },
    include: { comparison: true },
  });

  if (!category?.comparison) {
    throw new Error("ai-platforms comparison not found in DB. Run seed-ai-platforms.ts first.");
  }

  const currentData = JSON.parse(category.comparison.data) as {
    columns: PlatformDef[];
    groups: { name: string; rows: { feature: string; tooltip?: string; values: Record<string, string | boolean> }[] }[];
  };

  const existingIds = new Set(currentData.columns.map((c) => c.id));
  const newPlatforms = ORDERED_PLATFORMS.filter((p) => !existingIds.has(p.id));

  console.log(`Found ${currentData.columns.length} existing platforms.`);
  console.log(`Need to add ${newPlatforms.length} new platforms.`);

  // ── 5a. Collect all values for new platforms in batches of 10 ──
  const allNewValues: Record<string, Record<string, string | boolean>> = {};

  const BATCH_SIZE = 10;
  for (let i = 0; i < newPlatforms.length; i += BATCH_SIZE) {
    const batch = newPlatforms.slice(i, i + BATCH_SIZE);
    console.log(
      `\nBatch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(newPlatforms.length / BATCH_SIZE)}: ` +
      batch.map((p) => p.name).join(", ")
    );

    let batchValues: Record<string, Record<string, string | boolean>>;
    try {
      batchValues = await fetchBatchValues(batch);
    } catch (err) {
      console.error("Batch failed, retrying once…", err);
      await new Promise((r) => setTimeout(r, 5000));
      batchValues = await fetchBatchValues(batch);
    }

    Object.assign(allNewValues, batchValues);
    console.log(`  ✓ Got values for: ${Object.keys(batchValues).join(", ")}`);

    // Polite delay between batches
    if (i + BATCH_SIZE < newPlatforms.length) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  // ── 5b. Build updated columns in the desired order ──
  const updatedColumns = ORDERED_PLATFORMS.map((ordered) => {
    const existing = currentData.columns.find((c) => c.id === ordered.id);
    return existing ?? ordered; // prefer existing column definition (has stable ID)
  });

  // ── 5c. Build updated groups — merge new column values into every row ──
  const updatedGroups = currentData.groups.map((group) => ({
    ...group,
    rows: group.rows.map((row) => {
      const mergedValues = { ...row.values };
      for (const p of newPlatforms) {
        const platformValues = allNewValues[p.id] ?? {};
        mergedValues[p.id] = platformValues[row.feature] ?? "";
      }
      return { ...row, values: mergedValues };
    }),
  }));

  // ── 5d. Save to DB ──
  console.log("\nSaving to DB…");
  await prisma.comparison.update({
    where: { id: category.comparison.id },
    data: {
      data: JSON.stringify({ columns: updatedColumns, groups: updatedGroups }),
      lastUpdated: new Date(),
    },
  });

  const total = updatedColumns.length;
  console.log(`\n✅ Done! Comparison now has ${total} platforms.`);
  console.log("Column order:");
  updatedColumns.forEach((c, i) => console.log(`  ${i + 1}. ${c.name}`));
}

main()
  .catch((e) => {
    console.error("Script failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
