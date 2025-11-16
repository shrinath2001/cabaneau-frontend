import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eat & Drink - Cabaneau',
  description: 'Discover dining and beverage options at Cabaneau.',
};

export default function EatDrinkPage() {
  return (
    <main>
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold">Eat & Drink</h1>
      </div>
    </main>
  );
}