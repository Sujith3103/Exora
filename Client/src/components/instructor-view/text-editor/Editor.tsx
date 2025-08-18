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
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { setCourseLandingDescription } from "@/store/courseSlice";

function LoadContentPlugin() {
    const [editor] = useLexicalComposerContext();
    const courseLandingState = useSelector((state: RootState) => state.course.CourseLanding);

    useEffect(() => {
        if (courseLandingState?.description) {
            const json = JSON.parse(courseLandingState.description);
            const editorState = editor.parseEditorState(json);
            editor.setEditorState(editorState);
        }
        // ⚠ only run once on mount, not when Redux state changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor]);
    return null;
}



// --- Handle changes (saving) ---


type EditorProps = {
    placeholder: string;
};

export default function Editor({ placeholder }: EditorProps) {

    const dispatch = useDispatch<AppDispatch>()
    const courseLandingState = useSelector((state: RootState) => state.course.CourseLanding)
    function onChange(editorState: EditorState) {
        const json = editorState.toJSON();

        const rootNode = json.root.children[0];

        const isEmpty =
            json.root.children.length === 1 &&
            rootNode.type === "paragraph" &&
            "children" in rootNode &&
            Array.isArray(rootNode.children) &&
            rootNode.children.length === 0;

        if (isEmpty) {
            // localStorage.removeItem("editorContent");
            dispatch(setCourseLandingDescription({ description: null }));
        } else {
            // localStorage.setItem("editorContent", JSON.stringify(json));
            dispatch(setCourseLandingDescription({ description: JSON.stringify(json) }));
        }
    }


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


    // useEffect(() => {
    //     console.log(courseLandingState?.description)
    // }, [courseLandingState?.description])

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className="border p-3 rounded-lg bg-white border-gray-300 shadow-md">
                <RichTextPlugin
                    contentEditable={
                        <div className="relative min-h-[100px]">
                            <ContentEditable className="outline-none min-h-[100px] w-full p-2" />
                            {/* Custom placeholder inside the same relative wrapper */}
                            <div className="absolute top-2 left-2 text-gray-400 pointer-events-none">
                                {
                                    !courseLandingState?.description && placeholder
                                }
                            </div>
                        </div>
                    }
                    placeholder={null} // disable default Lexical placeholder
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
