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
    <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-md dark:border-gray-800 dark:bg-black">
      {/* Toolbar */}
      <div className="mb-4 flex space-x-2">
        <Button
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            handleBold();
          }}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            handleItalic();
          }}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            handleBulletList();
          }}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <EditorContent
        className="prose prose-sm max-w-full rounded border border-gray-300 bg-white p-2 focus:outline-none"
        editor={editor}
      />
    </div>
  );
};

export default TiptapEditor;
