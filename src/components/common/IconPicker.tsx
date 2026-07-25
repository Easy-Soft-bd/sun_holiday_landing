"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Input, Popover, Button, Row, Col, Empty, Typography, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import IconRenderer from "./IconRenderer";
import { useCustomIcons } from "./use-custom-icons";
import { useIconNames } from "./use-icon-names";
import { prefetchIconTrees } from "./use-icon-trees";
import { isCustomIconName } from "@/src/lib/icons/custom-icon-ref";

const { Text } = Typography;

interface IconPickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

/** Shown before a search narrows things down, so the grid opens on something useful. */
const COMMON_LUCIDE_ICONS = [
  "LuSun", "LuWaves", "LuTreePalm", "LuSparkles", "LuMoon", "LuMoonStar", "LuNavigation",
  "LuHotel", "LuMapPin", "LuCoffee", "LuWifi", "LuWind", "LuUtensils", "LuCar",
  "LuBaggageClaim", "LuTv", "LuBath", "LuBed", "LuCloud", "LuHeart", "LuCamera",
  "LuUmbrella", "LuPlane", "LuShip", "LuTrees", "LuFlower", "LuBird", "LuMusic",
  "LuSearch", "LuFileText", "LuPointer", "LuCircleCheck", "LuAward", "LuStar", "LuBadgePercent",
];

const SOCIAL_ICONS = [
  "SiFacebook", "SiInstagram", "LuTwitter", "SiLinkedin", "SiYoutube", "SiWhatsapp",
  "SiMessenger", "SiTelegram", "SiTiktok", "SiSnapchat", "SiPinterest", "SiReddit",
  "SiGoogle", "SiApple", "FaMicrosoft", "SiAmazon", "SiX",
];

const TRAVEL_BRAND_ICONS = ["SiTripadvisor", "SiAirbnb", "SiTripdotcom", "SiExpedia"];

const COMMON_UI_ICONS = [
  "MdOutlineSettings", "MdOutlineNotifications", "MdOutlinePerson", "MdOutlineEmail",
  "MdOutlinePhone", "MdOutlineHome", "MdOutlineExplore", "MdOutlineFavorite",
  "HiOutlineChatBubbleLeft", "HiOutlineMagnifyingGlass", "HiOutlineCurrencyDollar",
  "HiOutlineCalendarDays", "BsWhatsapp", "BsTelephone", "BsEnvelope", "BiBuildings",
  "LuTicket", "LuMap", "LuBriefcase", "LuGlobe", "LuCompass",
];

const ALL_DEFAULT_ICONS = [
  ...SOCIAL_ICONS,
  ...COMMON_LUCIDE_ICONS,
  ...TRAVEL_BRAND_ICONS,
  ...COMMON_UI_ICONS,
];

/** Caps how many previews are requested and drawn for one search. */
const MAX_RESULTS = 200;

const ICON_PREFIX_PATTERN =
  /^(Lu|Fa6|Fa|Md|Hi2|Hi|Si|Tb|Ri|Pi|Bs|Bi|Ai|Io|Fi|Go|Gi|Wi|Di|Fc|Ti|Cg|Ci|Gr|Im|Lia|Rx|Sl|Tfi|Vsc)/;

const GRID_BUTTON_STYLE: React.CSSProperties = {
  width: "100%",
  height: 50,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: 4,
};

const GRID_LABEL_STYLE: React.CSSProperties = {
  fontSize: 8,
  marginTop: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
  width: "100%",
  whiteSpace: "nowrap",
};

const SECTION_LABEL_STYLE: React.CSSProperties = {
  fontSize: 10,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  margin: "4px 0 6px",
  display: "block",
};

function stripIconPrefix(name: string) {
  return name.replace(ICON_PREFIX_PATTERN, "");
}

function matchesIconSearch(name: string, term: string) {
  const lowerName = name.toLowerCase();
  const withoutPrefix = stripIconPrefix(name).toLowerCase();

  return {
    startsWith: lowerName.startsWith(term) || withoutPrefix.startsWith(term),
    contains: lowerName.includes(term) || withoutPrefix.includes(term),
  };
}

function filterIconNames(names: readonly string[], term: string) {
  const seen = new Set<string>();
  const pushUnique = (target: string[], name: string) => {
    if (seen.has(name)) {
      return;
    }

    seen.add(name);
    target.push(name);
  };

  if (!term) {
    const unique: string[] = [];

    for (const name of names) {
      pushUnique(unique, name);
    }

    return unique;
  }

  const startsWith: string[] = [];
  const contains: string[] = [];

  for (const name of names) {
    const match = matchesIconSearch(name, term);

    if (match.startsWith) {
      pushUnique(startsWith, name);
    } else if (match.contains && contains.length < MAX_RESULTS) {
      pushUnique(contains, name);
    }

    if (startsWith.length >= MAX_RESULTS) {
      break;
    }
  }

  return [...startsWith, ...contains].slice(0, MAX_RESULTS);
}

interface IconPickerPanelProps {
  value?: string;
  onSelect: (iconName: string) => void;
  enabled: boolean;
}

/**
 * Owns search state so keystrokes do not remount through the Popover `content`
 * prop, and so the input keeps focus inside Ant Design Modals.
 */
