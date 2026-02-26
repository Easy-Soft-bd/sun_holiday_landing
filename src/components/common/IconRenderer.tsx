"use client";

import React from "react";
import * as FaIcons from "react-icons/fa";
import * as LuIcons from "react-icons/lu";
import * as MdIcons from "react-icons/md";
import * as HiIcons from "react-icons/hi";
import * as SiIcons from "react-icons/si";
import * as TbIcons from "react-icons/tb";
import * as RiIcons from "react-icons/ri";
import * as PiIcons from "react-icons/pi";
import * as BsIcons from "react-icons/bs";
import * as BiIcons from "react-icons/bi";
import * as AiIcons from "react-icons/ai";
import * as Io5Icons from "react-icons/io5";
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

interface IconRendererProps {
  iconName: string;
  className?: string;
  size?: number | string;
  color?: string;
}

const IconRenderer: React.FC<IconRendererProps> = ({
  iconName,
  className,
  size,
  color,
}) => {
  if (!iconName) return null;

  let IconComponent: any = null;

  // Try to find the icon in various icon sets
  if (iconName.startsWith("Fa")) {
    IconComponent = (Fa6Icons as any)[iconName] || (FaIcons as any)[iconName];
  } else if (iconName.startsWith("Lu")) {
    IconComponent = (LuIcons as any)[iconName];
  } else if (iconName.startsWith("Md")) {
    IconComponent = (MdIcons as any)[iconName];
  } else if (iconName.startsWith("Hi2")) {
    IconComponent = (Hi2Icons as any)[iconName];
  } else if (iconName.startsWith("Hi")) {
    IconComponent = (Hi2Icons as any)[iconName] || (HiIcons as any)[iconName];
  } else if (iconName.startsWith("Si")) {
    IconComponent = (SiIcons as any)[iconName];
  } else if (iconName.startsWith("Tb")) {
    IconComponent = (TbIcons as any)[iconName];
  } else if (iconName.startsWith("Ri")) {
    IconComponent = (RiIcons as any)[iconName];
  } else if (iconName.startsWith("Pi")) {
    IconComponent = (PiIcons as any)[iconName];
  } else if (iconName.startsWith("Bs")) {
    IconComponent = (BsIcons as any)[iconName];
  } else if (iconName.startsWith("Bi")) {
    IconComponent = (BiIcons as any)[iconName];
  } else if (iconName.startsWith("Ai")) {
    IconComponent = (AiIcons as any)[iconName];
  } else if (iconName.startsWith("Io")) {
    IconComponent = (Io5Icons as any)[iconName] || (IoIconsV4 as any)[iconName];
  } else if (iconName.startsWith("Fi")) {
    IconComponent = (FiIcons as any)[iconName];
  } else if (iconName.startsWith("Go")) {
    IconComponent = (GoIcons as any)[iconName];
  } else if (iconName.startsWith("Gi")) {
    IconComponent = (GiIcons as any)[iconName];
  } else if (iconName.startsWith("Wi")) {
    IconComponent = (WiIcons as any)[iconName];
  } else if (iconName.startsWith("Di")) {
    IconComponent = (DiIcons as any)[iconName];
  } else if (iconName.startsWith("Fc")) {
    IconComponent = (FcIcons as any)[iconName];
  } else if (iconName.startsWith("Ti")) {
    IconComponent = (TiIcons as any)[iconName];
  } else if (iconName.startsWith("Cg")) {
    IconComponent = (CgIcons as any)[iconName];
  } else if (iconName.startsWith("Ci")) {
    IconComponent = (CiIcons as any)[iconName];
  } else if (iconName.startsWith("Fa6")) {
    IconComponent = (Fa6Icons as any)[iconName];
  } else if (iconName.startsWith("Gr")) {
    IconComponent = (GrIcons as any)[iconName];
  } else if (iconName.startsWith("Im")) {
    IconComponent = (ImIcons as any)[iconName];
  } else if (iconName.startsWith("Lia")) {
    IconComponent = (LiaIcons as any)[iconName];
  } else if (iconName.startsWith("Rx")) {
    IconComponent = (RxIcons as any)[iconName];
  } else if (iconName.startsWith("Sl")) {
    IconComponent = (SlIcons as any)[iconName];
  } else if (iconName.startsWith("Tfi")) {
    IconComponent = (TfiIcons as any)[iconName];
  } else if (iconName.startsWith("Vsc")) {
    IconComponent = (VscIcons as any)[iconName];
  } else {
    // Fallback search in all sets
    IconComponent = 
      (LuIcons as any)[iconName] || 
      (FaIcons as any)[iconName] || 
      (MdIcons as any)[iconName] || 
      (HiIcons as any)[iconName] ||
      (SiIcons as any)[iconName] ||
      (TbIcons as any)[iconName] ||
      (RiIcons as any)[iconName] ||
      (PiIcons as any)[iconName] ||
      (BsIcons as any)[iconName] ||
      (BiIcons as any)[iconName] ||
      (AiIcons as any)[iconName] ||
      (Io5Icons as any)[iconName] ||
      (IoIconsV4 as any)[iconName] ||
      (FiIcons as any)[iconName] ||
      (GoIcons as any)[iconName] ||
      (GiIcons as any)[iconName] ||
      (WiIcons as any)[iconName] ||
      (DiIcons as any)[iconName] ||
      (FcIcons as any)[iconName] ||
      (TiIcons as any)[iconName] ||
      (Hi2Icons as any)[iconName] ||
      (CgIcons as any)[iconName] ||
      (CiIcons as any)[iconName] ||
      (Fa6Icons as any)[iconName] ||
      (GrIcons as any)[iconName] ||
      (ImIcons as any)[iconName] ||
      (LiaIcons as any)[iconName] ||
      (RxIcons as any)[iconName] ||
      (SlIcons as any)[iconName] ||
      (TfiIcons as any)[iconName] ||
      (VscIcons as any)[iconName];
  }

  // Handle common missing/renamed icons as aliases
  if (!IconComponent) {
    const term = iconName.toLowerCase();
    const aliases: Record<string, any> = {
      "lupalmtree": LuIcons.LuTreePalm,
      "sitwitter": LuIcons.LuTwitter || FaIcons.FaTwitter,
      "simicrosoft": FaIcons.FaMicrosoft || BsIcons.BsMicrosoft,
      "siwhatsapp": SiIcons.SiWhatsapp,
      "fatwitter": LuIcons.LuTwitter || FaIcons.FaTwitter,
      "faxtwitter": SiIcons.SiX,
      "palmtree": LuIcons.LuTreePalm,
      "twitter": LuIcons.LuTwitter || FaIcons.FaTwitter,
      "microsoft": FaIcons.FaMicrosoft,
      "facebook": SiIcons.SiFacebook,
      "instagram": SiIcons.SiInstagram,
      "linkedin": SiIcons.SiLinkedin,
      "whatsapp": SiIcons.SiWhatsapp,
      "x": SiIcons.SiX,
      "tree": LuIcons.LuTrees || LuIcons.LuTreePalm,
      "tree-palm": LuIcons.LuTreePalm
    };
    IconComponent = aliases[term];
  }

  if (!IconComponent) {
    // Return a default icon or null if not found
    return null;
  }

  return <IconComponent className={className} size={size} color={color} />;
};

export default IconRenderer;
