"use client";

import { FALLBACK_ICON_NAME, normalizeIconName } from "@/src/lib/icons/icon-aliases";
import { parseStoredCustomIcon } from "@/src/lib/icons/custom-icon-svg";
import CustomIconSvg from "./CustomIconSvg";
import IconTreeSvg from "./IconTreeSvg";
import { useCustomIcon } from "./use-custom-icons";
import { useIconTree } from "./use-icon-trees";

interface IconRendererProps {
  iconName?: string | null;
  className?: string;
  size?: number | string;
  color?: string;
}

/**
 * Renders a CMS icon name inside client components (the admin pickers and
 * editors). Library icons are fetched through `/api/icons` rather than imported,
 * because a runtime icon name forces a bundler to include every pack; public
 * pages resolve the same names on the server via `PublicIconRenderer`.
 */
export default function IconRenderer({ iconName, className, size, color }: IconRendererProps) {
  const custom = useCustomIcon(iconName);
  const customIcon = custom ? parseStoredCustomIcon(custom.content) : null;

  const name = normalizeIconName(iconName);
  const requested = customIcon ? "" : name || FALLBACK_ICON_NAME;
  const resolved = useIconTree(requested);

  // `null` is a definite miss rather than a pending request, so a name the
  // catalogue no longer has falls back instead of staying blank.
  const isMiss = resolved === null && requested !== "" && requested !== FALLBACK_ICON_NAME;
  const fallback = useIconTree(isMiss ? FALLBACK_ICON_NAME : "");
  const tree = resolved ?? fallback;

  if (customIcon) {
    return <CustomIconSvg icon={customIcon} className={className} size={size} color={color} />;
  }

  if (!tree) {
    // Holds the icon's footprint while it loads so grids and buttons do not reflow.
    return (
      <span
        aria-hidden
        style={{ display: "inline-block", width: size ?? "1em", height: size ?? "1em" }}
      />
    );
  }

  return <IconTreeSvg tree={tree} className={className} size={size} color={color} />;
}
