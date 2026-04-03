"use client";

import { useState, useRef } from "react";
import PremiumGate from "@/components/PremiumGate";

// ─── Types ────────────────────────────────────────────────────────────────────

type BlockType = "model" | "tool" | "automation";

type Block = {
  id: string;
  type: BlockType;
  name: string;
  emoji: string;
  color: string; // Tailwind border-color class
  bgColor: string; // badge bg
  textColor: string; // badge text
  prompt?: string;
  config?: string;
};

// ─── Palette data ─────────────────────────────────────────────────────────────

const PALETTE: { category: string; type: BlockType; items: Omit<Block, "id" | "type" | "prompt" | "config">[] }[] = [
  {
    category: "Models",
    type: "model",
    items: [
      { name: "GPT-4o",        emoji: "🟢", color: "border-l-green-500",  bgColor: "bg-green-500/10",  textColor: "text-green-600 dark:text-green-400"  },
      { name: "Claude 3.7",    emoji: "🟠", color: "border-l-orange-500", bgColor: "bg-orange-500/10", textColor: "text-orange-600 dark:text-orange-400" },
      { name: "Gemini 2.0",    emoji: "🔵", color: "border-l-blue-500",   bgColor: "bg-blue-500/10",   textColor: "text-blue-600 dark:text-blue-400"    },
      { name: "Mistral Large", emoji: "🌹", color: "border-l-rose-500",   bgColor: "bg-rose-500/10",   textColor: "text-rose-600 dark:text-rose-400"    },
      { name: "Llama 3.3",     emoji: "🦙", color: "border-l-violet-500", bgColor: "bg-violet-500/10", textColor: "text-violet-600 dark:text-violet-400" },
    ],
  },
  {
    category: "Tools",
    type: "tool",
    items: [
      { name: "Web Search",      emoji: "🔍", color: "border-l-teal-500",   bgColor: "bg-teal-500/10",   textColor: "text-teal-600 dark:text-teal-400"     },
      { name: "PDF Reader",      emoji: "📄", color: "border-l-amber-500",  bgColor: "bg-amber-500/10",  textColor: "text-amber-600 dark:text-amber-400"   },
      { name: "Code Executor",   emoji: "💻", color: "border-l-indigo-500", bgColor: "bg-indigo-500/10", textColor: "text-indigo-600 dark:text-indigo-400" },
      { name: "Image Generator", emoji: "🎨", color: "border-l-pink-500",   bgColor: "bg-pink-500/10",   textColor: "text-pink-600 dark:text-pink-400"     },
      { name: "Data Analyser",   emoji: "📊", color: "border-l-cyan-500",   bgColor: "bg-cyan-500/10",   textColor: "text-cyan-600 dark:text-cyan-400"     },
    ],
  },
  {
    category: "Automations",
    type: "automation",
    items: [
      { name: "Send Email",      emoji: "📧", color: "border-l-sky-500",    bgColor: "bg-sky-500/10",    textColor: "text-sky-600 dark:text-sky-400"       },
      { name: "Save to Notion",  emoji: "📝", color: "border-l-slate-500",  bgColor: "bg-slate-500/10",  textColor: "text-slate-600 dark:text-slate-400"   },
      { name: "Post to Slack",   emoji: "💬", color: "border-l-lime-500",   bgColor: "bg-lime-500/10",   textColor: "text-lime-600 dark:text-lime-400"     },
      { name: "Export CSV",      emoji: "📁", color: "border-l-yellow-500", bgColor: "bg-yellow-500/10", textColor: "text-yellow-600 dark:text-yellow-400" },
      { name: "Trigger Webhook", emoji: "🔗", color: "border-l-zinc-500",   bgColor: "bg-zinc-500/10",   textColor: "text-zinc-600 dark:text-zinc-400"     },
    ],
  },
];

// Flat lookup map for quick access by name
const ITEM_MAP: Record<string, Omit<Block, "id" | "prompt" | "config">> = {};
PALETTE.forEach(({ type, items }) => {
  items.forEach((item) => {
    ITEM_MAP[item.name] = { ...item, type };
  });
});

// ─── Templates ────────────────────────────────────────────────────────────────

