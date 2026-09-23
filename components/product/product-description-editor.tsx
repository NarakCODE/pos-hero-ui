"use client";

import { Button } from "@heroui/react";
import { Markdown } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";
import {
  EditorContent,
  useEditor,
  useEditorState,
  type Editor,
} from "@tiptap/react";
import {
  IconBlockquote,
  IconBold,
  IconCode,
  IconH1,
  IconH2,
  IconH3,
  IconItalic,
  IconList,
  IconListNumbers,
  IconStrikethrough,
  IconUnderline,
} from "@tabler/icons-react";
import { useEffect, useState, type ReactNode } from "react";

type FormatAction =
  | "bold"
  | "italic"
  | "underline"
  | "strikethrough"
  | "code"
  | "heading1"
  | "heading2"
  | "heading3"
  | "bulletList"
  | "numberedList"
  | "blockquote";

export interface ProductDescriptionEditorProps {
  editorLabel: string;
  onChange: (value: string) => void;
  placeholder: string;
  toolbarLabel: string;
  toolbarLabels: Record<FormatAction, string>;
  value: string;
}

const extensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
  }),
  Markdown,
];

const emptyFormatState = {
  isEmpty: true,
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  code: false,
  heading1: false,
  heading2: false,
  heading3: false,
  bulletList: false,
  numberedList: false,
  blockquote: false,
};

const editorClassName = [
  "min-h-44 px-3 py-2.5 text-sm leading-6 outline-none",
  "[&_p]:mb-2 [&_p:last-child]:mb-0",
  "[&_h1]:mb-2 [&_h1]:text-2xl [&_h1]:font-semibold",
  "[&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold",
  "[&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold",
  "[&_ul]:list-disc [&_ul]:ps-6 [&_ol]:list-decimal [&_ol]:ps-6",
  "[&_li]:my-1",
  "[&_blockquote]:border-s-2 [&_blockquote]:border-border [&_blockquote]:ps-4 [&_blockquote]:italic [&_blockquote]:text-muted",
  "[&_code]:rounded [&_code]:bg-surface-secondary [&_code]:px-1 [&_code]:font-mono [&_code]:text-sm",
].join(" ");

