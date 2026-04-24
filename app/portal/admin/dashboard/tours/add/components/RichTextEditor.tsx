"use client";

import {
  BoldOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  StrikethroughOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

type RichTextEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  /** Shown inside the editor when empty */
  placeholder?: string;
};

const toolbarBtnClass = "flex h-8 w-8 items-center justify-center rounded-md border-0 shadow-none";

export default function RichTextEditor({ value, onChange, placeholder = "Write here…" }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "tiptap-editor-content ProseMirror min-h-[11rem] px-4 py-3 text-[15px] leading-relaxed text-slate-800 focus:outline-none",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange?.(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const current = editor.getHTML();
    const nextValue = value || "";
    if (current !== nextValue) {
      editor.commands.setContent(nextValue, { emitUpdate: false });
    }
  }, [editor, value]);

  return (
    <div className="tiptap-shell overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-900/5 transition-shadow focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 bg-slate-50/90 px-2 py-2">
        <Tooltip title="Bold">
          <Button
            type={editor?.isActive("bold") ? "primary" : "text"}
            className={toolbarBtnClass}
            icon={<BoldOutlined />}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          />
        </Tooltip>
        <Tooltip title="Italic">
          <Button
            type={editor?.isActive("italic") ? "primary" : "text"}
            className={toolbarBtnClass}
            icon={<ItalicOutlined />}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          />
        </Tooltip>
        <Tooltip title="Strikethrough">
          <Button
            type={editor?.isActive("strike") ? "primary" : "text"}
            className={toolbarBtnClass}
            icon={<StrikethroughOutlined />}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          />
        </Tooltip>
        <span className="mx-1 hidden h-5 w-px bg-slate-200 sm:inline" aria-hidden />
        <Tooltip title="Bullet list">
          <Button
            type={editor?.isActive("bulletList") ? "primary" : "text"}
            className={toolbarBtnClass}
            icon={<UnorderedListOutlined />}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          />
        </Tooltip>
        <Tooltip title="Numbered list">
          <Button
            type={editor?.isActive("orderedList") ? "primary" : "text"}
            className={toolbarBtnClass}
            icon={<OrderedListOutlined />}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          />
        </Tooltip>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
