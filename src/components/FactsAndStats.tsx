import { paint } from "@/lib/media";
import type { Section } from "@/lib/types";

export function FactsAndStats({ sections }: { sections: Section[] }) {
  if (sections.length === 0) {
    return null;
  }

  return (
    <div id="facts">
      {sections.map((section) => (
        <section key={section.id} className="facts" aria-labelledby={`section-${section.id}`}>
          <h2 id={`section-${section.id}`}>{section.title}</h2>
          <ul className="stat-row">
            {section.stats.map((stat) => (
              <li
                key={stat.id}
                style={{
                  backgroundColor: paint(stat.background_color, "#AD3330"),
                  color: paint(stat.text_color, "#FFFFFF"),
                }}
              >
                <p className="stat-value">{stat.display_value}</p>
                <p className="stat-copy">{stat.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
