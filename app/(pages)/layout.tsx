import Header2 from "../components/Header2";
import Footer from "../components/Footer";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header2 />
      <main>{children}</main>
      <Footer />
    </div>
  );
}