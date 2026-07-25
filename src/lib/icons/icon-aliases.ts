/**
 * CMS content stores React Icons identifiers (see `IconPicker`). Two kinds of
 * stored values no longer resolve directly: names lucide renamed between
 * releases, and bare keywords written before the picker existed.
 */

export const FALLBACK_ICON_NAME = "LuSparkles";

/** Legacy React Icons name -> name shipped by the installed react-icons version. */
const RENAMED_ICONS: Record<string, string> = {
  LuAlertCircle: "LuCircleAlert",
  LuAlertOctagon: "LuOctagonAlert",
  LuAlertTriangle: "LuTriangleAlert",
  LuArrowDownCircle: "LuCircleArrowDown",
  LuArrowLeftCircle: "LuCircleArrowLeft",
  LuArrowRightCircle: "LuCircleArrowRight",
  LuArrowUpCircle: "LuCircleArrowUp",
  LuCheckCircle: "LuCircleCheck",
  LuCheckCircle2: "LuCircleCheckBig",
  LuChevronDownCircle: "LuCircleChevronDown",
  LuChevronUpCircle: "LuCircleChevronUp",
  LuEdit: "LuPencil",
  LuEdit2: "LuPencil",
  LuEdit3: "LuPencilLine",
  LuHelpCircle: "LuCircleHelp",
  LuLoader2: "LuLoaderCircle",
  LuMinusCircle: "LuCircleMinus",
  LuMoreHorizontal: "LuEllipsis",
  LuMoreVertical: "LuEllipsisVertical",
  LuPalmtree: "LuTreePalm",
  LuPauseCircle: "LuCirclePause",
  LuPlayCircle: "LuCirclePlay",
  LuPlusCircle: "LuCirclePlus",
  LuStars: "LuMoonStar",
  LuStopCircle: "LuCircleStop",
  LuSuitcase: "LuBriefcase",
  LuTree: "LuTrees",
  LuUserCircle: "LuCircleUser",
  LuXCircle: "LuCircleX",
  LuXOctagon: "LuOctagonX",
  LuXSquare: "LuSquareX",
  SiTwitter: "SiX",
};

/**
 * Brands react-icons never shipped (or dropped), mapped to the closest
 * available glyph so the UI stays meaningful instead of falling back.
 */
const REPLACED_BRAND_ICONS: Record<string, string> = {
  SiBookingdotcom: "LuBedDouble",
  SiSkyscanner: "LuPlane",
};

/** Lower-cased keys for content that stores plain words instead of icon names. */
const KEYWORD_ICONS: Record<string, string> = {
  bbq: "LuPartyPopper",
  beach: "LuWaves",
  dining: "LuUtensils",
  facebook: "SiFacebook",
  instagram: "SiInstagram",
  linkedin: "SiLinkedin",
  messenger: "SiMessenger",
  microsoft: "FaMicrosoft",
  palmtree: "LuTreePalm",
  pinterest: "SiPinterest",
  rest: "LuArmchair",
  telegram: "SiTelegram",
  tiktok: "SiTiktok",
  tree: "LuTrees",
  "tree-palm": "LuTreePalm",
  twitter: "SiX",
  whatsapp: "SiWhatsapp",
  x: "SiX",
  youtube: "SiYoutube",
};

/** Returns the canonical React Icons name, or an empty string when unset. */
export function normalizeIconName(rawName?: string | null): string {
  const name = (rawName ?? "").trim();

  if (!name) {
    return "";
  }

  return (
    RENAMED_ICONS[name] ??
    REPLACED_BRAND_ICONS[name] ??
    KEYWORD_ICONS[name.toLowerCase()] ??
    name
  );
}
