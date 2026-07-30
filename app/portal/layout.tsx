import AntdProviders from "@/src/components/providers/AntdProviders";
import StoreProvider from "@/src/lib/redux/StoreProvider";

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AntdProviders>
      <StoreProvider>
        <div className="min-h-screen bg-base-200">{children}</div>
      </StoreProvider>
    </AntdProviders>
  );
}
