import type { ThemeConfig } from "antd";

/** Ant Design theme aligned with DaisyUI "sunlight" primary (brand red). */
export const theme: ThemeConfig = {
  token: {
    // Matches DaisyUI --color-primary oklch(40% 0.2 25) ≈ #8a0c1f (AA on cream)
    colorPrimary: "#8a0c1f",
    colorInfo: "#3b9eff",
    colorSuccess: "#22c55e",
    colorWarning: "#f59e0b",
    colorError: "#ef4444",
    borderRadius: 6,
  },
};
