"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type BoolStr = boolean | string;

interface FormState {
  name: string;
  provider: string;
  url: string;
  pricingFree: boolean;
  pricingPaid: string;
  pricingApi: string;
  pros: string;
  cons: string;
  // category toggles
  hasImage: boolean;
  hasVideo: boolean;
  hasAudio: boolean;
  hasContent: boolean;
  hasCode: boolean;
  hasTesting: boolean;
  hasDatabase: boolean;
  hasReporting: boolean;
  // image
  imageGeneration: boolean;
  imageUnderstanding: boolean;
  imageEditing: boolean;
  maxResolution: string;
  styles: string;
  inpainting: boolean;
  imageApiAccess: boolean;
  // video
  videoGeneration: boolean;
  maxDuration: string;
  videoResolution: string;
  fps: string;
  audioInVideo: boolean;
  videoApiAccess: boolean;
  // audio
  textToSpeech: boolean;
  speechToText: boolean;
  musicGeneration: boolean;
  voiceCloning: boolean;
  audioQuality: string;
  languages: string;
  // content
  longFormWriting: boolean;
  contextWindow: string;
  multilingual: boolean;
  ragSupport: boolean;
  fileUpload: boolean;
  webBrowsing: boolean;
  // code
  codeCompletion: boolean;
  debugging: boolean;
  testGeneration: boolean;
  multiLanguage: boolean;
  ideIntegration: string;
  maxContext: string;
  // testing
  testCaseGeneration: boolean;
  testAutomation: string;
  coverageAnalysis: boolean;
  bugDetection: boolean;
  cicdIntegration: string;
  // database
  sqlServer: boolean;
  oracle: boolean;
  postgresql: boolean;
  mysql: boolean;
  mongodb: boolean;
  queryGeneration: boolean;
  schemaAnalysis: boolean;
  // reporting
  powerBI: boolean;
  crystalReports: BoolStr;
  tableau: boolean;
  qlikSense: BoolStr;
  ssrs: BoolStr;
  looker: boolean;
}

const TABS = ["Basic Info", "Image", "Video", "Audio", "Content", "Code", "Testing", "Database", "Reporting"];

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-border accent-primary"
      />
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
      />
    </div>
  );
}

