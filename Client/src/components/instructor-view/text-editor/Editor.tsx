"use client";

import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";

import type { RootState, AppDispatch } from "@/store";
import { setCourseLandingDescription } from "@/store/courseSlice";
import Toolbar from "./ToolbarPlugin";
import "./Editor.css";

type EditorProps = { placeholder: string };

export default function Editor({ placeholder }: EditorProps) {
  const dispatch = useDispatch<AppDispatch>();
  const courseData = useSelector(
    (state: RootState) => state.course.courseInformation
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: courseData?.description || "<p></p>",
    autofocus: true,
    onUpdate({ editor }) {
      const json = editor.getJSON();
      const isEmpty =
        json.content.length === 1 &&
        json.content[0].type === "paragraph" &&
        (!json.content[0].content || json.content[0].content.length === 0);

      dispatch(
        setCourseLandingDescription({
          description: isEmpty ? null : JSON.stringify(json),
        })
      );
    },
  });

  useEffect(() => {
    if (courseData?.description && editor) {
      try {
        const json = JSON.parse(courseData.description);
        editor.commands.setContent(json);
      } catch (e) {
        console.error("Failed to load content:", e);
      }
    }
  }, [courseData?.description, editor]);

  return (
    <div className="flex flex-col border border-gray-300 rounded-lg shadow-md bg-white overflow-hidden">
      <Toolbar editor={editor} />

      <div className="p-3 min-h-[150px] relative">
        <EditorContent
          editor={editor}
          className="editor-content outline-none min-h-[120px] w-full p-2"
        />
        {!courseData?.description && (
          <div className="absolute top-5 left-5 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}
