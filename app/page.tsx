import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { Row, ProductCard, RankCard, ReorderCard } from "@/components/Rows";
import { CATEGORIES, FEATURED_SLUG, onPromo, productBySlug, productsIn, RECENT_PURCHASES, topToday } from "@/lib/catalog";

export default function BrowsePage() {
  const featured = productBySlug(FEATURED_SLUG)!;
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero product={featured} eyebrow="Paling laris hari ini" />
        <div className="relative z-10 -mt-16 flex flex-col gap-8 sm:-mt-24">
          <Row id="beli-lagi" title="Beli lagi">
            {RECENT_PURCHASES.map((r) => <ReorderCard key={r.slug + r.nominalId} {...r} />)}
          </Row>
          <Row title="Top 10 hari ini">
            {topToday().map((p, i) => <RankCard key={p.slug} product={p} rank={i + 1} />)}
          </Row>
          {CATEGORIES.map((c) => (
            <Row key={c.slug} title={c.label} href={`/kategori/${c.slug}`}>
              {productsIn(c.slug).map((p) => <ProductCard key={p.slug} product={p} />)}
            </Row>
          ))}
          <Row title="Promo minggu ini">
            {onPromo().map((p) => <ProductCard key={p.slug} product={p} />)}
          </Row>
        </div>
      </main>
      <Footer />
    </>
  );
}
