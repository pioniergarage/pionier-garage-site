import type { StartupMapViewEntry } from "./types";

type StartupMapItemProps = {
  entry: StartupMapViewEntry;
};

export default function StartupMapItem({ entry }: StartupMapItemProps) {
  return (
    <article className="startup-map__entry">
      <div className="startup-map__entry-rail" aria-hidden="true">
        <span className="startup-map__entry-dot" />
      </div>
      <div className="startup-map__entry-content">
        <div className="startup-map__entry-content--header">
          <span className={`startup-map__entry-category startup-map__category--${entry.category.color}`}>
            {entry.category.name}
          </span>
          <h3 className="title-3--medium startup-map__entry-title">{entry.name}</h3>
        </div>
        {entry.description && (
          <span className="startup-map__entry-description">{entry.description}</span>
        )}
      </div>
    </article>
  );
}
