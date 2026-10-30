import { FactsAndStats } from "@/components/FactsAndStats";
import { Header } from "@/components/Header";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { LandingBands } from "@/components/LandingBands";
import type { Homepage } from "@/lib/types";

export function HomePage({ data }: { data: Homepage }) {
  const empty =
    data.slides.length === 0 &&
    data.sections.length === 0 &&
    data.navigation.length === 0 &&
    data.blocks.length === 0;

  return (
    <>
      <Header data={data} />
      <main>
        {empty ? (
          <p className="empty-state">
            No homepage content yet. Add slides, navigation, and stats in Django admin, then
            refresh this page.
          </p>
        ) : (
          <>
            <HeroSlideshow slides={data.slides} />
            <FactsAndStats sections={data.sections} />
            <LandingBands data={data} />
          </>
        )}
      </main>
    </>
  );
}
