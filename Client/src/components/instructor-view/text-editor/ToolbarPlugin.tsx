import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND} from 'lexical';
import {Bold, Italic, Underline, Link, List, Quote} from "lucide-react";
import {Button} from "@/components/ui/button"; // if using shadcn

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const formatText = (format: any) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  return (
    <div className="flex space-x-2 border-b p-2 bg-gray-50 dark:bg-gray-800 rounded-t-xl">
      <Button size="sm" variant="ghost" onClick={() => formatText('bold')}>
        <Bold className="w-4 h-4" />
      </Button>
      <Button size="sm" variant="ghost" onClick={() => formatText('italic')}>
        <Italic className="w-4 h-4" />
      </Button>
  
      <Button size="sm" variant="ghost">
        <List className="w-4 h-4" />
      </Button>
    </div>
  );
}
