"use client";

import React, { useCallback, useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignJustify,
  AlignRight,
  Unlink,
  ExternalLink,
  Baseline,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  onInsertVariable?: (insertFn: (variable: string) => void) => void;
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

const PRESET_COLORS = [
  "#000000",
  "#2d2d2d",
  "#4b5563",
  "#9ca3af",
  "#ffffff",
  "#F5771F",
  "#7a2a81",
  "#6366f1",
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
];

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-all text-sm ${
        active
          ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
          : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-6 bg-slate-700 mx-1" />;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Rédigez votre email...",
  onInsertVariable,
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-indigo-400 underline cursor-pointer",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      TextAlign.configure({
        types: ["paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      TextStyle,
      Color,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-sm max-w-none min-h-[220px] px-4 py-3 focus:outline-none text-slate-200 leading-relaxed",
      },
    },
  });

  const insertVariable = useCallback(
    (variable: string) => {
      if (!editor) return;
      editor.chain().focus().insertContent(`{{${variable}}}`).run();
    },
    [editor],
  );

  React.useEffect(() => {
    if (onInsertVariable) {
      onInsertVariable(insertVariable);
    }
  }, [insertVariable, onInsertVariable]);

  const handleSetLink = () => {
    if (!linkUrl.trim()) {
      setShowLinkInput(false);
      return;
    }
    const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
    editor?.chain().focus().setLink({ href: url }).run();
    setLinkUrl("");
    setShowLinkInput(false);
  };

  const handleRemoveLink = () => {
    editor?.chain().focus().unsetLink().run();
    setShowLinkInput(false);
  };

  const handleColorSelect = (color: string) => {
    editor?.chain().focus().setColor(color).run();
    setShowColorPicker(false);
  };

  const currentColor = editor?.getAttributes("textStyle").color || "#9ca3af";

  if (!editor) return null;

  return (
    <div className="border border-slate-700 rounded-xl overflow-hidden focus-within:border-indigo-500 transition-colors bg-slate-900">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-slate-700 bg-slate-900/80">
        {/* Text formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Gras (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italique (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Souligné (Ctrl+U)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="Aligner à gauche"
        >
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title="Centrer"
        >
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="Aligner à droite"
        >
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          active={editor.isActive({ textAlign: "justify" })}
          title="Justifier"
        >
          <AlignJustify className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        {/* Color picker */}
        <div className="relative" ref={colorPickerRef}>
          <button
            type="button"
            title="Couleur du texte"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 rounded-lg transition-all text-slate-400 hover:bg-slate-700 hover:text-slate-200 flex flex-col items-center gap-0.5"
          >
            <Baseline className="w-4 h-4" />
            <div
              className="w-4 h-1 rounded-full"
              style={{ backgroundColor: currentColor }}
            />
          </button>

          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl w-48">
              {/* Preset colors grid */}
              <div className="grid grid-cols-6 gap-1.5 mb-3">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorSelect(color)}
                    title={color}
                    className="w-6 h-6 rounded-md border border-slate-600 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Custom color input */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
                <input
                  type="color"
                  defaultValue={currentColor}
                  onChange={(e) => handleColorSelect(e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent p-0"
                />
                <span className="text-xs text-slate-400">Personnalisée</span>
              </div>

              {/* Reset */}
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  setShowColorPicker(false);
                }}
                className="mt-2 w-full text-xs text-slate-400 hover:text-slate-200 text-center py-1 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Réinitialiser
              </button>
            </div>
          )}
        </div>

        <Divider />

        {/* Link */}
        <ToolbarButton
          onClick={() => setShowLinkInput(!showLinkInput)}
          active={editor.isActive("link") || showLinkInput}
          title="Insérer un lien"
        >
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>
        {editor.isActive("link") && (
          <ToolbarButton onClick={handleRemoveLink} title="Supprimer le lien">
            <Unlink className="w-4 h-4" />
          </ToolbarButton>
        )}
      </div>

      {/* Link input */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-700 bg-slate-800/50">
          <ExternalLink className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSetLink();
              if (e.key === "Escape") setShowLinkInput(false);
            }}
            placeholder="https://..."
            autoFocus
            className="flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSetLink}
            className="px-3 py-1 bg-indigo-500 text-white text-xs font-medium rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Insérer
          </button>
          <button
            type="button"
            onClick={() => setShowLinkInput(false)}
            className="px-3 py-1 bg-slate-700 text-slate-300 text-xs font-medium rounded-lg hover:bg-slate-600 transition-colors"
          >
            Annuler
          </button>
        </div>
      )}

      {/* Editor area */}
      <div className="relative">
        {editor.isEmpty && (
          <p className="absolute top-3 left-4 text-slate-500 text-sm pointer-events-none select-none">
            {placeholder}
          </p>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
