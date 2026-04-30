import StartupMapItem from "./StartupMapItem";
import type { StartupMapViewEntry } from "./types";

type StartupMapCategoryGroupData = {
  categoryKey: string;
  categoryColor: string;
  entries: StartupMapViewEntry[];
};

type StartupMapCategoryGroupProps = {
  group: StartupMapCategoryGroupData;
};

export default function StartupMapCategoryGroup({ group }: StartupMapCategoryGroupProps) {
  return (
    <div className="startup-map__category-group">
      <div
        className={`startup-map__category-group-indicator startup-map__category-group-indicator--${group.categoryColor}`}
      ></div>
      <div className="startup-map__category-group-entries">
        {group.entries.map((entry) => (
          <StartupMapItem entry={entry} key={entry.id} />
        ))}
      </div>
    </div>
  );
}
