"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import footballService from "@/services/apiService";
import toast from "react-hot-toast";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExt from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import ImageExt from "@tiptap/extension-image";
import LinkExt from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import {
  FaArrowLeft, FaEye, FaImage, FaSave, FaTag, FaUser, FaTimes,
  FaBold, FaItalic, FaUnderline, FaStrikethrough, FaLink, FaListUl,
  FaListOl, FaQuoteLeft, FaAlignLeft, FaAlignCenter, FaAlignRight,
  FaAlignJustify, FaHighlighter, FaUndo, FaRedo, FaCode, FaMinus,
} from "react-icons/fa";
import { MdSend, MdFormatClear, MdOutlineImage } from "react-icons/md";
import NewsCard from "@/components/news/NewsCard";
import { NewsItem } from "@/types";

const CATEGORIES = [
  "Football News", "Transfer Updates", "Match Reports", "Player Interviews",
  "League Updates", "International Football", "Club News", "Opinion & Analysis",
];

const inputStyle: React.CSSProperties = {
  background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
  color: "var(--text-primary)", borderRadius: "8px", padding: "10px 14px",
  fontSize: "13px", width: "100%", outline: "none", transition: "border-color .2s, box-shadow .2s",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "1px",
  textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "6px",
};
const errorStyle: React.CSSProperties = { color: "var(--accent-red)", fontSize: "11px", marginTop: "4px" };

const fieldFocus = (e: React.FocusEvent<any>) => {
  e.currentTarget.style.borderColor = "var(--accent-blue)";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(41,121,255,0.1)";
};
const fieldBlur = (e: React.FocusEvent<any>) => {
  e.currentTarget.style.borderColor = "var(--border-subtle)";
  e.currentTarget.style.boxShadow = "none";
};

// ── Toolbar button ──────────────────────────────────────────────────────────
const ToolBtn = ({
  onClick, active, disabled, title, children,
}: {
  onClick: () => void; active?: boolean; disabled?: boolean; title?: string; children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className="flex items-center justify-center w-8 h-8 rounded-lg transition-all disabled:opacity-30"
    style={{
      background: active ? "rgba(41,121,255,0.2)" : "transparent",
      color: active ? "#6ab0ff" : "var(--text-secondary)",
      border: active ? "1px solid rgba(41,121,255,0.3)" : "1px solid transparent",
    }}
    onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
    onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
  >
    {children}
  </button>
);

// ── Divider ──────────────────────────────────────────────────────────────────
const TDivider = () => (
  <div className="w-px h-5 mx-0.5 flex-shrink-0" style={{ background: "var(--border-subtle)" }} />
);

// ── Main component ────────────────────────────────────────────────────────────
interface FormState {
  title: string; summary: string; author: string; category: string; tags: string;
  imageUrl: string; featured: boolean;
}

import { BubbleMenuPlugin } from "@tiptap/extension-bubble-menu";
import { FloatingMenuPlugin } from "@tiptap/extension-floating-menu";

// ── Custom BubbleMenu ─────────────────────────────────────────────
const CustomBubbleMenu = ({ editor, children }: { editor: any; children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !editor) return;
    const plugin = BubbleMenuPlugin({
      editor,
      element: ref.current,
      pluginKey: "bubbleMenu",
      // options: { duration: 100 },
      shouldShow: ({ editor }) => editor.isActive("text") || editor.state.selection.content().size > 0,
    });
    editor.registerPlugin(plugin);
    return () => editor.unregisterPlugin("bubbleMenu");
  }, [editor]);

  return <div ref={ref} className="bubble-menu">{children}</div>;
};

// ── Custom FloatingMenu ───────────────────────────────────────────
const CustomFloatingMenu = ({ editor, children }: { editor: any; children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !editor) return;
    const plugin = FloatingMenuPlugin({
      editor,
      element: ref.current,
      pluginKey: "floatingMenu",
      // options: { duration: 150, placement: "left" },
    });
    editor.registerPlugin(plugin);
    return () => editor.unregisterPlugin("floatingMenu");
  }, [editor]);

  return <div ref={ref} className="floating-menu">{children}</div>;
};


