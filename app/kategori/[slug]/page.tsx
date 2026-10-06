import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { Row, ProductCard } from "@/components/Rows";
import { FlashSaleCard, FlashSaleTitle } from "@/components/Promo";
import { CATEGORIES, categoryBySlug, FLASH_DEALS, productBySlug, productsIn, type CategorySlug } from "@/lib/catalog";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryBySlug(slug);
  return category ? { title: category.label, description: category.tagline } : {};
}

/**
 * A section page: the category's best seller as billboard, its flash-sale
 * items, then every product as a grid (a shelf of five would leave the page
 * mostly empty).
 */
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categoryBySlug(slug);
  if (!category) notFound();
  const items = productsIn(category.slug as CategorySlug);
  const featured = [...items].sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))[0];
  const deals = FLASH_DEALS.filter((d) => productBySlug(d.slug)?.category === category.slug);

  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero product={featured} eyebrow={category.label} compact allHref="#semua" />
        <div className="relative z-10 -mt-8 flex flex-col gap-6">
          {deals.length > 0 && (
            <Row id="flash-sale" title="Flash Sale" heading={<FlashSaleTitle />}>
              {deals.map((d) => <FlashSaleCard key={d.slug + d.nominalId} deal={d} />)}
            </Row>
          )}
          <section id="semua" aria-labelledby="semua-title" className="scroll-mt-24 px-4 sm:px-8">
            <h2 id="semua-title" className="text-lg font-bold tracking-tight text-ink sm:text-xl">
              Semua {category.label.toLowerCase().startsWith("top up") ? "game" : category.label}
              <span className="ml-2 text-sm font-medium text-muted">{items.length} produk</span>
            </h2>
            <p className="mt-0.5 text-sm text-muted">{category.tagline}</p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {items.map((p) => <ProductCard key={p.slug} product={p} fluid />)}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
