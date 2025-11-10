import Footer from "../app/components/Footer";
import CabinsSection from "./components/CabinsSection";
import ServicesSection from "./components/ServicesSection";
import ActivitiesSection from "./components/ActivitiesSection";
import HostsSection from "./components/HostsSection";
import LocationSection from "./components/LocationSection";

export default function Home() {
  return (
    <div>
      <main>
        <CabinsSection />
        <ServicesSection />
        <ActivitiesSection />
        <HostsSection />
        <LocationSection />
      </main>
      <Footer />
    </div>
  );
}