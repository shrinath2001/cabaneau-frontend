import Footer from "../app/components/Footer";
import CabinsSection from "./components/CabinsSection";
import ServicesSection from "./components/ServicesSection";
import ActivitiesSection from "./components/ActivitiesSection";
import HostsSection from "./components/HostsSection";
import LocationSection from "./components/LocationSection";
import LogoSlider from "./components/LogoSlider";

export default function Home() {
  return (
    <div>
      <main>
        <LogoSlider />
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