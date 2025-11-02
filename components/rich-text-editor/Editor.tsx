"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { editorExtensions } from "./extension";
import { MenuBar } from "./MenuBar";
import { ReactNode } from "react";

interface EditorProps {
  field: any;
  sendButton: ReactNode;
  footerLeft?: ReactNode;
}

export function RichTextEditor({ field , sendButton , footerLeft }: EditorProps) {
  const editor = useEditor({
    extensions: editorExtensions,
    immediatelyRender: false,
    content: (() => {
      if (!field?.value) return "";
      try {
        return JSON.parse(field.value);
      } catch (error) {
        return "";
      }
    })(),
    onUpdate: ({ editor }) => {
      if (field?.onChange) {
        field.onChange(JSON.stringify(editor.getJSON()));
      }
    },
    editorProps: {
      attributes: {
        class:
          "max-w-none min-h-[125px] focus:outline-none p-4 prose dark:prose-invert  maker:text-primary",
      },
    },
  });

  return (
    <div className="relative w-full border border-input rounded-lg overflow-hidden dark:bg-input/30 flex flex-col">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="max-h-[200px] overflow-y-auto"
      />

      <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-input bg-card">
        <div className="min-h-8 flex items-center">{ footerLeft }</div>
        <div className="shrink-0">{ sendButton}</div>
      </div>
    </div>
  );
}
