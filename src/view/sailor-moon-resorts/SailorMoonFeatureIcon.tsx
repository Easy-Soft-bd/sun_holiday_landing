import PublicIconRenderer from "@/src/components/common/PublicIconRenderer";
import { normalizeSailorMoonFeatureIcon } from "@/src/lib/data/sailor-moon-resorts-page";

type Props = {
  icon: string;
  /** Pixel size; matches previous Lucide `size-8` (32px) */
  size?: number;
  className?: string;
};

export default function SailorMoonFeatureIcon({ icon, size = 32, className }: Props) {
  const iconName = normalizeSailorMoonFeatureIcon(icon);

  return (
    <span className={`inline-flex shrink-0 items-center justify-center text-primary ${className ?? ""}`}>
      <PublicIconRenderer iconName={iconName} size={size} className="text-primary" />
    </span>
  );
}
