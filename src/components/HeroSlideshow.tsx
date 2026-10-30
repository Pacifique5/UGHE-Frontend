"use client";

import { useEffect, useState } from "react";

import { isDirectVideo, paint, youtubeEmbed } from "@/lib/media";
import type { Slide } from "@/lib/types";

const ROTATE_MS = 8000;

export function HeroSlideshow({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length < 2 || paused || slides[index]?.media_type === "video") {
      return;
    }
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [index, paused, slides]);

  if (slides.length === 0) {
    return null;
  }

  const active = slides[index];
  const embed = active.media_type === "video" ? youtubeEmbed(active.media_url) : null;

  function step(direction: number) {
    setIndex((current) => (current + direction + slides.length) % slides.length);
  }

  return (
    <section
      id="hero"
      className="hero"
      aria-roledescription="carousel"
      aria-label="Featured stories"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <article
        className={active.media_type === "video" ? "hero-slide is-video" : "hero-slide"}
        aria-live="polite"
      >
        {embed ? (
          <iframe
            className="hero-media"
            src={embed}
            title={active.caption}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : active.media_type === "video" && isDirectVideo(active.media_url) ? (
          <video className="hero-media" src={active.media_url} controls />
        ) : (
          <img className="hero-media" src={active.media_url} alt="" />
        )}
        <div className="hero-shade" />
        <div className="hero-copy">
          <p>{active.caption}</p>
          {active.button_label && active.button_url ? (
            <a
              className="hero-button"
              href={active.button_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: paint(active.button_color, "#79B9BC"),
                color: paint(active.button_text_color, "#FFFFFF"),
              }}
            >
              {active.button_label}
            </a>
          ) : null}
        </div>
      </article>
      {slides.length > 1 ? (
        <>
          <button type="button" className="hero-arrow hero-arrow-prev" onClick={() => step(-1)} aria-label="Previous slide">
            ‹
          </button>
          <button type="button" className="hero-arrow hero-arrow-next" onClick={() => step(1)} aria-label="Next slide">
            ›
          </button>
          <div className="hero-dots">
            {slides.map((slide, dotIndex) => (
              <button
                key={slide.id}
                type="button"
                className={dotIndex === index ? "is-active" : undefined}
                aria-label={`Show slide ${dotIndex + 1}`}
                onClick={() => setIndex(dotIndex)}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
