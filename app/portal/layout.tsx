import { AntdRegistry } from '@ant-design/nextjs-registry';
import StoreProvider from '@/src/lib/redux/StoreProvider';

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AntdRegistry>
      <StoreProvider>
        <div className="min-h-screen bg-base-200">
          {children}
        </div>
      </StoreProvider>
    </AntdRegistry>
  );
}
