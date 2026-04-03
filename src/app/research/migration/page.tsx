"use client";

import { useState } from "react";
import Link from "next/link";
import PremiumGate from "@/components/PremiumGate";

type CodeLang = "python" | "javascript" | "curl";

interface ModelInfo {
  id: string;
  label: string;
  provider: string;
  inputPer1M: number;
  outputPer1M: number;
  contextWindow: string;
  apiStyle: "openai" | "anthropic" | "google" | "meta" | "mistral";
}

const models: ModelInfo[] = [
  // OpenAI
  { id: "gpt-4", label: "GPT-4", provider: "OpenAI", inputPer1M: 30, outputPer1M: 60, contextWindow: "8K", apiStyle: "openai" },
  { id: "gpt-4o", label: "GPT-4o", provider: "OpenAI", inputPer1M: 2.5, outputPer1M: 10, contextWindow: "128K", apiStyle: "openai" },
  { id: "gpt-4o-mini", label: "GPT-4o mini", provider: "OpenAI", inputPer1M: 0.15, outputPer1M: 0.6, contextWindow: "128K", apiStyle: "openai" },
  { id: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", provider: "OpenAI", inputPer1M: 0.5, outputPer1M: 1.5, contextWindow: "16K", apiStyle: "openai" },
  // Anthropic
  { id: "claude-2", label: "Claude 2", provider: "Anthropic", inputPer1M: 8, outputPer1M: 24, contextWindow: "100K", apiStyle: "anthropic" },
  { id: "claude-3-haiku", label: "Claude 3 Haiku", provider: "Anthropic", inputPer1M: 0.25, outputPer1M: 1.25, contextWindow: "200K", apiStyle: "anthropic" },
  { id: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet", provider: "Anthropic", inputPer1M: 3, outputPer1M: 15, contextWindow: "200K", apiStyle: "anthropic" },
  { id: "claude-3-7-sonnet", label: "Claude 3.7 Sonnet", provider: "Anthropic", inputPer1M: 3, outputPer1M: 15, contextWindow: "200K", apiStyle: "anthropic" },
  // Google
  { id: "palm-2", label: "PaLM 2", provider: "Google", inputPer1M: 0.5, outputPer1M: 0.5, contextWindow: "8K", apiStyle: "google" },
  { id: "gemini-1-0-pro", label: "Gemini 1.0 Pro", provider: "Google", inputPer1M: 0.5, outputPer1M: 1.5, contextWindow: "32K", apiStyle: "google" },
  { id: "gemini-1-5-pro", label: "Gemini 1.5 Pro", provider: "Google", inputPer1M: 1.25, outputPer1M: 5, contextWindow: "2M", apiStyle: "google" },
  // Meta
  { id: "llama-2", label: "Llama 2", provider: "Meta", inputPer1M: 0.2, outputPer1M: 0.2, contextWindow: "4K", apiStyle: "meta" },
  { id: "llama-3-1-70b", label: "Llama 3.1 70B", provider: "Meta", inputPer1M: 0.59, outputPer1M: 0.79, contextWindow: "128K", apiStyle: "meta" },
  // Mistral
  { id: "mistral-7b", label: "Mistral 7B", provider: "Mistral", inputPer1M: 0.25, outputPer1M: 0.25, contextWindow: "32K", apiStyle: "mistral" },
  { id: "mistral-large", label: "Mistral Large", provider: "Mistral", inputPer1M: 2, outputPer1M: 6, contextWindow: "128K", apiStyle: "mistral" },
];

const groupedModels: { group: string; models: ModelInfo[] }[] = [
  { group: "OpenAI", models: models.filter((m) => m.provider === "OpenAI") },
  { group: "Anthropic", models: models.filter((m) => m.provider === "Anthropic") },
  { group: "Google", models: models.filter((m) => m.provider === "Google") },
  { group: "Meta", models: models.filter((m) => m.provider === "Meta") },
  { group: "Mistral", models: models.filter((m) => m.provider === "Mistral") },
];

function getMigrationEffort(source: ModelInfo, target: ModelInfo): { score: number; level: "Low" | "Medium" | "High"; days: string; description: string } {
  if (source.id === target.id) return { score: 0, level: "Low", days: "0 days", description: "Same model — no changes required." };
  if (source.provider === target.provider) return { score: 10, level: "Low", days: "0–2 days", description: "Same provider API. Update model name in your configuration. Test for output differences." };
  if (source.apiStyle === "openai" && target.apiStyle === "openai") return { score: 5, level: "Low", days: "0–1 days", description: "Both use OpenAI-compatible API format. Only the model name parameter needs updating." };
  if ((source.apiStyle === "openai" && target.apiStyle === "anthropic") || (source.apiStyle === "anthropic" && target.apiStyle === "openai")) {
    return { score: 40, level: "Medium", days: "2–5 days", description: "Different API format. Requires updating auth headers, endpoint URLs, request/response structure, and message format. Test edge cases thoroughly." };
  }
  if (target.apiStyle === "google") return { score: 50, level: "Medium", days: "3–7 days", description: "Google Generative AI uses a distinct SDK and request format. Update imports, auth method, content structure, and response parsing." };
  if (target.apiStyle === "meta" || target.apiStyle === "mistral") return { score: 35, level: "Medium", days: "2–5 days", description: "Often available via OpenAI-compatible endpoints (e.g., via Together AI or Groq). May require hosting setup for self-hosted variants." };
  return { score: 60, level: "High", days: "5–10 days", description: "Significant API differences. Plan for auth changes, endpoint migration, response format updates, and comprehensive regression testing." };
}

function getKeyChanges(source: ModelInfo, target: ModelInfo): string[] {
  if (source.id === target.id) return ["No changes required"];
  const changes: string[] = [];
  if (source.provider !== target.provider) changes.push(`Update API key from ${source.provider} to ${target.provider} credentials`);
  if (source.apiStyle !== target.apiStyle) {
    changes.push("Update API endpoint URL");
    changes.push("Rewrite request payload structure");
    changes.push("Update response parsing logic");
  }
  if (source.contextWindow !== target.contextWindow) changes.push(`Context window changes: ${source.contextWindow} → ${target.contextWindow}`);
  changes.push("Run regression tests on all prompts");
  changes.push("Update error handling for new error codes");
  if (source.provider !== target.provider) changes.push("Review rate limits and quotas for new provider");
  return changes;
}

function getCodeSnippets(source: ModelInfo, target: ModelInfo, lang: CodeLang): { before: string; after: string } {
  const snippets: Record<string, Record<CodeLang, { before: string; after: string }>> = {
    "openai-anthropic": {
      python: {
        before: `from openai import OpenAI

client = OpenAI(api_key="sk-...")

response = client.chat.completions.create(
    model="${source.id}",
    messages=[{"role": "user", "content": "Hello"}]
)

print(response.choices[0].message.content)`,
        after: `import anthropic

client = anthropic.Anthropic(api_key="sk-ant-...")

response = client.messages.create(
    model="${target.id}",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello"}]
)

print(response.content[0].text)`,
      },
      javascript: {
        before: `import OpenAI from "openai";

const client = new OpenAI({ apiKey: "sk-..." });

const response = await client.chat.completions.create({
  model: "${source.id}",
  messages: [{ role: "user", content: "Hello" }],
});

console.log(response.choices[0].message.content);`,
        after: `import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: "sk-ant-..." });

const response = await client.messages.create({
  model: "${target.id}",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello" }],
});

console.log(response.content[0].text);`,
      },
      curl: {
        before: `curl https://api.openai.com/v1/chat/completions \\
  -H "Authorization: Bearer sk-..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${source.id}",
    "messages": [{"role": "user", "content": "Hello"}]
  }'`,
        after: `curl https://api.anthropic.com/v1/messages \\
  -H "x-api-key: sk-ant-..." \\
  -H "anthropic-version: 2023-06-01" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${target.id}",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello"}]
  }'`,
      },
    },
    "anthropic-openai": {
      python: {
        before: `import anthropic

client = anthropic.Anthropic(api_key="sk-ant-...")

response = client.messages.create(
    model="${source.id}",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello"}]
)

print(response.content[0].text)`,
        after: `from openai import OpenAI

client = OpenAI(api_key="sk-...")

response = client.chat.completions.create(
    model="${target.id}",
    messages=[{"role": "user", "content": "Hello"}]
)

print(response.choices[0].message.content)`,
      },
      javascript: {
        before: `import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: "sk-ant-..." });

const response = await client.messages.create({
  model: "${source.id}",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello" }],
});

console.log(response.content[0].text);`,
        after: `import OpenAI from "openai";

const client = new OpenAI({ apiKey: "sk-..." });

const response = await client.chat.completions.create({
  model: "${target.id}",
  messages: [{ role: "user", content: "Hello" }],
});

console.log(response.choices[0].message.content);`,
      },
      curl: {
        before: `curl https://api.anthropic.com/v1/messages \\
  -H "x-api-key: sk-ant-..." \\
  -H "anthropic-version: 2023-06-01" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${source.id}",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello"}]
  }'`,
        after: `curl https://api.openai.com/v1/chat/completions \\
  -H "Authorization: Bearer sk-..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${target.id}",
    "messages": [{"role": "user", "content": "Hello"}]
  }'`,
      },
    },
    "openai-google": {
      python: {
        before: `from openai import OpenAI

client = OpenAI(api_key="sk-...")

response = client.chat.completions.create(
    model="${source.id}",
    messages=[{"role": "user", "content": "Hello"}]
)

print(response.choices[0].message.content)`,
        after: `import google.generativeai as genai

genai.configure(api_key="AIza...")

model = genai.GenerativeModel("${target.id}")

response = model.generate_content("Hello")

print(response.text)`,
      },
      javascript: {
        before: `import OpenAI from "openai";

const client = new OpenAI({ apiKey: "sk-..." });

const response = await client.chat.completions.create({
  model: "${source.id}",
  messages: [{ role: "user", content: "Hello" }],
});

console.log(response.choices[0].message.content);`,
        after: `import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIza...");
const model = genAI.getGenerativeModel({ model: "${target.id}" });

const result = await model.generateContent("Hello");
const response = await result.response;

console.log(response.text());`,
      },
      curl: {
        before: `curl https://api.openai.com/v1/chat/completions \\
  -H "Authorization: Bearer sk-..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${source.id}",
    "messages": [{"role": "user", "content": "Hello"}]
  }'`,
        after: `curl "https://generativelanguage.googleapis.com/v1beta/models/${target.id}:generateContent?key=AIza..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "contents": [{"parts": [{"text": "Hello"}]}]
  }'`,
      },
    },
  };

  const key = `${source.apiStyle}-${target.apiStyle}`;
  if (snippets[key]) return snippets[key][lang];

  // Generic same-provider fallback
  if (source.provider === target.provider && source.apiStyle === "openai") {
    return {
      before: `# Before: ${source.label}\nclient.chat.completions.create(\n    model="${source.id}",\n    messages=[{"role": "user", "content": "Hello"}]\n)`,
      after: `# After: ${target.label}\nclient.chat.completions.create(\n    model="${target.id}",\n    messages=[{"role": "user", "content": "Hello"}]\n)`,
    };
  }

  return {
    before: `# Source: ${source.label} (${source.provider})\n# See ${source.provider} API documentation`,
    after: `# Target: ${target.label} (${target.provider})\n# See ${target.provider} API documentation`,
  };
}

function ModelSelect({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background text-foreground text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        <option value="">Select a model...</option>
        {groupedModels.map((g) => (
          <optgroup key={g.group} label={g.group}>
            {g.models.map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

const effortColors = {
  Low: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  Medium: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
  High: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30",
};

export default function MigrationPage() {
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<CodeLang>("python");

  const sourceModel = models.find((m) => m.id === sourceId);
  const targetModel = models.find((m) => m.id === targetId);

  const canAnalyze = sourceId && targetId && sourceId !== targetId;

  const handleAnalyze = () => {
    if (canAnalyze) setShowResults(true);
  };

  const effort = sourceModel && targetModel ? getMigrationEffort(sourceModel, targetModel) : null;
  const keyChanges = sourceModel && targetModel ? getKeyChanges(sourceModel, targetModel) : [];
  const snippets = sourceModel && targetModel ? getCodeSnippets(sourceModel, targetModel, activeCodeTab) : null;

  const monthlySavings =
    sourceModel && targetModel
      ? ((sourceModel.inputPer1M - targetModel.inputPer1M) * 5 + (sourceModel.outputPer1M - targetModel.outputPer1M) * 5)
      : 0;

  return (
    <PremiumGate>
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/research" className="hover:text-foreground transition-colors">
          Dynamic Research
        </Link>
        <span>/</span>
        <span className="text-foreground">AI Migration Assistant</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Migration Assistant</h1>
          <p className="mt-1 text-muted-foreground max-w-2xl">
            Compare costs, estimate migration effort, find compatible APIs, and get code snippets for switching between AI models.
          </p>
        </div>
      </div>

      {/* Model selector */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          <ModelSelect value={sourceId} onChange={(v) => { setSourceId(v); setShowResults(false); }} label="Source Model (migrating from)" />
          <div className="flex flex-col items-center justify-end pb-2.5 gap-1">
            <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
          <ModelSelect value={targetId} onChange={(v) => { setTargetId(v); setShowResults(false); }} label="Target Model (migrating to)" />
        </div>

        {/* Model quick stats */}
        {(sourceModel || targetModel) && (
          <div className="mt-5 grid sm:grid-cols-2 gap-4">
            {[sourceModel, targetModel].map((model, i) => model ? (
              <div key={model.id} className={`rounded-lg p-3 text-xs space-y-1.5 ${i === 0 ? "bg-muted" : "bg-primary/5 border border-primary/20"}`}>
                <p className="font-semibold text-foreground text-sm">{model.label} <span className="text-muted-foreground font-normal">({model.provider})</span></p>
                <div className="grid grid-cols-2 gap-1 text-muted-foreground">
                  <span>Input: <span className="text-foreground font-medium">${model.inputPer1M}/1M tokens</span></span>
                  <span>Output: <span className="text-foreground font-medium">${model.outputPer1M}/1M tokens</span></span>
                  <span>Context: <span className="text-foreground font-medium">{model.contextWindow}</span></span>
                  <span>API Style: <span className="text-foreground font-medium capitalize">{model.apiStyle}</span></span>
                </div>
              </div>
            ) : (
              <div key={i} className="rounded-lg p-3 bg-muted border border-dashed border-border text-xs text-muted-foreground text-center">
                {i === 0 ? "Select source model" : "Select target model"}
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            className="px-8 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Analyze Migration
          </button>
        </div>
      </div>

      {/* Results */}
      {showResults && effort && sourceModel && targetModel && (
        <div className="space-y-6">
          {/* Cost comparison */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Cost Comparison
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-lg bg-muted p-4 space-y-1">
                <p className="text-xs text-muted-foreground">Source ({sourceModel.label})</p>
                <p className="text-sm font-bold text-foreground">${sourceModel.inputPer1M}/1M input</p>
                <p className="text-sm font-bold text-foreground">${sourceModel.outputPer1M}/1M output</p>
              </div>
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 space-y-1">
                <p className="text-xs text-muted-foreground">Target ({targetModel.label})</p>
                <p className="text-sm font-bold text-foreground">${targetModel.inputPer1M}/1M input</p>
                <p className="text-sm font-bold text-foreground">${targetModel.outputPer1M}/1M output</p>
              </div>
              <div className={`rounded-lg p-4 space-y-1 ${monthlySavings > 0 ? "bg-emerald-500/10 border border-emerald-500/20" : monthlySavings < 0 ? "bg-red-500/10 border border-red-500/20" : "bg-muted"}`}>
                <p className="text-xs text-muted-foreground">At 10M tokens/mo</p>
                <p className={`text-sm font-bold ${monthlySavings > 0 ? "text-emerald-700 dark:text-emerald-400" : monthlySavings < 0 ? "text-red-700 dark:text-red-400" : "text-muted-foreground"}`}>
                  {monthlySavings > 0 ? "Save" : monthlySavings < 0 ? "Extra cost" : "No change"}
                </p>
                {monthlySavings !== 0 && (
                  <p className={`text-lg font-bold ${monthlySavings > 0 ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                    ${Math.abs(monthlySavings).toFixed(2)}/mo
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Migration effort */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Migration Effort
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 items-start">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">API Compatibility Score</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${effort.level === "Low" ? "bg-emerald-500" : effort.level === "Medium" ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${100 - effort.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-mono font-bold text-foreground">{100 - effort.score}%</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Effort Level</p>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border ${effortColors[effort.level]}`}>
                  {effort.level}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Estimated Engineering</p>
                <p className="text-sm font-bold text-foreground">{effort.days}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{effort.description}</p>
          </div>

          {/* Key changes */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              Key Changes Required
            </h2>
            <ul className="space-y-2">
              {keyChanges.map((change, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <svg className="w-4 h-4 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  {change}
                </li>
              ))}
            </ul>
          </div>

          {/* Code snippets */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Code Snippets</h2>
              <div className="flex gap-1 p-1 rounded-lg bg-muted">
                {(["python", "javascript", "curl"] as CodeLang[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveCodeTab(lang)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      activeCodeTab === lang
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {lang === "javascript" ? "JavaScript" : lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {snippets && (
              <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
                <div className="p-4 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Before ({sourceModel.label})
                  </p>
                  <pre className="text-xs font-mono text-muted-foreground bg-muted/50 rounded-lg p-4 overflow-x-auto leading-relaxed whitespace-pre">
                    {snippets.before}
                  </pre>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                    After ({targetModel.label})
                  </p>
                  <pre className="text-xs font-mono text-foreground bg-primary/5 border border-primary/10 rounded-lg p-4 overflow-x-auto leading-relaxed whitespace-pre">
                    {snippets.after}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!showResults && (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center space-y-2">
          <svg className="w-10 h-10 text-muted-foreground mx-auto" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <p className="text-sm font-medium text-muted-foreground">Select source and target models to analyze migration</p>
          <p className="text-xs text-muted-foreground">Cost comparison, effort estimate, key changes, and code snippets</p>
        </div>
      )}
    </div>
    </PremiumGate>
  );
}
