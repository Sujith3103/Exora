"use client";

import React from "react";
import { Editor } from "@tiptap/react";
import { Bold, Italic, List, ListOrdered, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type ToolbarProps = {
  editor: Editor | null;
};

export default function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  return (
    <div className="flex space-x-1 border-b p-2 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
      <Button
        size="sm"
        variant={editor.isActive("bold") ? "default" : "ghost"}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive("italic") ? "default" : "ghost"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive("bulletList") ? "default" : "ghost"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive("orderedList") ? "default" : "ghost"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().undo().run()}
      >
        <RotateCcw className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().redo().run()}
      >
        <RotateCcw className="w-4 h-4 rotate-180" />
      </Button>
    </div>
  );
}
