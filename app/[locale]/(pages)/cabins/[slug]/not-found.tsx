import Link from "next/link";

/**
 * Rendered by notFound() in page.tsx when the slug doesn't match a cabin.
 * Replaces the old client-side error state (which showed the same message
 * after a failed fetch) now that the fetch happens server-side.
 */
export default function CabinNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <p className="text-red-600 font-jost">Cabin not found</p>
        <Link
          href="/cabins"
          className="text-blue-600 hover:underline mt-4 inline-block font-jost"
        >
          Back to all cabins
        </Link>
      </div>
    </div>
  );
}
