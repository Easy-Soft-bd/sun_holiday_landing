"use client";

import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Input, Upload, message } from "antd";
import { useState } from "react";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  uploadType?: string;
  isHero?: boolean;
  indexDisplay: number;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
};

export default function SailorMoonGalleryImageCell({
  value,
  onChange,
  uploadType = "sailor",
  isHero = false,
  indexDisplay,
  onRemove,
  onMoveUp,
  onMoveDown,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const src = typeof value === "string" ? value.trim() : "";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-900/5 transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200">
        {isHero ? (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-content shadow-sm">
            Hero
          </span>
        ) : null}

        <div className="absolute right-2 top-2 z-10 flex gap-0.5 rounded-lg bg-black/45 p-0.5 shadow-md backdrop-blur-sm">
          {onMoveUp ? (
            <Button
              type="text"
              size="small"
              className="!text-white hover:!bg-white/20"
              icon={<ArrowUpOutlined />}
              onClick={(e) => {
                e.preventDefault();
                onMoveUp();
              }}
              title="Move up"
            />
          ) : null}
          {onMoveDown ? (
            <Button
              type="text"
              size="small"
              className="!text-white hover:!bg-white/20"
              icon={<ArrowDownOutlined />}
              onClick={(e) => {
                e.preventDefault();
                onMoveDown();
              }}
              title="Move down"
            />
          ) : null}
          <Button
            type="text"
            size="small"
            danger
            className="!text-red-200 hover:!bg-red-500/30 hover:!text-white"
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.preventDefault();
              onRemove();
            }}
            title="Remove"
          />
        </div>

        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.opacity = "0.35")} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 px-4 text-center">
            <span className="text-2xl font-light text-slate-300">{indexDisplay}</span>
            <span className="text-xs text-slate-400">Drop URL or upload</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 border-t border-slate-100 p-3">
        <Input
          size="small"
          value={value}
          placeholder="Image URL"
          onChange={(e) => onChange?.(e.target.value)}
          className="font-mono text-[11px]"
        />
        <Upload
          name="file"
          action="/api/upload"
          data={{ type: uploadType, oldPath: src }}
          accept="image/*"
          showUploadList={false}
          onChange={(info) => {
            if (info.file.status === "uploading") {
              setUploading(true);
              return;
            }
            if (info.file.status === "done") {
              const uploadedUrl = (info.file.response as { url?: string } | undefined)?.url;
              if (uploadedUrl) {
                onChange?.(uploadedUrl);
                message.success(`${info.file.name} uploaded`);
              } else {
                message.error("Upload succeeded but URL missing");
              }
              setUploading(false);
              return;
            }
            if (info.file.status === "error") {
              message.error("Upload failed");
              setUploading(false);
            }
          }}
        >
          <Button size="small" block icon={<UploadOutlined />} loading={uploading} className="text-xs">
            Upload
          </Button>
        </Upload>
      </div>
    </div>
  );
}
