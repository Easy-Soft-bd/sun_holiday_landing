import { resolveIconTree } from "@/src/lib/icons/icon-registry";
import { isCustomIconName } from "@/src/lib/icons/custom-icon-ref";
import { getCachedCustomIcon } from "@/src/lib/data/custom-icons";
import CustomIconSvg from "./CustomIconSvg";
import IconTreeSvg from "./IconTreeSvg";

interface PublicIconRendererProps {
  iconName?: string | null;
  className?: string;
  size?: number | string;
  color?: string;
}

/**
 * Renders CMS-selected icons on public pages. Resolving on the server keeps the
 * full React Icons catalogue available without shipping any of it to the browser,
 * and lets `custom:` references read straight from the icon library.
 */
export default async function PublicIconRenderer({
  iconName,
  className,
  size,
  color,
}: PublicIconRendererProps) {
  if (isCustomIconName(iconName)) {
    const custom = await getCachedCustomIcon(iconName);

    if (custom) {
      return (
        <CustomIconSvg
          icon={custom.icon}
          className={className}
          size={size}
          color={color}
        />
      );
    }
  }

  const tree = await resolveIconTree(iconName);

  if (!tree) {
    return null;
  }

  return <IconTreeSvg tree={tree} className={className} size={size} color={color} />;
}
