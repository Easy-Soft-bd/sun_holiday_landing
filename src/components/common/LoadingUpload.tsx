"use client";

import { cloneElement, isValidElement, useRef, useState, type ReactElement, type ReactNode } from "react";
import { Button, Upload } from "antd";
import type { UploadProps } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

type ButtonProps = { loading?: boolean };

type Props = UploadProps & {
  children: ReactNode;
};

/** Upload control that shows a spinner on its button until the file request finishes. */
export default function LoadingUpload({ children, onChange, beforeUpload, ...rest }: Props) {
  const [uploading, setUploading] = useState(false);
  const active = useRef(new Set<string>());

  const mark = (uid: string, busy: boolean) => {
    if (busy) active.current.add(uid);
    else active.current.delete(uid);
    setUploading(active.current.size > 0);
  };
  const child = isValidElement(children) ? (children as ReactElement<ButtonProps>) : null;
  const isButton = child?.type === Button;

  const content = isButton
    ? cloneElement(child, { loading: uploading || Boolean(child.props.loading) })
    : (
        <span className="relative inline-flex">
          {children}
          {uploading ? (
            <span className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/80">
              <LoadingOutlined spin />
            </span>
          ) : null}
        </span>
      );

  return (
    <Upload
      {...rest}
      beforeUpload={
        beforeUpload
          ? async (file, fileList) => {
              const uid = String(file.uid);
              mark(uid, true);
              try {
                const result = await beforeUpload(file, fileList);
                if (result === false || result === Upload.LIST_IGNORE) mark(uid, false);
                return result;
              } catch (error) {
                mark(uid, false);
                throw error;
              }
            }
          : undefined
      }
      onChange={(info) => {
        const uid = String(info.file.uid);
        const status = info.file.status;
        if (status === "uploading") mark(uid, true);
        if (status === "done" || status === "error" || status === "removed") mark(uid, false);
        onChange?.(info);
      }}
    >
      {content}
    </Upload>
  );
}
