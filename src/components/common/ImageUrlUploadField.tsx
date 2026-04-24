"use client";

import { useState } from "react";
import { Button, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  uploadType?: string;
  previewHeightClassName?: string;
};

export default function ImageUrlUploadField({
  value,
  onChange,
  placeholder = "https://...",
  uploadType = "content",
  previewHeightClassName = "h-28",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const src = typeof value === "string" ? value.trim() : "";

  return (
    <div className="space-y-2">
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
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
              message.success(`${info.file.name} uploaded successfully`);
            } else {
              message.error("Image upload succeeded but URL is missing");
            }
            setUploading(false);
            return;
          }

          if (info.file.status === "error") {
            message.error(`${info.file.name} upload failed`);
            setUploading(false);
          }
        }}
      >
        <Button icon={<UploadOutlined />} loading={uploading}>
          Upload Image
        </Button>
      </Upload>

      {src ? (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <img
            src={src}
            alt="Preview"
            className={`${previewHeightClassName} w-full object-contain bg-slate-100`}
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
          <div className="break-all border-t border-slate-200 px-3 py-2 text-[11px] text-slate-500">
            {src}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 text-xs text-slate-500">
          Add an image URL or upload to preview
        </div>
      )}
    </div>
  );
}
