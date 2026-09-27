import type { ThemeConfig } from "antd";

/**
 * Ant Design theme aligned with the public sunlight theme:
 * warm cream surfaces, brand red, and sun orange.
 */
export const theme: ThemeConfig = {
  token: {
    colorPrimary: "#c2410c",
    colorInfo: "#9a3412",
    colorLink: "#9a3412",
    colorLinkHover: "#c2410c",
    colorLinkActive: "#9a3412",
    colorSuccess: "#15803d",
    colorWarning: "#d97706",
    colorError: "#dc2626",
    colorText: "#2a2118",
    colorTextSecondary: "#6b5c4d",
    colorBgLayout: "#f6f1e7",
    colorBgContainer: "#fffdf8",
    colorBgElevated: "#fffdf8",
    colorBorder: "#eadfce",
    colorBorderSecondary: "#f3eadc",
    colorFillAlter: "#faf6ef",
    borderRadius: 12,
    borderRadiusLG: 16,
    fontFamily: "inherit",
    controlHeight: 40,
    boxShadow: "0 8px 24px rgba(42, 33, 24, 0.06)",
  },
  components: {
    Layout: {
      bodyBg: "#f6f1e7",
      headerBg: "rgba(255, 253, 248, 0.82)",
      siderBg: "#fffdf8",
      triggerBg: "#fffdf8",
    },
    Menu: {
      itemBg: "transparent",
      itemColor: "#3f342b",
      itemHoverBg: "#fff1e8",
      itemHoverColor: "#9a3412",
      itemSelectedBg: "#c2410c",
      itemSelectedColor: "#fffdf8",
      itemBorderRadius: 12,
      itemMarginInline: 12,
      iconSize: 16,
      activeBarBorderWidth: 0,
    },
    Button: {
      primaryShadow: "0 8px 18px rgba(194, 65, 12, 0.22)",
      defaultBorderColor: "#eadfce",
      defaultColor: "#3f342b",
    },
    Card: {
      colorBgContainer: "#fffdf8",
    },
    Input: {
      activeBorderColor: "#c2410c",
      hoverBorderColor: "#e07a3d",
    },
    Tabs: {
      inkBarColor: "#c2410c",
      itemSelectedColor: "#c2410c",
      itemHoverColor: "#9a3412",
    },
    Table: {
      headerBg: "#faf6ef",
      headerColor: "#6b5c4d",
      rowHoverBg: "#fff7f2",
    },
  },
};
