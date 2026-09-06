import Link from "next/link";
import { PrimaryButton } from "@/components/blog/shared/PrimaryButton";

const HERO_CARDS = [
  {
    id: "card-1",
    headline: "CINEMATIC MASTERPIECES: THE REVOLUTION OF OPTICS & LIGHTING",
    borderColor: "#3FE0E0",
    glowColor: "rgba(63, 224, 224, 0.55)",
    bgImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    slug: "secrets-of-cinematography-in-modern-fantasy"
  },
  {
    id: "card-2",
    headline: "NEON WORLDS & CYBERPUNK CHRONICLES: CRAFTING FUTURE REALMS",
    borderColor: "#E23FE0",
    glowColor: "rgba(226, 63, 224, 0.55)",
    bgImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80",
    slug: "cyberpunk-visual-languages-neon-shadows"
  }
];

export function BlogHero() {
  return (
    <section className="mt-8 w-full" aria-label="Featured Blog Hero">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {HERO_CARDS.map((card) => (
          <div
            key={card.id}
            style={{
              borderColor: card.borderColor,
              boxShadow: `0 0 18px ${card.glowColor}`
            }}
            className="group relative h-[380px] sm:h-[420px] w-full overflow-hidden rounded-card border-2 bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(63,224,224,0.7)]"
          >
            {/* Background Poster Collage Thumbnail */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${card.bgImage})` }}
            />

            {/* Darkened Overlay (rgba(0,0,0,0.55)) */}
            <div className="absolute inset-0 bg-black/55 backdrop-brightness-75 transition-opacity duration-300 group-hover:bg-black/45" />

            {/* Content Overlay - Bottom-Left Aligned */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
              <h2 className="max-w-[85%] sm:max-w-[70%] font-display text-2xl sm:text-[32px] font-extrabold uppercase leading-[1.15] text-white drop-shadow-md">
                {card.headline}
              </h2>

              <div className="mt-6">
                <PrimaryButton
                  variant="global"
                  href={`/blog/${card.slug}/quick`}
                  className="!px-6 !py-3 !text-sm !font-bold uppercase tracking-wider"
                >
                  EXPLORE NOW →
                </PrimaryButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
