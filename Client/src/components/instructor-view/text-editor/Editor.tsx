"use client";
import { useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ListNode, ListItemNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import type { EditorState } from "lexical";

// --- Load content plugin (for rehydration) ---
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
function LoadContentPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const saved = localStorage.getItem("editorContent");
    if (saved) {
      const editorState = editor.parseEditorState(JSON.parse(saved));
      editor.setEditorState(editorState);
    }
  }, [editor]);

  return null;
}

// --- Handle changes (saving) ---
function onChange(editorState: EditorState) {
  const json = editorState.toJSON();
  localStorage.setItem("editorContent", JSON.stringify(json));
  console.log("Saved in DB:", json);
}

export default function Editor() {
  const initialConfig = {
    namespace: "MyEditor",
    theme: {
      paragraph: "mb-2",
    },
    onError(error: Error) {
      console.error("Lexical Error:", error);
    },
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border p-3 rounded-lg bg-white shadow-md">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="outline-none min-h-[150px]" />
          }
          placeholder={<div className="text-gray-400">Type here...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ListPlugin />
        <OnChangePlugin onChange={onChange} />
        <LoadContentPlugin />
      </div>
    </LexicalComposer>
  );
}