export default function NewFeaturePage() {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormState>({
    name: "", provider: "", url: "",
    pricingFree: false, pricingPaid: "", pricingApi: "",
    pros: "", cons: "",
    hasImage: false, hasVideo: false, hasAudio: false, hasContent: false,
    hasCode: false, hasTesting: false, hasDatabase: false, hasReporting: false,
    imageGeneration: false, imageUnderstanding: false, imageEditing: false,
    maxResolution: "", styles: "", inpainting: false, imageApiAccess: false,
    videoGeneration: false, maxDuration: "", videoResolution: "", fps: "", audioInVideo: false, videoApiAccess: false,
    textToSpeech: false, speechToText: false, musicGeneration: false, voiceCloning: false, audioQuality: "", languages: "",
    longFormWriting: false, contextWindow: "", multilingual: false, ragSupport: false, fileUpload: false, webBrowsing: false,
    codeCompletion: false, debugging: false, testGeneration: false, multiLanguage: false, ideIntegration: "", maxContext: "",
    testCaseGeneration: false, testAutomation: "", coverageAnalysis: false, bugDetection: false, cicdIntegration: "",
    sqlServer: false, oracle: false, postgresql: false, mysql: false, mongodb: false, queryGeneration: false, schemaAnalysis: false,
    powerBI: false, crystalReports: false, tableau: false, qlikSense: false, ssrs: false, looker: false,
  });

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.provider.trim()) {
      setError("Name and provider are required.");
      setTab(0);
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      name: form.name,
      provider: form.provider,
      url: form.url,
      pricing: { free: form.pricingFree, paid: form.pricingPaid || "N/A", api: form.pricingApi || "N/A" },
      pros: form.pros,
      cons: form.cons,
      features: {
        image: form.hasImage, video: form.hasVideo, audio: form.hasAudio,
        content: form.hasContent, code: form.hasCode, testing: form.hasTesting,
        database: form.hasDatabase, reporting: form.hasReporting,
      },
      image: {
        imageGeneration: form.imageGeneration, imageUnderstanding: form.imageUnderstanding,
        imageEditing: form.imageEditing, maxResolution: form.maxResolution || "N/A",
        styles: form.styles || "N/A", inpainting: form.inpainting, apiAccess: form.imageApiAccess,
      },
      video: {
        videoGeneration: form.videoGeneration, maxDuration: form.maxDuration || "N/A",
        maxResolution: form.videoResolution || "N/A", fps: form.fps || "N/A",
        audioInVideo: form.audioInVideo, apiAccess: form.videoApiAccess,
      },
      audio: {
        textToSpeech: form.textToSpeech, speechToText: form.speechToText,
        musicGeneration: form.musicGeneration, voiceCloning: form.voiceCloning,
        audioQuality: form.audioQuality || "N/A", languages: form.languages || "N/A",
      },
      content: {
        longFormWriting: form.longFormWriting, contextWindow: form.contextWindow || "N/A",
        multilingual: form.multilingual, ragSupport: form.ragSupport,
        fileUpload: form.fileUpload, webBrowsing: form.webBrowsing,
      },
      code: {
        codeCompletion: form.codeCompletion, debugging: form.debugging,
        testGeneration: form.testGeneration, multiLanguage: form.multiLanguage,
        ideIntegration: form.ideIntegration || "N/A", maxContext: form.maxContext || "N/A",
      },
      testing: {
        testCaseGeneration: form.testCaseGeneration, testAutomation: form.testAutomation || "N/A",
        coverageAnalysis: form.coverageAnalysis, bugDetection: form.bugDetection,
        cicdIntegration: form.cicdIntegration || "N/A",
      },
      database: {
        sqlServer: form.sqlServer, oracle: form.oracle, postgresql: form.postgresql,
        mysql: form.mysql, mongodb: form.mongodb,
        queryGeneration: form.queryGeneration, schemaAnalysis: form.schemaAnalysis,
      },
      reporting: {
        powerBI: form.powerBI, crystalReports: form.crystalReports,
        tableau: form.tableau, qlikSense: form.qlikSense,
        ssrs: form.ssrs, looker: form.looker,
      },
    };

    const res = await fetch("/api/features", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/features");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to add tool.");
      setSaving(false);
    }
  }

  return (
    <div className="py-8 sm:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push("/features")}
          className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"
        >
          &larr; Back to Features
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-6">Add Feature Tool</h1>

        {/* Tab bar */}
        <div className="flex flex-wrap gap-1 mb-6 border-b border-border pb-2">
          {TABS.map((t, i) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(i)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                tab === i
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          {tab === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Tool Name *" value={form.name} onChange={(v) => set("name", v)} placeholder="e.g. Claude 3.5 Sonnet" />
                <Field label="Provider *" value={form.provider} onChange={(v) => set("provider", v)} placeholder="e.g. Anthropic" />
              </div>
              <Field label="URL" value={form.url} onChange={(v) => set("url", v)} placeholder="https://..." />

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Free Tier</label>
                  <Check label="Has free tier" checked={form.pricingFree} onChange={(v) => set("pricingFree", v)} />
                </div>
                <Field label="Paid Price" value={form.pricingPaid} onChange={(v) => set("pricingPaid", v)} placeholder="e.g. $20/mo" />
                <Field label="API Price" value={form.pricingApi} onChange={(v) => set("pricingApi", v)} placeholder="e.g. $3/1M tokens" />
              </div>

              <Field label="Pros (comma-separated)" value={form.pros} onChange={(v) => set("pros", v)} placeholder="e.g. Fast, Affordable, Open source" />
              <Field label="Cons (comma-separated)" value={form.cons} onChange={(v) => set("cons", v)} placeholder="e.g. Limited context, No free tier" />

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Supported Feature Categories</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Check label="Image" checked={form.hasImage} onChange={(v) => set("hasImage", v)} />
                  <Check label="Video" checked={form.hasVideo} onChange={(v) => set("hasVideo", v)} />
                  <Check label="Audio" checked={form.hasAudio} onChange={(v) => set("hasAudio", v)} />
                  <Check label="Content" checked={form.hasContent} onChange={(v) => set("hasContent", v)} />
                  <Check label="Code" checked={form.hasCode} onChange={(v) => set("hasCode", v)} />
                  <Check label="Testing" checked={form.hasTesting} onChange={(v) => set("hasTesting", v)} />
                  <Check label="Database" checked={form.hasDatabase} onChange={(v) => set("hasDatabase", v)} />
                  <Check label="Reporting" checked={form.hasReporting} onChange={(v) => set("hasReporting", v)} />
                </div>
              </div>
            </div>
          )}

          {/* Image */}
          {tab === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Check label="Image Generation" checked={form.imageGeneration} onChange={(v) => set("imageGeneration", v)} />
                <Check label="Image Understanding" checked={form.imageUnderstanding} onChange={(v) => set("imageUnderstanding", v)} />
                <Check label="Image Editing" checked={form.imageEditing} onChange={(v) => set("imageEditing", v)} />
                <Check label="Inpainting" checked={form.inpainting} onChange={(v) => set("inpainting", v)} />
                <Check label="API Access" checked={form.imageApiAccess} onChange={(v) => set("imageApiAccess", v)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Max Resolution" value={form.maxResolution} onChange={(v) => set("maxResolution", v)} placeholder="e.g. 1024x1024" />
                <Field label="Styles" value={form.styles} onChange={(v) => set("styles", v)} placeholder="e.g. Photorealistic, Anime" />
              </div>
            </div>
          )}

          {/* Video */}
          {tab === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Check label="Video Generation" checked={form.videoGeneration} onChange={(v) => set("videoGeneration", v)} />
                <Check label="Audio in Video" checked={form.audioInVideo} onChange={(v) => set("audioInVideo", v)} />
                <Check label="API Access" checked={form.videoApiAccess} onChange={(v) => set("videoApiAccess", v)} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Max Duration" value={form.maxDuration} onChange={(v) => set("maxDuration", v)} placeholder="e.g. 10s" />
                <Field label="Max Resolution" value={form.videoResolution} onChange={(v) => set("videoResolution", v)} placeholder="e.g. 1080p" />
                <Field label="FPS" value={form.fps} onChange={(v) => set("fps", v)} placeholder="e.g. 24" />
              </div>
            </div>
          )}

          {/* Audio */}
          {tab === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Check label="Text to Speech" checked={form.textToSpeech} onChange={(v) => set("textToSpeech", v)} />
                <Check label="Speech to Text" checked={form.speechToText} onChange={(v) => set("speechToText", v)} />
                <Check label="Music Generation" checked={form.musicGeneration} onChange={(v) => set("musicGeneration", v)} />
                <Check label="Voice Cloning" checked={form.voiceCloning} onChange={(v) => set("voiceCloning", v)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Audio Quality" value={form.audioQuality} onChange={(v) => set("audioQuality", v)} placeholder="e.g. High" />
                <Field label="Languages" value={form.languages} onChange={(v) => set("languages", v)} placeholder="e.g. 50+" />
              </div>
            </div>
          )}

          {/* Content */}
          {tab === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Check label="Long-form Writing" checked={form.longFormWriting} onChange={(v) => set("longFormWriting", v)} />
                <Check label="Multilingual" checked={form.multilingual} onChange={(v) => set("multilingual", v)} />
                <Check label="RAG Support" checked={form.ragSupport} onChange={(v) => set("ragSupport", v)} />
                <Check label="File Upload" checked={form.fileUpload} onChange={(v) => set("fileUpload", v)} />
                <Check label="Web Browsing" checked={form.webBrowsing} onChange={(v) => set("webBrowsing", v)} />
              </div>
              <Field label="Context Window" value={form.contextWindow} onChange={(v) => set("contextWindow", v)} placeholder="e.g. 200K tokens" />
            </div>
          )}

          {/* Code */}
          {tab === 5 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Check label="Code Completion" checked={form.codeCompletion} onChange={(v) => set("codeCompletion", v)} />
                <Check label="Debugging" checked={form.debugging} onChange={(v) => set("debugging", v)} />
                <Check label="Test Generation" checked={form.testGeneration} onChange={(v) => set("testGeneration", v)} />
                <Check label="Multi-language" checked={form.multiLanguage} onChange={(v) => set("multiLanguage", v)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="IDE Integration" value={form.ideIntegration} onChange={(v) => set("ideIntegration", v)} placeholder="e.g. VS Code, JetBrains" />
                <Field label="Max Context" value={form.maxContext} onChange={(v) => set("maxContext", v)} placeholder="e.g. 128K tokens" />
              </div>
            </div>
          )}

          {/* Testing */}
          {tab === 6 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Check label="Test Case Generation" checked={form.testCaseGeneration} onChange={(v) => set("testCaseGeneration", v)} />
                <Check label="Coverage Analysis" checked={form.coverageAnalysis} onChange={(v) => set("coverageAnalysis", v)} />
                <Check label="Bug Detection" checked={form.bugDetection} onChange={(v) => set("bugDetection", v)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Test Automation" value={form.testAutomation} onChange={(v) => set("testAutomation", v)} placeholder="e.g. Full, Partial" />
                <Field label="CI/CD Integration" value={form.cicdIntegration} onChange={(v) => set("cicdIntegration", v)} placeholder="e.g. GitHub Actions, Jenkins" />
              </div>
            </div>
          )}

          {/* Database */}
          {tab === 7 && (
            <div className="grid grid-cols-2 gap-3">
              <Check label="SQL Server" checked={form.sqlServer} onChange={(v) => set("sqlServer", v)} />
              <Check label="Oracle" checked={form.oracle} onChange={(v) => set("oracle", v)} />
              <Check label="PostgreSQL" checked={form.postgresql} onChange={(v) => set("postgresql", v)} />
              <Check label="MySQL" checked={form.mysql} onChange={(v) => set("mysql", v)} />
              <Check label="MongoDB" checked={form.mongodb} onChange={(v) => set("mongodb", v)} />
              <Check label="Query Generation" checked={form.queryGeneration} onChange={(v) => set("queryGeneration", v)} />
              <Check label="Schema Analysis" checked={form.schemaAnalysis} onChange={(v) => set("schemaAnalysis", v)} />
            </div>
          )}

          {/* Reporting */}
          {tab === 8 && (
            <div className="grid grid-cols-2 gap-3">
              <Check label="Power BI" checked={!!form.powerBI} onChange={(v) => set("powerBI", v)} />
              <Check label="Crystal Reports" checked={!!form.crystalReports} onChange={(v) => set("crystalReports", v)} />
              <Check label="Tableau" checked={!!form.tableau} onChange={(v) => set("tableau", v)} />
              <Check label="Qlik Sense" checked={!!form.qlikSense} onChange={(v) => set("qlikSense", v)} />
              <Check label="SSRS" checked={!!form.ssrs} onChange={(v) => set("ssrs", v)} />
              <Check label="Looker" checked={!!form.looker} onChange={(v) => set("looker", v)} />
            </div>
          )}

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

          <div className="mt-6 flex gap-3">
            {tab > 0 && (
              <button type="button" onClick={() => setTab(tab - 1)}
                className="px-4 py-2.5 text-sm rounded-lg border border-border text-foreground hover:bg-muted transition-colors font-medium">
                &larr; Previous
              </button>
            )}
            {tab < TABS.length - 1 && (
              <button type="button" onClick={() => setTab(tab + 1)}
                className="px-4 py-2.5 text-sm rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-medium">
                Next &rarr;
              </button>
            )}
            <button type="submit" disabled={saving}
              className="ml-auto px-5 py-2.5 text-sm rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity font-medium">
              {saving ? "Adding..." : "Add Tool"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
