import Footer from "../../components/Footer";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Header2 height + promo banner - uses CSS class from globals.css */}
      <div className="pages-content-offset">{children}</div>
      <Footer />
    </>
  );
}
