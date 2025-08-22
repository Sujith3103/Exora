import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'

// This can run server-side
export function renderTiptapJSONtoHTML(json: any) {
  const editor = new Editor({
    content: json,
    extensions: [StarterKit, BulletList, OrderedList, ListItem],
  })

  return editor.getHTML()
}
