import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { Row, ProductCard } from "@/components/Rows";
import { CATEGORIES, categoryBySlug, productsIn, type CategorySlug } from "@/lib/catalog";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryBySlug(slug);
  return category ? { title: category.label, description: category.tagline } : {};
}

/**
 * A section page in the same pattern as the home page: the category's best
 * seller as billboard, then the full shelf and the rest as a grid.
 */
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categoryBySlug(slug);
  if (!category) notFound();
  const items = productsIn(category.slug as CategorySlug);
  const featured = [...items].sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))[0];

  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero product={featured} eyebrow={category.label} compact />
        <div className="relative z-10 -mt-10 flex flex-col gap-8">
          <Row title={`Semua ${category.label}`}>
            {items.map((p) => <ProductCard key={p.slug} product={p} />)}
          </Row>
          <p className="px-4 text-sm text-muted sm:px-8">{category.tagline}</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
