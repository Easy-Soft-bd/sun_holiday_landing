"use client";

type RichTextHtmlProps = {
  html: string;
  className?: string;
};

/** Renders stored HTML from the Tiptap editor (admin). Trusted admin content. */
export default function RichTextHtml({ html, className = "" }: RichTextHtmlProps) {
  if (!html?.trim()) {
    return null;
  }

  return (
    <div
      className={`prose prose-lg max-w-none text-base-content/80 [&_p]:mb-3 last:[&_p]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-0.5 [&_a]:text-primary [&_strong]:font-semibold [&_s]:line-through [&_del]:line-through ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
