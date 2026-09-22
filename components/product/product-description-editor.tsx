"use client";

import {Button} from "@heroui/react";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode,
} from "@lexical/list";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {LexicalComposer} from "@lexical/react/LexicalComposer";
import {ContentEditable} from "@lexical/react/LexicalContentEditable";
import {LexicalErrorBoundary} from "@lexical/react/LexicalErrorBoundary";
import {HistoryPlugin} from "@lexical/react/LexicalHistoryPlugin";
import {ListPlugin} from "@lexical/react/LexicalListPlugin";
import {OnChangePlugin} from "@lexical/react/LexicalOnChangePlugin";
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  type LexicalEditor,
} from "lexical";
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingNode,
  QuoteNode,
} from "@lexical/rich-text";
import {$setBlocksType} from "@lexical/selection";
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
import type {ReactNode} from "react";

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
}

const editorConfig = {
  namespace: "ProductDescription",
  onError(error: Error) {
    throw error;
  },
  nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
  theme: {
    heading: {
      h1: "mb-2 text-2xl font-semibold",
      h2: "mb-2 text-xl font-semibold",
      h3: "mb-2 text-lg font-semibold",
    },
    list: {
      listitem: "my-1",
      ol: "list-decimal ps-6",
      ul: "list-disc ps-6",
    },
    paragraph: "mb-2 last:mb-0",
    quote: "border-s-2 border-border ps-4 italic text-muted",
    text: {
      bold: "font-semibold",
      code: "rounded bg-surface-secondary px-1 font-mono text-sm",
      italic: "italic",
      strikethrough: "line-through",
      underline: "underline",
    },
  },
};

export function ProductDescriptionEditor({
  editorLabel,
  onChange,
  placeholder,
  toolbarLabel,
  toolbarLabels,
}: ProductDescriptionEditorProps) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div
          aria-label={toolbarLabel}
          className="flex flex-wrap items-center gap-1 border-b border-border p-2"
          role="group"
        >
          <FormatButton
            label={toolbarLabels.bold}
            onPress={(editor) =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
            }
          >
            <IconBold aria-hidden="true" size={18} />
          </FormatButton>
          <FormatButton
            label={toolbarLabels.italic}
            onPress={(editor) =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
            }
          >
            <IconItalic aria-hidden="true" size={18} />
          </FormatButton>
          <FormatButton
            label={toolbarLabels.underline}
            onPress={(editor) =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
            }
          >
            <IconUnderline aria-hidden="true" size={18} />
          </FormatButton>
          <FormatButton
            label={toolbarLabels.strikethrough}
            onPress={(editor) =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
            }
          >
            <IconStrikethrough aria-hidden="true" size={18} />
          </FormatButton>
          <FormatButton
            label={toolbarLabels.code}
            onPress={(editor) =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")
            }
          >
            <IconCode aria-hidden="true" size={18} />
          </FormatButton>
          <span aria-hidden="true" className="mx-1 h-5 border-s border-border" />
          <FormatButton
            label={toolbarLabels.heading1}
            onPress={(editor) => setBlockType(editor, "h1")}
          >
            <IconH1 aria-hidden="true" size={18} />
          </FormatButton>
          <FormatButton
            label={toolbarLabels.heading2}
            onPress={(editor) => setBlockType(editor, "h2")}
          >
            <IconH2 aria-hidden="true" size={18} />
          </FormatButton>
          <FormatButton
            label={toolbarLabels.heading3}
            onPress={(editor) => setBlockType(editor, "h3")}
          >
            <IconH3 aria-hidden="true" size={18} />
          </FormatButton>
          <FormatButton
            label={toolbarLabels.bulletList}
            onPress={(editor) =>
              editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
            }
          >
            <IconList aria-hidden="true" size={18} />
          </FormatButton>
          <FormatButton
            label={toolbarLabels.numberedList}
            onPress={(editor) =>
              editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
            }
          >
            <IconListNumbers aria-hidden="true" size={18} />
          </FormatButton>
          <FormatButton
            label={toolbarLabels.blockquote}
            onPress={(editor) => setBlockType(editor, "quote")}
          >
            <IconBlockquote aria-hidden="true" size={18} />
          </FormatButton>
        </div>
        <div className="relative min-h-44">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                aria-label={editorLabel}
                className="min-h-44 px-3 py-2.5 text-sm leading-6"
              />
            }
            placeholder={
              <div className="pointer-events-none absolute inset-x-3 top-2.5 text-sm text-muted">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
      </div>
      <HistoryPlugin />
      <ListPlugin />
      <OnChangePlugin
        onChange={(editorState) => onChange(JSON.stringify(editorState.toJSON()))}
      />
    </LexicalComposer>
  );
}

function FormatButton({
  children,
  label,
  onPress,
}: {
  children: ReactNode;
  label: string;
  onPress: (editor: LexicalEditor) => void;
}) {
  const [editor] = useLexicalComposerContext();

  return (
    <Button
      aria-label={label}
      isIconOnly
      size="sm"
      type="button"
      variant="secondary"
      onPress={() => onPress(editor)}
    >
      {children}
    </Button>
  );
}

function setBlockType(
  editor: LexicalEditor,
  blockType: "h1" | "h2" | "h3" | "quote",
) {
  editor.update(() => {
    const selection = $getSelection();

    if (!$isRangeSelection(selection)) {
      return;
    }

    $setBlocksType(selection, () =>
      blockType === "quote"
        ? $createQuoteNode()
        : $createHeadingNode(blockType),
    );
  });
}
