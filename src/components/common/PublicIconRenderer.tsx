"use client";

import type { LucideIcon } from 'lucide-react';
import {
  Award,
  BadgePercent,
  Building2,
  CheckCircle,
  Coffee,
  Dumbbell,
  Facebook,
  FileText,
  Hotel,
  Instagram,
  Linkedin,
  Map,
  Mountain,
  Plane,
  Pointer,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  TreePalm,
  Twitter,
  Umbrella,
  Users,
  Utensils,
  Waves,
} from 'lucide-react';

interface PublicIconRendererProps {
  iconName: string;
  className?: string;
  size?: number | string;
  color?: string;
}

const iconMap: Record<string, LucideIcon> = {
  LuAward: Award,
  LuBadgePercent: BadgePercent,
  LuBuilding2: Building2,
  LuCheckCircle: CheckCircle,
  LuCoffee: Coffee,
  LuDumbbell: Dumbbell,
  LuFacebook: Facebook,
  LuFileText: FileText,
  LuHotel: Hotel,
  LuInstagram: Instagram,
  LuLinkedin: Linkedin,
  LuMap: Map,
  LuMountain: Mountain,
  LuPalmtree: TreePalm,
  LuPlane: Plane,
  LuPointer: Pointer,
  LuSearch: Search,
  LuShieldCheck: ShieldCheck,
  LuSparkles: Sparkles,
  LuStar: Star,
  LuSun: Sun,
  LuTreePalm: TreePalm,
  LuTwitter: Twitter,
  LuUmbrella: Umbrella,
  LuUsers: Users,
  LuUtensils: Utensils,
  LuWaves: Waves,
  SiFacebook: Facebook,
  SiInstagram: Instagram,
  SiLinkedin: Linkedin,
  SiTwitter: Twitter,
  SiX: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
};

export default function PublicIconRenderer({
  iconName,
  className,
  size,
  color,
}: PublicIconRendererProps) {
  const Icon = iconMap[iconName] || iconMap[iconName?.trim()] || Sparkles;

  return <Icon className={className} size={size} color={color} />;
}