function IconPickerPanel({ value, onSelect, enabled }: IconPickerPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = React.useDeferredValue(searchTerm);
  const customIcons = useCustomIcons();
  const allIconNames = useIconNames(enabled);

  const matchingCustomIcons = useMemo(() => {
    const term = deferredSearchTerm.trim().toLowerCase();

    if (!term) {
      return customIcons;
    }

    return customIcons.filter(
      (icon) =>
        icon.label.toLowerCase().includes(term) || icon.name.toLowerCase().includes(term),
    );
  }, [customIcons, deferredSearchTerm]);

  const filteredIcons = useMemo(() => {
    const term = deferredSearchTerm.trim().toLowerCase();

    if (!term) {
      return ALL_DEFAULT_ICONS;
    }

    // Prefer the full manifest once loaded; fall back to curated defaults so
    // typing still filters something useful while the ~50k list is in flight.
    const source = allIconNames.length > 0 ? allIconNames : ALL_DEFAULT_ICONS;
    return filterIconNames(source, term);
  }, [deferredSearchTerm, allIconNames]);

  useEffect(() => {
    prefetchIconTrees(filteredIcons);
  }, [filteredIcons]);

  const isSearching = Boolean(deferredSearchTerm.trim());
  const isManifestPending = isSearching && allIconNames.length === 0;

  return (
    <div
      style={{ width: 320 }}
      onMouseDown={(event) => {
        // Keep focus inside the panel when used within Modal focus traps.
        event.stopPropagation();
      }}
      onKeyDown={(event) => {
        event.stopPropagation();
      }}
    >
      <Input
        prefix={<SearchOutlined />}
        placeholder="Search icons..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
        onKeyDown={(event) => {
          event.stopPropagation();
        }}
        autoFocus
        allowClear
        style={{ marginBottom: 12 }}
      />
      <div style={{ maxHeight: 300, overflowY: "auto", padding: 4 }}>
        {matchingCustomIcons.length > 0 && (
          <>
            <Text type="secondary" style={SECTION_LABEL_STYLE}>
              Your icons
            </Text>
            <Row gutter={[8, 8]} style={{ marginBottom: 12 }}>
              {matchingCustomIcons.map((icon) => (
                <Col span={6} key={icon.iconName}>
                  <Button
                    type={value === icon.iconName ? "primary" : "default"}
                    onClick={() => onSelect(icon.iconName)}
                    style={GRID_BUTTON_STYLE}
                    title={`${icon.label} (${icon.iconName})`}
                  >
                    <IconRenderer iconName={icon.iconName} size={20} />
                    <div style={GRID_LABEL_STYLE}>{icon.label}</div>
                  </Button>
                </Col>
              ))}
            </Row>
          </>
        )}

        {isManifestPending && filteredIcons.length === 0 ? (
          <div style={{ padding: "24px 0", textAlign: "center" }}>
            <Spin size="small" />
          </div>
        ) : filteredIcons.length > 0 ? (
          <>
            {matchingCustomIcons.length > 0 && (
              <Text type="secondary" style={SECTION_LABEL_STYLE}>
                Icon library
              </Text>
            )}
            {isManifestPending ? (
              <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 8 }}>
                Loading full icon list…
              </Text>
            ) : null}
            <Row gutter={[8, 8]}>
              {filteredIcons.map((iconName) => (
                <Col span={6} key={iconName}>
                  <Button
                    type={value === iconName ? "primary" : "default"}
                    onClick={() => onSelect(iconName)}
                    style={GRID_BUTTON_STYLE}
                    title={iconName}
                  >
                    <IconRenderer iconName={iconName} size={20} />
                    <div style={GRID_LABEL_STYLE}>{stripIconPrefix(iconName)}</div>
                  </Button>
                </Col>
              ))}
            </Row>
          </>
        ) : (
          matchingCustomIcons.length === 0 && <Empty description="No icons found" />
        )}
      </div>
      <div style={{ marginTop: 8, textAlign: "right" }}>
        <Text type="secondary" style={{ fontSize: 11 }}>
          Powered by React Icons
        </Text>
      </div>
    </div>
  );
}

const IconPicker: React.FC<IconPickerProps> = ({ value, onChange, placeholder = "Select Icon" }) => {
  const [visible, setVisible] = useState(false);
  const customIcons = useCustomIcons();
  const selectedCustomIcon = customIcons.find((icon) => icon.iconName === value);

  const handleSelect = (iconName: string) => {
    onChange?.(iconName);
    setVisible(false);
  };

  return (
    <Popover
      content={
        visible ? (
          <IconPickerPanel value={value} onSelect={handleSelect} enabled={visible} />
        ) : null
      }
      title="Select an Icon"
      trigger="click"
      open={visible}
      onOpenChange={setVisible}
      placement="bottomLeft"
      // Keep the popup inside modal/dialog DOM so the search input can receive
      // keystrokes (body portals get blocked by Ant Design focus traps).
      getPopupContainer={(trigger) =>
        (trigger.closest(".ant-modal-content") as HTMLElement | null) ??
        (trigger.closest(".ant-drawer-body") as HTMLElement | null) ??
        trigger.parentElement ??
        document.body
      }
      destroyOnHidden
      styles={{ container: { zIndex: 1100 } }}
    >
      <Button
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {value ? <IconRenderer iconName={value} size={18} /> : null}
          <span>
            {selectedCustomIcon?.label ??
              (value
                ? isCustomIconName(value)
                  ? value
                  : stripIconPrefix(value)
                : placeholder)}
          </span>
        </div>
        <SearchOutlined />
      </Button>
    </Popover>
  );
};

export default IconPicker;
