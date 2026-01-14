import { Suspense } from "react";
import Header2 from "../../components/Header2";
import Footer from "../../components/Footer";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Suspense fallback={<div className="h-[70px] md:h-[86px] bg-white" />}>
        <Header2 />
      </Suspense>
      <main>{children}</main>
      <Footer />
    </div>
  );
}
