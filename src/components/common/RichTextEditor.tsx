"use client";

import {
  BoldOutlined,
  DisconnectOutlined,
  ItalicOutlined,
  LinkOutlined,
  OrderedListOutlined,
  StrikethroughOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { App, Button, Input, Modal, Space, Tooltip } from "antd";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useState } from "react";

type RichTextEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** When true, H2/H3 toolbar buttons are shown (blog). */
  enableHeadings?: boolean;
};

const toolbarBtnClass = "flex h-8 w-8 items-center justify-center rounded-md border-0 shadow-none";

function normalizeHref(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(trimmed)) {
    return trimmed;
  }

  // Bare domains → https
  if (/^[a-z0-9.-]+\.[a-z]{2,}([/:?#].*)?$/i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write here…",
  enableHeadings = false,
}: RichTextEditorProps) {
  const { message } = App.useApp();
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: enableHeadings ? { levels: [2, 3] } : false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          class: "text-primary underline underline-offset-2",
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: [
          "tiptap-editor-content ProseMirror min-h-[11rem] px-4 py-3 text-[15px] leading-relaxed text-slate-800 focus:outline-none",
          "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
          enableHeadings
            ? "[&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold"
            : "",
        ]
          .filter(Boolean)
          .join(" "),
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

  const openLinkModal = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    setLinkUrl(previous || "");
    setLinkModalOpen(true);
  }, [editor]);

  const applyLink = useCallback(() => {
    if (!editor) return;
    const href = normalizeHref(linkUrl);
    if (!href) {
      message.warning("Enter a valid URL");
      return;
    }

    if (editor.state.selection.empty) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "text",
          text: href,
          marks: [{ type: "link", attrs: { href } }],
        })
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    }

    setLinkModalOpen(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  const removeLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
  }, [editor]);

  return (
    <>
      <div className="tiptap-shell overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-900/5 transition-shadow focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20">
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 bg-slate-50/90 px-2 py-2">
          {enableHeadings ? (
            <>
              <Tooltip title="Heading 2">
                <Button
                  type={editor?.isActive("heading", { level: 2 }) ? "primary" : "text"}
                  className={toolbarBtnClass}
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                  H2
                </Button>
              </Tooltip>
              <Tooltip title="Heading 3">
                <Button
                  type={editor?.isActive("heading", { level: 3 }) ? "primary" : "text"}
                  className={toolbarBtnClass}
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                  H3
                </Button>
              </Tooltip>
              <span className="mx-1 hidden h-5 w-px bg-slate-200 sm:inline" aria-hidden />
            </>
          ) : null}
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
          <Tooltip title="Insert / edit link">
            <Button
              type={editor?.isActive("link") ? "primary" : "text"}
              className={toolbarBtnClass}
              icon={<LinkOutlined />}
              onClick={openLinkModal}
            />
          </Tooltip>
          <Tooltip title="Remove link">
            <Button
              type="text"
              className={toolbarBtnClass}
              icon={<DisconnectOutlined />}
              disabled={!editor?.isActive("link")}
              onClick={removeLink}
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

      <Modal
        title="Insert link"
        open={linkModalOpen}
        onCancel={() => {
          setLinkModalOpen(false);
          setLinkUrl("");
        }}
        onOk={applyLink}
        okText="Apply"
        destroyOnHidden
      >
        <Space orientation="vertical" className="w-full pt-2">
          <p className="m-0 text-sm text-slate-500">
            Select text first to wrap it in a link, or leave empty selection to insert the URL as linked text.
          </p>
          <Input
            autoFocus
            placeholder="https://example.com or /blog/my-post"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onPressEnter={applyLink}
            size="large"
          />
        </Space>
      </Modal>
    </>
  );
}
