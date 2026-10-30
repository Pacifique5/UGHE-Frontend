"use client";

import { useEffect, useRef, useState } from "react";

import { paint, youtubeEmbed } from "@/lib/media";
import type { Homepage, LandingBlock, NewsStory } from "@/lib/types";

import { Reveal } from "./Reveal";

function BandButton({ block }: { block: LandingBlock }) {
  if (!block.button_label || !block.button_url) {
    return null;
  }
  return (
    <a
      className="band-button"
      href={block.button_url}
      style={{
        backgroundColor: paint(block.button_color, "#FFFFFF"),
        color: paint(block.button_text_color, "#C42127"),
      }}
    >
      {block.button_label}
      <span aria-hidden="true">→</span>
    </a>
  );
}

function PromoBand({ block }: { block: LandingBlock }) {
  const embed = youtubeEmbed(block.image_url);
  return (
    <section className="promo" id="applications" aria-labelledby={`block-${block.id}`}>
      <div className="promo-media">
        {embed ? (
          <iframe
            src={`${embed}?autoplay=1&mute=1&controls=0&loop=1&playlist=${embed.split("/").pop()}`}
            title=""
            allow="autoplay; encrypted-media"
            tabIndex={-1}
          />
        ) : block.image_url ? (
          <img src={block.image_url} alt="" />
        ) : null}
      </div>
      <div
        className="promo-card"
        style={{
          backgroundColor: paint(block.overlay_color, "#C42127B0"),
          color: paint(block.text_color, "#FFFFFF"),
        }}
      >
        <Reveal>
          <h2 id={`block-${block.id}`}>{block.title}</h2>
          {block.body ? <p>{block.body}</p> : null}
          <BandButton block={block} />
        </Reveal>
      </div>
    </section>
  );
}

function FeatureBand({ blocks }: { blocks: LandingBlock[] }) {
  const background = blocks.find((block) => block.image_url && !youtubeEmbed(block.image_url));
  return (
    <section
      className="feature-band"
      id="academics"
      style={{
        backgroundImage: background ? `url("${background.image_url}")` : undefined,
        backgroundColor: paint(blocks[0]?.background_color ?? "", "#000000"),
      }}
    >
      <div className="feature-grid">
        {blocks.map((block) => (
          <Reveal key={block.id}>
            <article
              className="feature-col"
              style={{
                backgroundColor: paint(block.overlay_color, "#00000030"),
                color: paint(block.text_color, "#FFFFFF"),
              }}
            >
              <h2>{block.title}</h2>
              {block.body ? <p>{block.body}</p> : null}
              <BandButton block={block} />
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function NewsBand({ heading, stories }: { heading: LandingBlock; stories: NewsStory[] }) {
  const scroller = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(false);

  function step(direction: number) {
    const node = scroller.current;
    const card = node?.querySelector("li");
    if (!node || !card) {
      return;
    }
    const width = card.getBoundingClientRect().width + 22;
    const max = node.scrollWidth - node.clientWidth;
    if (direction > 0 && node.scrollLeft >= max - 8) {
      node.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    node.scrollBy({ left: direction * width, behavior: "smooth" });
  }

  useEffect(() => {
    if (paused || stories.length < 2) {
      return;
    }
    const timer = window.setInterval(() => step(1), 5000);
    return () => window.clearInterval(timer);
  }, [paused, stories.length]);

  return (
    <section
      className="news-band"
      id="news"
      style={{ backgroundColor: paint(heading.background_color, "#F5F5F5") }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="news-head">
        <h2 style={{ color: paint(heading.text_color, "#111111") }}>{heading.title}</h2>
        <div className="news-tools">
          <BandButton block={heading} />
          <button type="button" aria-label="Previous stories" onClick={() => step(-1)}>
            ‹
          </button>
          <button type="button" aria-label="Next stories" onClick={() => step(1)}>
            ›
          </button>
        </div>
      </div>
      <ul ref={scroller} className="news-row">
        {stories.map((story, index) => (
          <li key={story.id}>
            <Reveal>
              <a className="news-card" href={story.url}>
                {story.image_url ? <img src={story.image_url} alt="" /> : <span className="news-fallback" />}
                <span className="news-copy">
                  {story.category ? (
                    <span className="news-category">{story.category}</span>
                  ) : null}
                  <span className="news-title">{story.title}</span>
                  <span className="news-more">Read more</span>
                </span>
              </a>
            </Reveal>
            <span className="sr-only">{index + 1}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ImpactBand({ block }: { block: LandingBlock }) {
  return (
    <section
      className="impact-band"
      id="impact"
      style={{
        backgroundImage: block.image_url ? `url("${block.image_url}")` : undefined,
        backgroundColor: paint(block.background_color, "#000000"),
      }}
    >
      <Reveal className="impact-copy">
        <div style={{ color: paint(block.text_color, "#FFFFFF") }}>
          <h2>{block.title}</h2>
          {block.body ? <p>{block.body}</p> : null}
          <BandButton block={block} />
        </div>
      </Reveal>
    </section>
  );
}

function SocialGlyph({ label }: { label: string }) {
  const name = label.toLowerCase();
  if (name.includes("facebook")) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z" />
      </svg>
    );
  }
  if (name === "x" || name.includes("twitter")) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 4h4.2l3.3 4.6L16.6 4H20l-5.7 7.2L20.4 20h-4.2l-3.6-5L8.4 20H5l6-7.6L5 4z" />
      </svg>
    );
  }
  if (name.includes("instagram")) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm8 2H8a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3zm-4 3.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 2A1.8 1.8 0 1 0 13.8 12 1.8 1.8 0 0 0 12 10.2zM17.2 6.6a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 9H3v12h3zm.2-4.2A1.8 1.8 0 1 1 4.4 6.6a1.8 1.8 0 0 1 1.8-1.8zM21 21h-3v-6.4c0-1.8-.8-2.4-1.8-2.4s-2 .8-2 2.5V21h-3V9h3v1.6c.6-.9 1.8-1.8 3.6-1.8 2.4 0 4.2 1.5 4.2 4.8z" />
    </svg>
  );
}

function SiteFooter({ data }: { data: Homepage }) {
  if (data.offices.length === 0 && data.social_links.length === 0) {
    return null;
  }
  return (
    <footer
      className="site-footer"
      style={{
        backgroundColor: paint(data.site.footer_background_color, "#C22226"),
        color: paint(data.site.footer_text_color, "#FFFFFF"),
      }}
    >
      <div className="footer-grid">
        <div className="footer-brand">
          {data.site.logo_url ? <img src={data.site.logo_url} alt={data.site.logo_alt} /> : null}
          {data.offices.map((office) => (
            <p key={office.id}>{office.body}</p>
          ))}
        </div>
        <div className="footer-social">
          <h2>{data.site.footer_heading}</h2>
          <ul>
            {data.social_links.map((link) => (
              <li key={link.id}>
                <a href={link.url} aria-label={link.label}>
                  <SocialGlyph label={link.label} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export function LandingBands({ data }: { data: Homepage }) {
  const promo = data.blocks.find((block) => block.kind === "promo");
  const features = data.blocks.filter((block) => block.kind === "feature");
  const news = data.blocks.find((block) => block.kind === "news");
  const impact = data.blocks.find((block) => block.kind === "impact");

  return (
    <>
      {promo ? <PromoBand block={promo} /> : null}
      {features.length > 0 ? <FeatureBand blocks={features} /> : null}
      {news ? <NewsBand heading={news} stories={data.stories} /> : null}
      {impact ? <ImpactBand block={impact} /> : null}
      <SiteFooter data={data} />
    </>
  );
}
