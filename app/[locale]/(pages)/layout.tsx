import Footer from "../../components/Footer";
import { getFooterSections } from "../../lib/footer";

export default async function PagesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const footerSections = await getFooterSections(locale);

  return (
    <>
      {/* Header2 height + promo banner - uses CSS class from globals.css */}
      <div className="pages-content-offset">{children}</div>
      <Footer sections={footerSections} />
    </>
  );
}
