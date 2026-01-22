import Footer from "../../components/Footer";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Header2 height: mobile ~58px, desktop ~82px - handled by ConditionalHeader in root layout */}
      <div className="mt-[58px] md:mt-[82px]">{children}</div>
      <Footer />
    </>
  );
}
