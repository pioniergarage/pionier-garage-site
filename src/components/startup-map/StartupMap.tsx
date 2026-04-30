import type { CSSProperties } from "react";
import FilterSearchBar from "../search/FilterSearchBar";
import StartupMapCategoryGroup from "./StartupMapCategoryGroup";
import type { StartupMapViewEntry, StartupMapViewMilestone } from "./types";
import { useStartupMapViewModel } from "./useStartupMapViewModel";
import "./startup-map.css"

type StartupMapProps = {
  map: StartupMapViewMilestone[];
  locale?: "de" | "en";
};

const translations = {
  de: {
    ariaLabel: "Startup Map Suche",
    clearAll: "Alle löschen",
    clearAllAriaLabel: "Alle Filter zurücksetzen",
    noActiveFiltersAriaLabel: "Keine aktiven Filter",
    searchButton: "Suchen",
    searchPlaceholder: "Suche und Filtere nach Angeboten, Kategorien, Meilensteinen ...",
  },
  en: {
    ariaLabel: "Startup map search",
    clearAll: "Clear all",
    clearAllAriaLabel: "Clear all filters",
    noActiveFiltersAriaLabel: "No active filters",
    searchButton: "Search",
    searchPlaceholder: "Search and filter offers, categories, milestones ...",
  },
} as const;

export default function StartupMapRenderer({ map, locale = "en" }: StartupMapProps) {
  const {
    activeFilterCount,
    clearAll,
    close,
    filteredMap,
    groups,
    hasActiveFilters,
    inputRef,
    isOpen,
    open,
    panelRef,
    query,
    removeSelectedTag,
    selectedTagChips,
    setQuery,
    toggleFilter,
  } = useStartupMapViewModel(map, locale);

  return (
    <>
      <FilterSearchBar
        activeFilterCount={activeFilterCount}
        className="startup-explorer"
        clearAll={clearAll}
        close={close}
        groups={groups}
        hasActiveFilters={hasActiveFilters}
        inputId="startup-map-search-input"
        inputRef={inputRef}
        isOpen={isOpen}
        labels={translations[locale]}
        onOpen={open}
        overlayId="startup-map-search-overlay"
        panelRef={panelRef}
        query={query}
        removeSelectedTag={removeSelectedTag}
        selectedTagChips={selectedTagChips}
        setQuery={setQuery}
        toggleFilter={toggleFilter}
      />

      {filteredMap.length === 0 ? (
        <p className="startup-map-empty">
          {locale === "de"
            ? "Keine passenden Eintraege gefunden."
            : "No matching entries found."}
        </p>
      ) : (
        <div className="startup-map">
          {filteredMap.map((milestone) => {
            const categoryGroups = groupEntriesByCategory(milestone.entries);

            return (
              <section className="startup-map__milestone-group" key={milestone.id}>
                <div className="startup-map__milestone">
                  <span className="startup-map__milestone-circle" aria-hidden="true" />
                  <h3 className="title-3--medium">{milestone.name}</h3>
                </div>

                <div className="startup-map__milestone-categories">
                  {categoryGroups.map((group, index) => {
                    const nextGroup = categoryGroups[index + 1];

                    return (
                      <div key={`${milestone.id}-${group.categoryKey}-${index}`}>
                        <StartupMapCategoryGroup group={group} />
                        {nextGroup && (
                          <div
                            className="startup-map__category-transition"
                            aria-hidden="true"
                            style={
                              {
                                "--startup-map-transition-from": getCategoryColorValue(group.categoryColor),
                                "--startup-map-transition-to": getCategoryColorValue(nextGroup.categoryColor),
                              } as CSSProperties
                            }
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </>
  );
}

function groupEntriesByCategory(entries: StartupMapViewEntry[]) {
  return entries.reduce<
    Array<{
      categoryKey: string;
      categoryColor: string;
      entries: StartupMapViewEntry[];
    }>
  >((groups, entry) => {
    const categoryKey = `${entry.category.name}-${entry.category.color ?? ""}`;
    const categoryColor = entry.category.color ?? "";

    const currentGroup = groups.at(-1);

    if (currentGroup && currentGroup.categoryKey === categoryKey) {
      currentGroup.entries.push(entry);
      return groups;
    }

    groups.push({
      categoryKey,
      categoryColor,
      entries: [entry],
    });

    return groups;
  }, []);
}

const colorMap: Record<string, string> = {
  yellow: "var(--accent-yellow)",
  green: "var(--accent-green)",
  blue: "var(--accent-blue)",
  pink: "var(--accent-pink)",
  orange: "var(--accent-orange)",
};

function getCategoryColorValue(categoryColor: string) {


  return colorMap[categoryColor] ?? "var(--text)";
}
