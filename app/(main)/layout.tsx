import Nav from "@/src/components/layouts/Nav";
import Footer from "@/src/components/layouts/Footer";
import TopBanner from "@/src/components/common/TopBanner";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TopBanner />
      <div className="relative">
        <Nav />
        {children}
        <Footer />
      </div>
    </>
  );
}