const Page: React.FC = () => {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const inlineImageInputRef = useRef<HTMLInputElement>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | "content", string>>>({});
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [colorValue, setColorValue] = useState("#ffffff");
  const [uploadingInlineImage, setUploadingInlineImage] = useState(false);

  const [form, setForm] = useState<FormState>({
    title: "", summary: "", author: "", category: "",
    tags: "", imageUrl: "", featured: false,
  });

  const set = (field: keyof FormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // ── TipTap editor ──────────────────────────────────────────────────────────
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      UnderlineExt,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: true }),
      ImageExt.configure({ allowBase64: true, inline: false }),
      LinkExt.configure({ openOnClick: false, autolink: true }),
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder:
          "Start writing your article... Use the toolbar above for formatting.\n\nTip: Press '/' or use the + button on empty lines to insert images anywhere.",
      }),
    ],
    editorProps: {
      attributes: {
        class: "tiptap-editor",
        spellcheck: "true",
      },
    },
    immediatelyRender: false,
  });

  // Insert image inline at current cursor
  const insertInlineImage = useCallback(
    async (file: File) => {
      if (!editor) return;
      setUploadingInlineImage(true);
      try {
        // Use FileReader for instant base64 preview; backend can convert to Cloudinary later
        const reader = new FileReader();
        reader.onloadend = () => {
          editor.chain().focus().setImage({ src: reader.result as string, alt: file.name }).run();
          setUploadingInlineImage(false);
        };
        reader.readAsDataURL(file);
      } catch {
        toast.error("Failed to insert image");
        setUploadingInlineImage(false);
      }
    },
    [editor]
  );

  const handleInlineImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) insertInlineImage(file);
    e.target.value = "";
  };

  const insertImageByUrl = () => {
    const url = prompt("Enter image URL:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleAddLink = () => {
    if (!editor) return;
    if (linkUrl.trim()) {
      editor.chain().focus().setLink({ href: linkUrl.trim() }).run();
      setLinkUrl("");
      setShowLinkInput(false);
    }
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.summary.trim()) e.summary = "Summary is required";
    if (!editor || editor.isEmpty) e.content = "Content is required";
    if (!form.author.trim()) e.author = "Author is required";
    if (!form.category) e.category = "Category is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
    set("imageUrl", "");
  };

  const handleSubmit = async (status: "draft" | "published") => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("summary", form.summary.trim());
      fd.append("content", editor?.getHTML() ?? "");
      fd.append("author", form.author.trim());
      fd.append("category", form.category);
      fd.append("tags", form.tags);
      fd.append("featured", String(form.featured));
      fd.append("status", status);
      if (coverFile) fd.append("image", coverFile);
      else if (form.imageUrl) fd.append("imageUrl", form.imageUrl);

      const { article, message } = await footballService.createNews(fd);
      toast.success(message || `Article ${status === "published" ? "published" : "saved as draft"}!`);
      if (status === "published") router.push(`/news/${article.slug}`);
      else router.push("/news");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewArticle: NewsItem = {
    _id: "preview", slug: "preview",
    title: form.title || "Article Title Preview",
    summary: form.summary || "Your article summary will appear here...",
    content: editor?.getHTML() ?? "",
    author: form.author || "Author",
    category: form.category || "Football News",
    tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    imageUrl: coverPreview || form.imageUrl || null,
    featured: form.featured, status: "published",
    publishedAt: new Date().toISOString(), views: 0,
    readTime: Math.max(1, Math.ceil((editor?.getText().split(/\s+/).length ?? 0) / 200)),
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };

  if (!editor) return null;

  return (
    <>
      {/* Editor CSS */}
      <style>{`
        .tiptap-editor {
          min-height: 480px;
          padding: 20px;
          outline: none;
          color: var(--text-primary);
          font-size: 15px;
          line-height: 1.8;
          font-family: 'Inter', sans-serif;
        }
        .tiptap-editor p { margin: 0 0 1em 0; }
        .tiptap-editor h1 { font-family: 'Rajdhani', sans-serif; font-size: 2em; font-weight: 800; color: var(--text-primary); margin: 1.2em 0 0.4em; letter-spacing: 0.5px; }
        .tiptap-editor h2 { font-family: 'Rajdhani', sans-serif; font-size: 1.5em; font-weight: 700; color: var(--text-primary); margin: 1em 0 0.4em; }
        .tiptap-editor h3 { font-family: 'Rajdhani', sans-serif; font-size: 1.2em; font-weight: 700; color: var(--text-primary); margin: 0.9em 0 0.3em; }
        .tiptap-editor strong { color: var(--text-primary); font-weight: 700; }
        .tiptap-editor em { color: #a5b4d4; }
        .tiptap-editor u { text-decoration-color: var(--accent-blue); }
        .tiptap-editor s { color: var(--text-muted); }
        .tiptap-editor code { background: rgba(41,121,255,0.1); color: #6ab0ff; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; font-family: monospace; }
        .tiptap-editor pre { background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: 10px; padding: 16px; overflow-x: auto; margin: 1em 0; }
        .tiptap-editor pre code { background: none; color: #a5b4d4; padding: 0; }
        .tiptap-editor blockquote { border-left: 3px solid var(--accent-blue); padding: 8px 16px; margin: 1em 0; background: rgba(41,121,255,0.06); border-radius: 0 8px 8px 0; color: var(--text-secondary); font-style: italic; }
        .tiptap-editor ul { list-style: disc; padding-left: 1.5em; margin: 0.5em 0; }
        .tiptap-editor ol { list-style: decimal; padding-left: 1.5em; margin: 0.5em 0; }
        .tiptap-editor li { margin: 0.2em 0; }
        .tiptap-editor hr { border: none; border-top: 1px solid var(--border-subtle); margin: 1.5em 0; }
        .tiptap-editor a { color: var(--accent-blue); text-decoration: underline; }
        .tiptap-editor mark { border-radius: 3px; padding: 1px 3px; }
        .tiptap-editor img {
          max-width: 100%; border-radius: 10px; margin: 1.2em auto;
          display: block; border: 1px solid var(--border-subtle);
          cursor: pointer;
        }
        .tiptap-editor img.ProseMirror-selectednode {
          outline: 2px solid var(--accent-blue);
          outline-offset: 3px;
        }
        .tiptap-editor .is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left; color: var(--text-muted); pointer-events: none; height: 0;
          font-style: italic;
        }
        /* Bubble menu */
        .bubble-menu {
          display: flex; align-items: center; gap: 2px;
          background: var(--bg-secondary); border: 1px solid var(--border-primary);
          border-radius: 10px; padding: 4px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.5);
        }
        /* Floating menu */
        .floating-menu {
          display: flex; align-items: center; gap: 4px;
          background: var(--bg-card); border: 1px solid var(--border-subtle);
          border-radius: 10px; padding: 4px 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          opacity: 0; animation: fadeSlideIn 0.15s ease forwards;
        }
        @keyframes fadeSlideIn {
          from { opacity:0; transform: translateX(-6px); }
          to   { opacity:1; transform: translateX(0); }
        }
        .tiptap-wrapper { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 12px; overflow: hidden; }
        .tiptap-toolbar {
          display: flex; flex-wrap: wrap; align-items: center; gap: 2px;
          padding: 8px 10px; border-bottom: 1px solid var(--border-subtle);
          background: var(--bg-secondary); position: sticky; top: 0; z-index: 10;
        }
        .color-picker { width: 28px; height: 28px; border-radius: 6px; cursor: pointer; border: 2px solid var(--border-subtle); padding: 0; background: none; }
      `}</style>

      <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="flex items-center justify-center w-8 h-8 rounded-lg"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                <FaArrowLeft size={12} />
              </button>
              <div>
                <h1 className="font-bold text-xl" style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--text-primary)", letterSpacing: "1px", textTransform: "uppercase" }}>
                  Write Article
                </h1>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Rich text editor — add images anywhere</p>
              </div>
            </div>
            <button onClick={() => setPreviewMode((p) => !p)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: previewMode ? "rgba(41,121,255,0.15)" : "var(--bg-card)",
                color: previewMode ? "#6ab0ff" : "var(--text-secondary)",
                border: previewMode ? "1px solid rgba(41,121,255,0.3)" : "1px solid var(--border-subtle)",
              }}>
              <FaEye size={12} /> {previewMode ? "Edit" : "Preview"}
            </button>
          </div>

          <div className={`grid gap-6 ${previewMode ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
            {/* ── Left: Form ── */}
            <div className={`space-y-5 ${previewMode ? "" : "max-w-3xl"}`}>

              {/* Meta card */}
              <div className="rounded-2xl p-6 space-y-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
                {/* Title */}
                <div>
                  <label style={labelStyle}>Title *</label>
                  <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)}
                    onFocus={fieldFocus} onBlur={fieldBlur}
                    placeholder="Enter a compelling article title..."
                    style={{ ...inputStyle, fontSize: "16px", fontWeight: 700 }} />
                  {errors.title && <p style={errorStyle}>{errors.title}</p>}
                </div>

                {/* Summary */}
                <div>
                  <label style={labelStyle}>Summary *</label>
                  <textarea value={form.summary} onChange={(e) => set("summary", e.target.value)}
                    onFocus={fieldFocus as any} onBlur={fieldBlur as any} rows={2}
                    placeholder="A short summary shown in news cards..."
                    style={{ ...inputStyle, resize: "vertical" }} />
                  {errors.summary && <p style={errorStyle}>{errors.summary}</p>}
                </div>

                {/* Author + Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 6 }}>
                      <FaUser size={9} /> Author *
                    </label>
                    <input type="text" value={form.author} onChange={(e) => set("author", e.target.value)}
                      onFocus={fieldFocus} onBlur={fieldBlur} placeholder="Your name" style={inputStyle} />
                    {errors.author && <p style={errorStyle}>{errors.author}</p>}
                  </div>
                  <div>
                    <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 6 }}>
                      <FaTag size={9} /> Category *
                    </label>
                    <select value={form.category} onChange={(e) => set("category", e.target.value)}
                      onFocus={fieldFocus as any} onBlur={fieldBlur as any} style={inputStyle}>
                      <option value="">Select category</option>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.category && <p style={errorStyle}>{errors.category}</p>}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label style={labelStyle}>Tags (comma-separated)</label>
                  <input type="text" value={form.tags} onChange={(e) => set("tags", e.target.value)}
                    onFocus={fieldFocus} onBlur={fieldBlur}
                    placeholder="e.g. transfer, premier league, Arsenal" style={inputStyle} />
                  {form.tags && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {form.tags.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded"
                          style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cover image */}
                <div>
                  <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 6 }}>
                    <FaImage size={9} /> Cover Image
                  </label>
                  {coverPreview ? (
                    <div className="relative rounded-xl overflow-hidden" style={{ maxHeight: 200 }}>
                      <img src={coverPreview} alt="Cover" className="w-full object-cover" style={{ maxHeight: 200 }} />
                      <button onClick={() => { setCoverFile(null); setCoverPreview(""); if (imageInputRef.current) imageInputRef.current.value = ""; }}
                        className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full"
                        style={{ background: "rgba(0,0,0,0.7)", color: "#fff" }}>
                        <FaTimes size={11} />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp"
                        onChange={handleCoverChange} className="hidden" id="cover-upload" />
                      <label htmlFor="cover-upload"
                        className="flex flex-col items-center justify-center gap-2 py-5 rounded-xl cursor-pointer transition-all"
                        style={{ border: "2px dashed var(--border-subtle)", color: "var(--text-muted)" }}
                        onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-blue)"}
                        onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)"}>
                        <FaImage size={22} />
                        <span className="text-sm font-medium">Click to upload cover image</span>
                        <span className="text-xs">JPEG, PNG, WebP · max 5MB</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>or paste URL</span>
                        <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
                      </div>
                      <input type="url" value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)}
                        onFocus={fieldFocus} onBlur={fieldBlur}
                        placeholder="https://example.com/image.jpg" style={inputStyle} />
                    </div>
                  )}
                </div>

                {/* Featured toggle */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div className="relative" onClick={() => set("featured", !form.featured)}>
                    <div className="w-10 h-6 rounded-full transition-colors"
                      style={{ background: form.featured ? "var(--accent-green)" : "var(--bg-surface)" }} />
                    <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform"
                      style={{ transform: form.featured ? "translateX(16px)" : "translateX(0)" }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                    Mark as featured article
                  </span>
                </label>
              </div>

              {/* ── Rich Text Editor ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label style={labelStyle}>Content *</label>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    ~{Math.max(1, Math.ceil((editor.getText().split(/\s+/).filter(Boolean).length || 0) / 200))} min read
                    · {editor.getText().split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>

                <div className="tiptap-wrapper">
                  {/* ── Sticky Toolbar ── */}
                  <div className="tiptap-toolbar">
                    {/* History */}
                    <ToolBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><FaUndo size={11} /></ToolBtn>
                    <ToolBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><FaRedo size={11} /></ToolBtn>
                    <TDivider />

                    {/* Headings */}
                    <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1">
                      <span className="text-xs font-black">H1</span>
                    </ToolBtn>
                    <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
                      <span className="text-xs font-black">H2</span>
                    </ToolBtn>
                    <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">
                      <span className="text-xs font-black">H3</span>
                    </ToolBtn>
                    <TDivider />

                    {/* Inline marks */}
                    <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold (Ctrl+B)"><FaBold size={11} /></ToolBtn>
                    <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic (Ctrl+I)"><FaItalic size={11} /></ToolBtn>
                    <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline (Ctrl+U)"><FaUnderline size={11} /></ToolBtn>
                    <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough"><FaStrikethrough size={11} /></ToolBtn>
                    <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline code"><FaCode size={11} /></ToolBtn>
                    <TDivider />

                    {/* Highlight + Color */}
                    <ToolBtn onClick={() => editor.chain().focus().toggleHighlight({ color: "#ffab00" }).run()} active={editor.isActive("highlight")} title="Highlight"><FaHighlighter size={11} /></ToolBtn>
                    <div className="relative flex items-center" title="Text color">
                      <input type="color" value={colorValue} onChange={(e) => {
                        setColorValue(e.target.value);
                        editor.chain().focus().setColor(e.target.value).run();
                      }} className="color-picker" />
                    </div>
                    <ToolBtn onClick={() => editor.chain().focus().unsetAllMarks().run()} title="Clear formatting"><MdFormatClear size={14} /></ToolBtn>
                    <TDivider />

                    {/* Alignment */}
                    <ToolBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align left"><FaAlignLeft size={11} /></ToolBtn>
                    <ToolBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align center"><FaAlignCenter size={11} /></ToolBtn>
                    <ToolBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align right"><FaAlignRight size={11} /></ToolBtn>
                    <ToolBtn onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Justify"><FaAlignJustify size={11} /></ToolBtn>
                    <TDivider />

                    {/* Lists */}
                    <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list"><FaListUl size={11} /></ToolBtn>
                    <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered list"><FaListOl size={11} /></ToolBtn>
                    <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote"><FaQuoteLeft size={11} /></ToolBtn>
                    <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code block"><FaCode size={11} /></ToolBtn>
                    <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider line"><FaMinus size={11} /></ToolBtn>
                    <TDivider />

                    {/* Image */}
                    <input ref={inlineImageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleInlineImageFile} className="hidden" id="inline-img-upload" />
                    <ToolBtn onClick={() => inlineImageInputRef.current?.click()}
                      disabled={uploadingInlineImage}
                      title="Insert image from file">
                      {uploadingInlineImage ? (
                        <div className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
                      ) : (
                        <FaImage size={11} />
                      )}
                    </ToolBtn>
                    <ToolBtn onClick={insertImageByUrl} title="Insert image from URL"><MdOutlineImage size={14} /></ToolBtn>

                    {/* Link */}
                    {showLinkInput ? (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
                        <input
                          type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)}
                          placeholder="https://..." autoFocus
                          onKeyDown={(e) => { if (e.key === "Enter") handleAddLink(); if (e.key === "Escape") setShowLinkInput(false); }}
                          className="text-xs w-36 outline-none bg-transparent"
                          style={{ color: "var(--text-primary)" }}
                        />
                        <button onClick={handleAddLink} className="text-xs font-bold" style={{ color: "var(--accent-blue)" }}>Add</button>
                        <button onClick={() => setShowLinkInput(false)}><FaTimes size={9} style={{ color: "var(--text-muted)" }} /></button>
                      </div>
                    ) : (
                      <ToolBtn onClick={() => {
                        if (editor.isActive("link")) {
                          editor.chain().focus().unsetLink().run();
                        } else {
                          setShowLinkInput(true);
                        }
                      }} active={editor.isActive("link")} title="Add link">
                        <FaLink size={11} />
                      </ToolBtn>
                    )}
                  </div>

                  {/* Bubble menu — shows on text selection */}
                  <CustomBubbleMenu editor={editor}>
                    <div className="bubble-menu">
                      <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}><FaBold size={10} /></ToolBtn>
                      <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}><FaItalic size={10} /></ToolBtn>
                      <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")}><FaUnderline size={10} /></ToolBtn>
                      <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")}><FaStrikethrough size={10} /></ToolBtn>
                      <TDivider />
                      <ToolBtn onClick={() => editor.chain().focus().toggleHighlight({ color: "#ffab00" }).run()} active={editor.isActive("highlight")}><FaHighlighter size={10} /></ToolBtn>
                      <ToolBtn onClick={() => { editor.chain().focus().toggleHeading({ level: 2 }).run(); }} active={editor.isActive("heading", { level: 2 })}>
                        <span className="text-xs font-black">H2</span>
                      </ToolBtn>
                      <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")}><FaCode size={10} /></ToolBtn>
                      <TDivider />
                      <ToolBtn onClick={() => setShowLinkInput(true)} active={editor.isActive("link")}><FaLink size={10} /></ToolBtn>
                    </div>
                  </CustomBubbleMenu>

                  {/* Floating menu — shows on empty line */}
                  <CustomFloatingMenu editor={editor}>
                    <div className="floating-menu">
                      <span className="text-xs font-semibold mr-1" style={{ color: "var(--text-muted)" }}>Insert:</span>
                      <ToolBtn onClick={() => inlineImageInputRef.current?.click()} title="Image"><FaImage size={11} /></ToolBtn>
                      <ToolBtn onClick={insertImageByUrl} title="Image URL"><MdOutlineImage size={13} /></ToolBtn>
                      <TDivider />
                      <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">
                        <span className="text-xs font-black">H2</span>
                      </ToolBtn>
                      <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list"><FaListUl size={11} /></ToolBtn>
                      <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list"><FaListOl size={11} /></ToolBtn>
                      <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Quote"><FaQuoteLeft size={11} /></ToolBtn>
                      <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><FaMinus size={11} /></ToolBtn>
                    </div>
                  </CustomFloatingMenu>

                  {/* Editor area */}
                  <EditorContent editor={editor} />
                </div>
                {errors.content && <p style={errorStyle}>{errors.content}</p>}
              </div>

              {/* Submit buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => handleSubmit("draft")} disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                  style={{ background: "var(--bg-surface)", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)" }}>
                  <FaSave size={13} />
                  {isSubmitting ? "Saving..." : "Save as Draft"}
                </button>
                <button onClick={() => handleSubmit("published")} disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                  style={{ background: "var(--accent-green)", color: "#000" }}>
                  <MdSend size={14} />
                  {isSubmitting ? "Publishing..." : "Publish Now"}
                </button>
              </div>
            </div>

            {/* ── Right: Preview ── */}
            {previewMode && (
              <div className="sticky top-20">
                <div className="flex items-center justify-between mb-3">
                  <span className="section-label">Live Preview</span>
                </div>
                <NewsCard article={previewArticle} variant="featured" />
                <div className="mt-4 rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
                  <p className="text-xs font-bold mb-3" style={{ color: "var(--text-muted)", letterSpacing: "1px", textTransform: "uppercase" }}>Article Body Preview</p>
                  <div className="tiptap-editor" style={{ minHeight: "auto", padding: 0 }}
                    dangerouslySetInnerHTML={{ __html: editor.getHTML() }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
