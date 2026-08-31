import Link from "next/link";

export default function BlogPostNotFound() {
  return (
    <main>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-2xl font-logga text-[#495D4D] mb-4">Blog post not found</h1>
          <Link
            href="/blog"
            className="inline-block bg-[#F49A4A] text-white px-6 py-3 hover:bg-[#e08c3c] transition-colors font-jost"
          >
            Back to Blog
          </Link>
        </div>
      </section>
    </main>
  );
}
