"use client";

import { useRef, useState } from "react";
import type { Editor } from "@tiptap/react";

const FONT_FAMILIES = [
  { label: "Default", value: "" },
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Monospace", value: "monospace" },
];

const FONT_SIZES = [
  "12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "36px",
];

async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset || uploadPreset === "your_upload_preset_here") {
    throw new Error(
      "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local"
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) throw new Error("Cloudinary upload failed");
  const data = await res.json();
  return data.secure_url as string;
}

export default function EditorToolbar({ editor }: { editor: Editor }) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const btn = (active: boolean) =>
    `px-2 py-1 text-sm rounded transition-colors ${
      active
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:text-foreground hover:bg-muted"
    }`;

  const sep = <div className="w-px bg-border self-stretch mx-0.5" />;

  const selectClass =
    "h-7 px-1.5 text-xs rounded border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer";

  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setUploadingImage(true);
    try {
      const url = await uploadToCloudinary(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Image upload failed"
      );
    }
    setUploadingImage(false);
    if (imageInputRef.current) imageInputRef.current.value = "";
  }

  const currentFontSize =
    (editor.getAttributes("textStyle").fontSize as string | undefined) ?? "";
  const currentFontFamily =
    (editor.getAttributes("textStyle").fontFamily as string | undefined) ?? "";
  const currentColor =
    (editor.getAttributes("textStyle").color as string | undefined) ??
    "#000000";

  return (
    <div className="border-b border-border bg-muted/30">
      {/* Row 1: Font & inline formatting */}
      <div className="flex flex-wrap items-center gap-1 px-2 pt-2 pb-1">
        {/* Font Family */}
        <select
          value={currentFontFamily}
          onChange={(e) => {
            if (e.target.value) {
              editor.chain().focus().setFontFamily(e.target.value).run();
            } else {
              editor.chain().focus().unsetFontFamily().run();
            }
          }}
          className={selectClass}
          title="Font Family"
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        {/* Font Size */}
        <select
          value={currentFontSize}
          onChange={(e) => {
            if (e.target.value) {
              editor.chain().focus().setFontSize(e.target.value).run();
            } else {
              editor.chain().focus().unsetFontSize().run();
            }
          }}
          className={selectClass}
          title="Font Size"
        >
          <option value="">Size</option>
          {FONT_SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Text Color */}
        <label
          className="relative flex items-center gap-1 px-2 py-1 text-xs rounded border border-border bg-background hover:bg-muted cursor-pointer transition-colors"
          title="Text Color"
        >
          <span
            className="w-3.5 h-3.5 rounded-sm border border-border"
            style={{ background: currentColor }}
          />
          <span className="text-muted-foreground text-xs">Color</span>
          <input
            type="color"
            value={currentColor}
            onChange={(e) =>
              editor.chain().focus().setColor(e.target.value).run()
            }
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </label>

        {/* Highlight */}
        <label
          className="relative flex items-center gap-1 px-2 py-1 text-xs rounded border border-border bg-background hover:bg-muted cursor-pointer transition-colors"
          title="Highlight"
        >
          <span className="text-sm leading-none">🖊</span>
          <span className="text-muted-foreground text-xs">Highlight</span>
          <input
            type="color"
            defaultValue="#fef08a"
            onChange={(e) =>
              editor
                .chain()
                .focus()
                .toggleHighlight({ color: e.target.value })
                .run()
            }
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </label>

        {sep}

        {/* Bold / Italic / Underline / Strike */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btn(editor.isActive("bold"))}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btn(editor.isActive("italic"))}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={btn(editor.isActive("underline"))}
          title="Underline"
        >
          <u>U</u>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={btn(editor.isActive("strike"))}
          title="Strikethrough"
        >
          <s>S</s>
        </button>

        {sep}

        {/* Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={btn(editor.isActive({ textAlign: "left" }))}
          title="Align Left"
        >
          ≡L
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={btn(editor.isActive({ textAlign: "center" }))}
          title="Align Center"
        >
          ≡C
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={btn(editor.isActive({ textAlign: "right" }))}
          title="Align Right"
        >
          ≡R
        </button>
      </div>

      {/* Row 2: Headings, lists, link, image */}
      <div className="flex flex-wrap items-center gap-1 px-2 pb-2">
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={btn(editor.isActive("heading", { level: 2 }))}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={btn(editor.isActive("heading", { level: 3 }))}
          title="Heading 3"
        >
          H3
        </button>

        {sep}

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btn(editor.isActive("bulletList"))}
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btn(editor.isActive("orderedList"))}
          title="Ordered List"
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btn(editor.isActive("blockquote"))}
          title="Blockquote"
        >
          Quote
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={btn(editor.isActive("codeBlock"))}
          title="Code Block"
        >
          Code
        </button>

        {sep}

        {/* Link */}
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("Enter URL:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          className={btn(editor.isActive("link"))}
          title="Add Link"
        >
          🔗 Link
        </button>

        {/* Cloudinary Image */}
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          disabled={uploadingImage}
          className={`${btn(false)} disabled:opacity-50`}
          title="Upload image to Cloudinary"
        >
          {uploadingImage ? "Uploading…" : "📷 Image"}
        </button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleImageFile}
          className="hidden"
        />

        {sep}

        {/* Clear formatting */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          className="px-2 py-1 text-sm rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Clear Formatting"
        >
          ✕ Clear
        </button>
      </div>

      {uploadError && (
        <p className="px-3 pb-2 text-xs text-red-500">{uploadError}</p>
      )}
    </div>
  );
}
