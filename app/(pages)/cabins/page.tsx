import CabinCard from "@/app/components/CabinCard";
import { cabins } from "@/app/data/cabins";

export default function CabinsPage() {
  return (
    <main>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">Our Cabins</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cabins.map((cabin) => (
            <CabinCard key={cabin.id} {...cabin} />
          ))}
        </div>
      </div>
    </main>
  );
}