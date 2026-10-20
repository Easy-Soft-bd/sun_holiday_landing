"use client";

import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";

type BlogFormPageShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function BlogFormPageShell({ title, subtitle, children }: BlogFormPageShellProps) {
  return (
    <div className="w-full space-y-8 pb-8">
      <header className="flex flex-col gap-4 border-b border-base-300 pb-5 sm:flex-row sm:items-start sm:justify-between">
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
      </header>
      {children}
    </div>
  );
}
