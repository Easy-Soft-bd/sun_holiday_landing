"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, ConfigProvider } from "antd";
import { theme } from "@/theme/antdTheme";

export default function AntdProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AntdRegistry>
      <ConfigProvider theme={theme}>
        {/* App provides context for static message/notification/modal APIs */}
        <App>{children}</App>
      </ConfigProvider>
    </AntdRegistry>
  );
}
