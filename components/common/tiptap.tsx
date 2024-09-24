import React, { useCallback } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List } from "lucide-react";

import { Button } from "../ui/button";

interface TiptapEditorProps {
  onChange: (json: Record<string, any>) => void; // Callback to send editor content as JSON
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World! 🌎</p>",
    onUpdate: ({ editor }) => {
      const jsonContent = editor.getJSON();

      onChange(jsonContent); // Send JSON content via callback
    },
  });

  const handleBold = useCallback(
    () => editor?.chain().focus().toggleBold().run(),
    [editor],
  );
  const handleItalic = useCallback(
    () => editor?.chain().focus().toggleItalic().run(),
    [editor],
  );
  const handleBulletList = useCallback(
    () => editor?.chain().focus().toggleBulletList().run(),
    [editor],
  );

  return (
    <div className="p-4 border border-gray-300 dark:border-gray-800 rounded-lg shadow-md bg-white dark:bg-black">
      {/* Toolbar */}
      <div className="flex space-x-2 mb-4">
        <Button
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            handleBold();
          }}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            handleItalic();
          }}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            handleBulletList();
          }}
        >
          <List className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <EditorContent
        className="prose prose-sm max-w-full p-2 border border-gray-300 rounded bg-white focus:outline-none"
        editor={editor}
      />
    </div>
  );
};

export default TiptapEditor;
