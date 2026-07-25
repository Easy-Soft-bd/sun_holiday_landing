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
  width: '100%',
  height: 50,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 4,
};

const GRID_LABEL_STYLE: React.CSSProperties = {
  fontSize: 8,
  marginTop: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: '100%',
  whiteSpace: 'nowrap',
};

const SECTION_LABEL_STYLE: React.CSSProperties = {
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  margin: '4px 0 6px',
  display: 'block',
};

const IconPicker: React.FC<IconPickerProps> = ({ value, onChange, placeholder = "Select Icon" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [visible, setVisible] = useState(false);
  const deferredSearchTerm = React.useDeferredValue(searchTerm);
  const customIcons = useCustomIcons();
  const allIconNames = useIconNames(visible);

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

  const selectedCustomIcon = customIcons.find((icon) => icon.iconName === value);

  const filteredIcons = useMemo(() => {
    const term = deferredSearchTerm.trim().toLowerCase();

    if (!term) {
      return ALL_DEFAULT_ICONS;
    }

    // Names starting with the term are the likelier intent, so they lead; the
    // loop stops early once there are plainly enough of them to fill the grid.
    const startsWith: string[] = [];
    const contains: string[] = [];

    for (const name of allIconNames) {
      const lowerName = name.toLowerCase();

      if (
        lowerName.startsWith(term) ||
        name.replace(ICON_PREFIX_PATTERN, "").toLowerCase().startsWith(term)
      ) {
        startsWith.push(name);

        if (startsWith.length >= MAX_RESULTS) {
          break;
        }
      } else if (contains.length < MAX_RESULTS && lowerName.includes(term)) {
        contains.push(name);
      }
    }

    return [...startsWith, ...contains].slice(0, MAX_RESULTS);
  }, [deferredSearchTerm, allIconNames]);

  // One batched request per set of results rather than one per rendered icon.
  useEffect(() => {
    prefetchIconTrees(filteredIcons);
  }, [filteredIcons]);

  const handleSelect = (iconName: string) => {
    onChange?.(iconName);
    setVisible(false);
  };

  const isSearching = Boolean(deferredSearchTerm.trim());
  const isManifestPending = isSearching && allIconNames.length === 0;

  const content = (
    <div style={{ width: 320 }}>
      <Input
        prefix={<SearchOutlined />}
        placeholder="Search icons..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 12 }}
        allowClear
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
                    onClick={() => handleSelect(icon.iconName)}
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

        {isManifestPending ? (
          <div style={{ padding: '24px 0', textAlign: 'center' }}>
            <Spin size="small" />
          </div>
        ) : filteredIcons.length > 0 ? (
          <>
            {matchingCustomIcons.length > 0 && (
              <Text type="secondary" style={SECTION_LABEL_STYLE}>
                Icon library
              </Text>
            )}
            <Row gutter={[8, 8]}>
              {filteredIcons.map((iconName) => (
                <Col span={6} key={iconName}>
                  <Button
                    type={value === iconName ? "primary" : "default"}
                    onClick={() => handleSelect(iconName)}
                    style={GRID_BUTTON_STYLE}
                    title={iconName}
                  >
                    <IconRenderer iconName={iconName} size={20} />
                    <div style={GRID_LABEL_STYLE}>
                      {iconName.replace(ICON_PREFIX_PATTERN, '')}
                    </div>
                  </Button>
                </Col>
              ))}
            </Row>
          </>
        ) : (
          matchingCustomIcons.length === 0 && <Empty description="No icons found" />
        )}
      </div>
      <div style={{ marginTop: 8, textAlign: 'right' }}>
        <Text type="secondary" style={{ fontSize: 11 }}>
          Powered by React Icons
        </Text>
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      title="Select an Icon"
      trigger="click"
      open={visible}
      onOpenChange={setVisible}
      placement="bottomLeft"
    >
      <Button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {value ? <IconRenderer iconName={value} size={18} /> : null}
          <span>
            {selectedCustomIcon?.label ??
              (value
                ? isCustomIconName(value)
                  ? value
                  : value.replace(ICON_PREFIX_PATTERN, '')
                : placeholder)}
          </span>
        </div>
        <SearchOutlined />
      </Button>
    </Popover>
  );
};

export default IconPicker;
