import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Activities - Cabaneau',
  description: 'Explore exciting activities and experiences available at Cabaneau.',
};

export default function ActivitiesPage() {
  return (
    <main>
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold">Activities</h1>
      </div>
    </main>
  );
}