const TEMPLATES: { label: string; emoji: string; blocks: string[] }[] = [
  {
    label: "Content Pipeline",
    emoji: "✍️",
    blocks: ["GPT-4o", "Web Search", "Save to Notion", "Post to Slack"],
  },
  {
    label: "Code Review Bot",
    emoji: "🤖",
    blocks: ["PDF Reader", "Claude 3.7", "Code Executor", "Post to Slack"],
  },
  {
    label: "Data Report",
    emoji: "📈",
    blocks: ["PDF Reader", "Data Analyser", "GPT-4o", "Export CSV", "Send Email"],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function makeBlock(name: string): Block {
  const base = ITEM_MAP[name];
  if (!base) throw new Error(`Unknown block: ${name}`);
  return { ...base, id: makeId(), prompt: "", config: "" };
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function WorkflowBuilderPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const dragIndex = useRef<number | null>(null);

  // ── Palette click: add block ──
  const addBlock = (name: string) => {
    setBlocks((prev) => [...prev, makeBlock(name)]);
  };

  // ── Remove block ──
  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  // ── Update block field ──
  const updateBlock = (id: string, field: "prompt" | "config", value: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );
  };

  // ── HTML5 drag-and-drop reorder ──
  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const from = dragIndex.current;
    if (from === null || from === index) return;
    setBlocks((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(index, 0, moved);
      return next;
    });
    dragIndex.current = index;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragIndex.current = null;
  };

  // ── Clear all ──
  const clearAll = () => setBlocks([]);

  // ── Export JSON ──
  const exportJSON = () => {
    const data = JSON.stringify(
      blocks.map(({ id, type, name, emoji, prompt, config }) => ({
        id,
        type,
        name,
        emoji,
        ...(type === "model" && { prompt }),
        ...(type === "automation" && { config }),
      })),
      null,
      2
    );
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workflow.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Load template ──
  const loadTemplate = (blockNames: string[]) => {
    setBlocks(blockNames.map(makeBlock));
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <PremiumGate>
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Workflow Builder</h1>
              <p className="text-sm text-muted-foreground">
                Click blocks to add them to your canvas, then drag to reorder.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main layout: palette + canvas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-6">

        {/* ── Left panel: Block Palette ── */}
        <aside className="w-full lg:w-64 shrink-0 space-y-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Block Palette
          </h2>
          {PALETTE.map(({ category, type, items }) => (
            <div key={category} className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground pl-1">{category}</p>
              {items.map((item) => (
                <button
                  key={item.name}
                  onClick={() => addBlock(item.name)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border border-border bg-card hover:border-primary/40 hover:bg-muted/60 transition-all text-left group`}
                >
                  <span className="text-base leading-none">{item.emoji}</span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors flex-1">
                    {item.name}
                  </span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${item.bgColor} ${item.textColor}`}>
                    {type}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </aside>

        {/* ── Right: canvas area ── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Workflow Canvas
              </span>
              {blocks.length > 0 && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {blocks.length} block{blocks.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearAll}
                disabled={blocks.length === 0}
                className="px-3 py-1.5 text-sm rounded-lg border border-border bg-card text-foreground hover:border-rose-500/50 hover:text-rose-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Clear All
              </button>
              <button
                onClick={exportJSON}
                disabled={blocks.length === 0}
                className="px-3 py-1.5 text-sm rounded-lg border border-border bg-card text-foreground hover:border-primary/50 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Export JSON
              </button>
            </div>
          </div>

          {/* Canvas */}
          {blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/50 min-h-72 text-center p-10 gap-3">
              <div className="text-4xl">🧩</div>
              <p className="text-base font-medium text-foreground">Your canvas is empty</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Click a block from the palette to add it to your workflow, or pick a template below.
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {blocks.map((block, index) => (
                <div key={block.id}>
                  {/* Canvas block */}
                  <div
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={handleDrop}
                    className={`flex items-start gap-3 rounded-xl border border-border bg-card p-4 border-l-4 ${block.color} cursor-grab active:cursor-grabbing hover:shadow-sm transition-all`}
                  >
                    {/* Drag handle */}
                    <span className="text-muted-foreground text-lg leading-none mt-0.5 select-none" title="Drag to reorder">
                      ⠿
                    </span>

                    {/* Block content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base leading-none">{block.emoji}</span>
                        <span className="font-semibold text-foreground text-sm">{block.name}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${block.bgColor} ${block.textColor}`}>
                          {block.type}
                        </span>
                        <span className="text-xs text-muted-foreground">Step {index + 1}</span>
                      </div>

                      {/* Model: system prompt */}
                      {block.type === "model" && (
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground font-medium">System prompt</label>
                          <textarea
                            rows={2}
                            value={block.prompt ?? ""}
                            onChange={(e) => updateBlock(block.id, "prompt", e.target.value)}
                            placeholder="e.g. You are a helpful assistant that..."
                            className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                          />
                        </div>
                      )}

                      {/* Automation: config */}
                      {block.type === "automation" && (
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground font-medium">Config (e.g. email address)</label>
                          <input
                            type="text"
                            value={block.config ?? ""}
                            onChange={(e) => updateBlock(block.id, "config", e.target.value)}
                            placeholder="e.g. hello@example.com"
                            className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
                          />
                        </div>
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeBlock(block.id)}
                      title="Remove block"
                      className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-all text-lg leading-none"
                    >
                      ×
                    </button>
                  </div>

                  {/* Arrow connector */}
                  {index < blocks.length - 1 && (
                    <div className="flex justify-center py-1 text-muted-foreground text-xl select-none">↓</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Workflow Templates ── */}
          <div className="pt-4 border-t border-border space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Workflow Templates
            </h2>
            <div className="flex flex-wrap gap-3">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.label}
                  onClick={() => loadTemplate(tpl.blocks)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-muted/60 transition-all text-sm font-medium text-foreground"
                >
                  <span>{tpl.emoji}</span>
                  <span>{tpl.label}</span>
                  <span className="text-xs text-muted-foreground ml-1">({tpl.blocks.length} steps)</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Templates replace your current canvas. Export your work first if needed.
            </p>
          </div>

        </div>
      </div>
    </div>
    </PremiumGate>
  );
}
