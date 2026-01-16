import { AntdRegistry } from '@ant-design/nextjs-registry';

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AntdRegistry>
      <div className="min-h-screen bg-base-200">
        {children}
      </div>
    </AntdRegistry>
  );
}
