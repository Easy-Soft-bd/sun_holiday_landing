"use client";

import React, { useState, useMemo } from "react";
import { Input, Popover, Button, Row, Col, Space, Empty, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import * as LuIcons from "react-icons/lu";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import * as TbIcons from "react-icons/tb";
import * as RiIcons from "react-icons/ri";
import * as PiIcons from "react-icons/pi";
import * as MdIcons from "react-icons/md";
import * as HiIcons from "react-icons/hi";
import * as BsIcons from "react-icons/bs";
import * as BiIcons from "react-icons/bi";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io5";
import * as FiIcons from "react-icons/fi";
import * as GoIcons from "react-icons/go";
import * as GiIcons from "react-icons/gi";
import * as WiIcons from "react-icons/wi";
import * as DiIcons from "react-icons/di";
import * as FcIcons from "react-icons/fc";
import * as TiIcons from "react-icons/ti";
import * as Hi2Icons from "react-icons/hi2";
import * as CgIcons from "react-icons/cg";
import * as CiIcons from "react-icons/ci";
import * as Fa6Icons from "react-icons/fa6";
import * as GrIcons from "react-icons/gr";
import * as ImIcons from "react-icons/im";
import * as LiaIcons from "react-icons/lia";
import * as RxIcons from "react-icons/rx";
import * as SlIcons from "react-icons/sl";
import * as TfiIcons from "react-icons/tfi";
import * as VscIcons from "react-icons/vsc";
import * as IoIconsV4 from "react-icons/io";
import IconRenderer from "./IconRenderer";

const { Text } = Typography;

interface IconPickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

// Extract a subset of common icons to show by default to avoid overwhelming the UI
// Basic categories for the picker
const COMMON_LUCIDE_ICONS = [
  "LuSun", "LuWaves", "LuTreePalm", "LuSparkles", "LuMoon", "LuStars", "LuNavigation", 
  "LuHotel", "LuMapPin", "LuCoffee", "LuWifi", "LuWind", "LuUtensils", "LuCar", 
  "LuBaggageClaim", "LuTv", "LuBath", "LuBed", "LuCloud", "LuHeart", "LuCamera",
  "LuUmbrella", "LuPlane", "LuShip", "LuTree", "LuFlower", "LuBird", "LuMusic",
  "LuSearch", "LuFileText", "LuPointer", "LuCheckCircle", "LuAward", "LuStar", "LuBadgePercent"
];

const SOCIAL_ICONS = [
  "SiFacebook", "SiInstagram", "LuTwitter", "SiLinkedin", "SiYoutube", "SiWhatsapp", 
  "SiMessenger", "SiTelegram", "SiTiktok", "SiSnapchat", "SiPinterest", "SiReddit",
  "SiGoogle", "SiApple", "FaMicrosoft", "SiAmazon", "SiX"
];

const TRAVEL_BRAND_ICONS = [
  "SiTripadvisor", "SiAirbnb", "SiBookingdotcom", "SiExpedia", "SiSkyscanner"
];

const COMMON_UI_ICONS = [
  "MdOutlineSettings", "MdOutlineNotifications", "MdOutlinePerson", "MdOutlineEmail",
  "MdOutlinePhone", "MdOutlineHome", "MdOutlineExplore", "MdOutlineFavorite",
  "HiOutlineChatBubbleLeft", "HiOutlineMagnifyingGlass", "HiOutlineCurrencyDollar",
  "HiOutlineCalendarDays", "BsWhatsapp", "BsTelephone", "BsEnvelope", "BiBuildings",
  "LuTicket", "LuMap", "LuSuitcase", "LuGlobe", "LuCompass"
];

const ALL_DEFAULT_ICONS = [...SOCIAL_ICONS, ...COMMON_LUCIDE_ICONS, ...TRAVEL_BRAND_ICONS, ...COMMON_UI_ICONS];

// Optimization: Pre-calculate the full list of icons once to avoid expensive Object.keys calls during search
const ALL_ICON_NAMES = [
  ...Object.keys(LuIcons),
  ...Object.keys(FaIcons),
  ...Object.keys(MdIcons),
  ...Object.keys(HiIcons),
  ...Object.keys(SiIcons),
  ...Object.keys(TbIcons),
  ...Object.keys(RiIcons),
  ...Object.keys(PiIcons),
  ...Object.keys(BsIcons),
  ...Object.keys(BiIcons),
  ...Object.keys(AiIcons),
  ...Object.keys(IoIcons),
  ...Object.keys(FiIcons),
  ...Object.keys(GoIcons),
  ...Object.keys(GiIcons),
  ...Object.keys(WiIcons),
  ...Object.keys(DiIcons),
  ...Object.keys(FcIcons),
  ...Object.keys(TiIcons),
  ...Object.keys(Hi2Icons),
  ...Object.keys(CgIcons),
  ...Object.keys(CiIcons),
  ...Object.keys(Fa6Icons),
  ...Object.keys(GrIcons),
  ...Object.keys(ImIcons),
  ...Object.keys(LiaIcons),
  ...Object.keys(RxIcons),
  ...Object.keys(SlIcons),
  ...Object.keys(TfiIcons),
  ...Object.keys(VscIcons),
  ...Object.keys(IoIconsV4)
].filter(name => !name.startsWith('Icon') && name !== 'default'); // Filter out internal types

const IconPicker: React.FC<IconPickerProps> = ({ value, onChange, placeholder = "Select Icon" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [visible, setVisible] = useState(false);
  const deferredSearchTerm = React.useDeferredValue(searchTerm);

  const filteredIcons = useMemo(() => {
    if (!deferredSearchTerm) return ALL_DEFAULT_ICONS;

    const term = deferredSearchTerm.toLowerCase();
    
    // Improved search: Prioritize starts-with matches, then contains matches
    let startsWithMatches: string[] = [];
    let containsMatches: string[] = [];
    
    for (let i = 0; i < ALL_ICON_NAMES.length; i++) {
        const name = ALL_ICON_NAMES[i];
        const lowerName = name.toLowerCase();
        
        // Remove prefixes for a more "intuitive" search match check if needed,
        // but generally searching against the full name is safer.
        // We prioritize matches that start with the term or the term after prefix
        const nameWithoutPrefix = name.replace(/^(Lu|Fa|Md|Hi2|Hi|Si|Tb|Ri|Pi|Bs|Bi|Ai|Io|Fi|Go|Gi|Wi|Di|Fc|Ti|Cg|Ci|Gr|Im|Lia|Rx|Sl|Tfi|Vsc|Fa6)/, '');
        
        if (lowerName.startsWith(term) || nameWithoutPrefix.toLowerCase().startsWith(term)) {
            startsWithMatches.push(name);
        } else if (lowerName.includes(term)) {
            containsMatches.push(name);
        }
        
        if (startsWithMatches.length >= 400) break;
    }

    return [...startsWithMatches, ...containsMatches].slice(0, 400);
  }, [deferredSearchTerm]);

  const handleSelect = (iconName: string) => {
    onChange?.(iconName);
    setVisible(false);
  };

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
        {filteredIcons.length > 0 ? (
          <Row gutter={[8, 8]}>
            {filteredIcons.map((iconName) => (
              <Col span={6} key={iconName}>
                <Button
                  type={value === iconName ? "primary" : "default"}
                  onClick={() => handleSelect(iconName)}
                  style={{ 
                    width: '100%', 
                    height: 50, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    padding: 4
                  }}
                  title={iconName}
                >
                  <IconRenderer iconName={iconName} size={20} />
                  <div style={{ fontSize: 8, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', whiteSpace: 'nowrap' }}>
                    {iconName.replace(/^(Lu|Fa|Md|Hi2|Hi|Si|Tb|Ri|Pi|Bs|Bi|Ai|Io|Fi|Go|Gi|Wi|Di|Fc|Ti|Cg|Ci|Gr|Im|Lia|Rx|Sl|Tfi|Vsc|Fa6)/, '')}
                  </div>
                </Button>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="No icons found" />
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
          <span>{value ? value.replace(/^(Lu|Fa|Md|Hi2|Hi|Si|Tb|Ri|Pi|Bs|Bi|Ai|Io|Fi|Go|Gi|Wi|Di|Fc|Ti|Cg|Ci|Gr|Im|Lia|Rx|Sl|Tfi|Vsc|Fa6)/, '') : placeholder}</span>
        </div>
        <SearchOutlined />
      </Button>
    </Popover>
  );
};

export default IconPicker;
