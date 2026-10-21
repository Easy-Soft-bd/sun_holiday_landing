"use client";

import AppImage from "@/src/components/common/AppImage";

type VisaFlagProps = {
  flagImage?: string | null;
  flagEmoji?: string | null;
  className?: string;
};

export default function VisaFlag({ flagImage, flagEmoji, className }: VisaFlagProps) {
  if (flagImage) {
    return (
      <AppImage
        src={flagImage}
        alt=""
        width={40}
        height={28}
        sizes="40px"
        className={className ?? "h-7 w-10 rounded-sm object-cover"}
      />
    );
  }

  if (flagEmoji) {
    return (
      <span className={className ?? "text-2xl leading-none"} aria-hidden>
        {flagEmoji}
      </span>
    );
  }

  return null;
}