export function ProductDescriptionEditor({
  editorLabel,
  onChange,
  placeholder,
  toolbarLabel,
  toolbarLabels,
  value,
}: ProductDescriptionEditorProps) {
  const [initialValue] = useState(value);
  const editor = useEditor({
    extensions,
    content: initialValue,
    contentType: "markdown",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        "aria-label": editorLabel,
        class: editorClassName,
      },
      handlePaste: (_view, event) => {
        const clipboard = event.clipboardData;
        const markdown = clipboard?.getData("text/plain");
        const markdownManager = editor?.markdown;

        if (
          !markdown ||
          clipboard?.getData("text/html") ||
          !looksLikeMarkdown(markdown) ||
          !editor ||
          !markdownManager
        ) {
          return false;
        }

        editor.commands.insertContent(markdownManager.parse(markdown));
        return true;
      },
    },
    onUpdate: ({ editor: updatedEditor }) => {
      queueMicrotask(() =>
        onChange(updatedEditor.isEmpty ? "" : updatedEditor.getMarkdown()),
      );
    },
  });

  useEffect(() => {
    if (editor && editor.getMarkdown() !== value) {
      editor.commands.setContent(value, {
        contentType: "markdown",
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  const formatState =
    useEditorState({
      editor,
      selector: ({ editor: currentEditor }) => ({
        isEmpty: currentEditor?.isEmpty ?? true,
        bold: currentEditor?.isActive("bold") ?? false,
        italic: currentEditor?.isActive("italic") ?? false,
        underline: currentEditor?.isActive("underline") ?? false,
        strikethrough: currentEditor?.isActive("strike") ?? false,
        code: currentEditor?.isActive("code") ?? false,
        heading1: currentEditor?.isActive("heading", { level: 1 }) ?? false,
        heading2: currentEditor?.isActive("heading", { level: 2 }) ?? false,
        heading3: currentEditor?.isActive("heading", { level: 3 }) ?? false,
        bulletList: currentEditor?.isActive("bulletList") ?? false,
        numberedList: currentEditor?.isActive("orderedList") ?? false,
        blockquote: currentEditor?.isActive("blockquote") ?? false,
      }),
    }) ?? emptyFormatState;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div
        aria-label={toolbarLabel}
        className="flex flex-wrap items-center gap-1 border-b border-border p-2"
        role="group"
      >
        <FormatButton
          editor={editor}
          isActive={formatState.bold}
          label={toolbarLabels.bold}
          onPress={(activeEditor) =>
            activeEditor.chain().focus().toggleBold().run()
          }
        >
          <IconBold aria-hidden="true" size={18} />
        </FormatButton>
        <FormatButton
          editor={editor}
          isActive={formatState.italic}
          label={toolbarLabels.italic}
          onPress={(activeEditor) =>
            activeEditor.chain().focus().toggleItalic().run()
          }
        >
          <IconItalic aria-hidden="true" size={18} />
        </FormatButton>
        <FormatButton
          editor={editor}
          isActive={formatState.underline}
          label={toolbarLabels.underline}
          onPress={(activeEditor) =>
            activeEditor.chain().focus().toggleUnderline().run()
          }
        >
          <IconUnderline aria-hidden="true" size={18} />
        </FormatButton>
        <FormatButton
          editor={editor}
          isActive={formatState.strikethrough}
          label={toolbarLabels.strikethrough}
          onPress={(activeEditor) =>
            activeEditor.chain().focus().toggleStrike().run()
          }
        >
          <IconStrikethrough aria-hidden="true" size={18} />
        </FormatButton>
        <FormatButton
          editor={editor}
          isActive={formatState.code}
          label={toolbarLabels.code}
          onPress={(activeEditor) =>
            activeEditor.chain().focus().toggleCode().run()
          }
        >
          <IconCode aria-hidden="true" size={18} />
        </FormatButton>
        <span aria-hidden="true" className="mx-1 h-5 border-s border-border" />
        <FormatButton
          editor={editor}
          isActive={formatState.heading1}
          label={toolbarLabels.heading1}
          onPress={(activeEditor) =>
            activeEditor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <IconH1 aria-hidden="true" size={18} />
        </FormatButton>
        <FormatButton
          editor={editor}
          isActive={formatState.heading2}
          label={toolbarLabels.heading2}
          onPress={(activeEditor) =>
            activeEditor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <IconH2 aria-hidden="true" size={18} />
        </FormatButton>
        <FormatButton
          editor={editor}
          isActive={formatState.heading3}
          label={toolbarLabels.heading3}
          onPress={(activeEditor) =>
            activeEditor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <IconH3 aria-hidden="true" size={18} />
        </FormatButton>
        <FormatButton
          editor={editor}
          isActive={formatState.bulletList}
          label={toolbarLabels.bulletList}
          onPress={(activeEditor) =>
            activeEditor.chain().focus().toggleBulletList().run()
          }
        >
          <IconList aria-hidden="true" size={18} />
        </FormatButton>
        <FormatButton
          editor={editor}
          isActive={formatState.numberedList}
          label={toolbarLabels.numberedList}
          onPress={(activeEditor) =>
            activeEditor.chain().focus().toggleOrderedList().run()
          }
        >
          <IconListNumbers aria-hidden="true" size={18} />
        </FormatButton>
        <FormatButton
          editor={editor}
          isActive={formatState.blockquote}
          label={toolbarLabels.blockquote}
          onPress={(activeEditor) =>
            activeEditor.chain().focus().toggleBlockquote().run()
          }
        >
          <IconBlockquote aria-hidden="true" size={18} />
        </FormatButton>
      </div>

      <div className="relative min-h-44">
        <EditorContent editor={editor} />
        {formatState.isEmpty ? (
          <div className="pointer-events-none absolute inset-x-3 top-2.5 text-sm text-muted">
            {placeholder}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function looksLikeMarkdown(value: string) {
  return (
    /^#{1,3}\s/m.test(value) ||
    /^\s*(?:[-*+]\s|\d+\.\s)/m.test(value) ||
    /^>\s/m.test(value) ||
    /\*\*[^*]+\*\*|__[^_]+__|~~[^~]+~~|`[^`]+`/.test(value) ||
    /(^|[^*])\*[^*\s][^*]*\*(?!\*)|(^|[^_])_[^_\s][^_]*_(?!_)/.test(value) ||
    /\[[^\]]+\]\([^)]+\)/.test(value) ||
    /^```/m.test(value)
  );
}

function FormatButton({
  children,
  editor,
  isActive,
  label,
  onPress,
}: {
  children: ReactNode;
  editor: Editor | null;
  isActive: boolean;
  label: string;
  onPress: (editor: Editor) => void;
}) {
  return (
    <Button
      aria-label={label}
      aria-pressed={isActive}
      isDisabled={!editor}
      isIconOnly
      size="sm"
      type="button"
      variant={isActive ? "primary" : "secondary"}
      onPress={() => {
        if (editor) {
          onPress(editor);
        }
      }}
    >
      {children}
    </Button>
  );
}
