"use client";

import { Button } from "antd";
import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";

type BlogFormPageShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function BlogFormPageShell({ title, subtitle, children }: BlogFormPageShellProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 pb-16 sm:px-6 lg:px-0">
      <header className="flex flex-col gap-4 border-b border-slate-200/80 bg-gradient-to-b from-slate-50/80 to-transparent pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <Link
            href="/portal/admin/dashboard/blog"
            className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-primary"
          >
            <ArrowLeftOutlined className="text-xs" />
            All posts
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
          {subtitle ? <p className="max-w-xl text-sm leading-relaxed text-slate-600">{subtitle}</p> : null}
        </div>
        <Link href="/portal/admin/dashboard/blog" className="shrink-0">
          <Button size="large">Cancel</Button>
        </Link>
      </header>
      {children}
    </div>
  );
}
