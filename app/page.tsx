import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { Row, ProductCard, RankCard, ReorderCard } from "@/components/Rows";
import { BannerCard, FlashSaleCard, FlashSaleTitle } from "@/components/Promo";
import {
  CATEGORIES,
  FEATURED_SLUG,
  FLASH_DEALS,
  newGames,
  onPromo,
  productBySlug,
  productsIn,
  PROMO_BANNERS,
  RECENT_PURCHASES,
  topToday,
} from "@/lib/catalog";

export default function BrowsePage() {
  const featured = productBySlug(FEATURED_SLUG)!;
  const [games, ...others] = CATEGORIES;
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero product={featured} eyebrow="Paling laris hari ini" />
        <div className="relative z-10 -mt-16 flex flex-col gap-8 sm:-mt-24">
          <Row id="flash-sale" title="Flash Sale" heading={<FlashSaleTitle />}>
            {FLASH_DEALS.map((d) => <FlashSaleCard key={d.slug + d.nominalId} deal={d} />)}
          </Row>
          <Row id="promo" title="Promo & info">
            {PROMO_BANNERS.map((b) => <BannerCard key={b.id} banner={b} />)}
          </Row>
          <Row id="beli-lagi" title="Beli lagi">
            {RECENT_PURCHASES.map((r) => <ReorderCard key={r.slug + r.nominalId} {...r} />)}
          </Row>
          <Row title={games.label} href={`/kategori/${games.slug}`}>
            {productsIn(games.slug).map((p) => <ProductCard key={p.slug} product={p} />)}
          </Row>
          <Row title="Top 10 hari ini">
            {topToday().map((p, i) => <RankCard key={p.slug} product={p} rank={i + 1} />)}
          </Row>
          <Row id="game-baru" title="Game baru">
            {newGames().map((p) => <ProductCard key={p.slug} product={p} />)}
          </Row>
          {others.map((c) => (
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
