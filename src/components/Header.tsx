"use client";

import { useMemo, useState, type CSSProperties } from "react";

import { paint } from "@/lib/media";
import type { Homepage, NavNode } from "@/lib/types";

interface SearchHit {
  key: string;
  label: string;
  href: string;
  external: boolean;
}

function Chevron() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2.2 4.2 6 8l3.8-3.8" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.25" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M16 16.5 20.5 21" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function externalProps(url: string, external: boolean) {
  if (external || url.startsWith("http")) {
    return { target: "_blank" as const, rel: "noopener noreferrer" };
  }
  return {};
}

function collectHits(data: Homepage, query: string): SearchHit[] {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return [];
  }
  const hits: SearchHit[] = [];

  for (const link of data.action_links) {
    if (link.label.toLowerCase().includes(needle)) {
      hits.push({
        key: `action-${link.id}`,
        label: link.label,
        href: link.url,
        external: link.open_in_new_tab,
      });
    }
  }

  const walk = (items: NavNode[]) => {
    for (const item of items) {
      if (item.label.toLowerCase().includes(needle) && item.url) {
        hits.push({
          key: `nav-${item.id}`,
          label: item.label,
          href: item.url,
          external: item.open_in_new_tab,
        });
      }
      walk(item.children);
    }
  };
  walk(data.navigation);

  for (const slide of data.slides) {
    if (slide.caption.toLowerCase().includes(needle)) {
      hits.push({
        key: `slide-${slide.id}`,
        label: slide.caption,
        href: slide.button_url || "#hero",
        external: Boolean(slide.button_url),
      });
    }
  }

  for (const section of data.sections) {
    if (section.title.toLowerCase().includes(needle)) {
      hits.push({ key: `section-${section.id}`, label: section.title, href: "#facts", external: false });
    }
    for (const stat of section.stats) {
      const label = `${stat.display_value} ${stat.description}`;
      if (label.toLowerCase().includes(needle)) {
        hits.push({ key: `stat-${stat.id}`, label, href: "#facts", external: false });
      }
    }
  }

  return hits.slice(0, 12);
}

export function Header({ data }: { data: Homepage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [logoFailed, setLogoFailed] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const hits = useMemo(() => collectHits(data, query), [data, query]);
  const actionStyle = {
    "--action-bg": paint(data.site.action_background_color, "#E6D4D8"),
    "--action-text": paint(data.site.action_text_color, "#2C2426"),
  } as CSSProperties;

  return (
    <header className={menuOpen ? "site-header is-menu-open" : "site-header"}>
      <div className="header-inner">
        <div className="header-top">
          <a className="brand" href="/">
            {data.site.logo_url && !logoFailed ? (
              <img
                className="logo-image"
                src={data.site.logo_url}
                alt={data.site.logo_alt}
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <span className="wordmark">
                <span className="wordmark-kicker">{data.site.university_line}</span>
                <span className="wordmark-name">{data.site.name_line}</span>
                <span className="wordmark-equity">{data.site.equity_line}</span>
              </span>
            )}
          </a>
          <div className="header-tools" style={actionStyle}>
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              Menu
            </button>
            <div className="action-row">
              {data.action_links.map((link) => (
                <a
                  key={link.id}
                  className="action-link"
                  href={link.url}
                  {...externalProps(link.url, link.open_in_new_tab)}
                >
                  {link.label}
                </a>
              ))}
              {data.site.show_search ? (
                <button
                  type="button"
                  className="search-toggle"
                  aria-label="Search"
                  aria-expanded={searchOpen}
                  onClick={() => setSearchOpen((open) => !open)}
                >
                  <SearchIcon />
                </button>
              ) : null}
              {searchOpen ? (
                <div className="search-panel">
                  <input
                    autoFocus
                    value={query}
                    placeholder={data.site.search_placeholder}
                    aria-label={data.site.search_placeholder}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  {query.trim() && hits.length === 0 ? (
                    <p className="search-empty">Nothing on this page matches that search.</p>
                  ) : null}
                  {hits.length > 0 ? (
                    <ul>
                      {hits.map((hit) => (
                        <li key={hit.key}>
                          <a href={hit.href} {...externalProps(hit.href, hit.external)}>
                            {hit.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <nav aria-label="Primary">
          <ul className="main-nav">
            {data.navigation.map((item) => (
              <li
                key={item.id}
                className={openMenuId === item.id ? "nav-item is-open" : "nav-item"}
              >
                {item.url ? (
                  <a className="nav-label" href={item.url} {...externalProps(item.url, item.open_in_new_tab)}>
                    {item.label}
                  </a>
                ) : (
                  <button
                    type="button"
                    className="nav-label"
                    aria-expanded={openMenuId === item.id}
                    onClick={() =>
                      setOpenMenuId((current) => (current === item.id ? null : item.id))
                    }
                  >
                    {item.label}
                    {item.children.length > 0 ? <Chevron /> : null}
                  </button>
                )}
                {item.children.length > 0 ? (
                  <ul className={item.children.length > 6 ? "nav-dropdown is-wide" : "nav-dropdown"}>
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <a href={child.url} {...externalProps(child.url, child.open_in_new_tab)}>
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
