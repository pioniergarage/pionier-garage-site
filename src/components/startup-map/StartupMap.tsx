import type { CSSProperties } from "react";
import FilterSearchBar from "../search/FilterSearchBar";
import StartupMapCategoryGroup from "./StartupMapCategoryGroup";
import type { StartupMapViewEntry, StartupMapViewMilestone } from "./types";
import { useStartupMapViewModel } from "./useStartupMapViewModel";

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
        className="sticky top-[80px] z-10"
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
        <p className="mt-5 text-secondary">
          {locale === "de"
            ? "Keine passenden Eintraege gefunden."
            : "No matching entries found."}
        </p>
      ) : (
        <div className="flex flex-col gap-5 w-full max-w-215 pt-2 pb-6">
          {filteredMap.map((milestone) => {
            const categoryGroups = groupEntriesByCategory(milestone.entries);

            return (
              <section className="flex flex-col gap-5" key={milestone.id}>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 border-[2.5px] border-text rounded-full shrink-0" aria-hidden="true" />
                  <h3 className="m-0 text-text font-medium text-xl">{milestone.name}</h3>
                </div>

                <div className="flex flex-col">
                  {categoryGroups.map((group, index) => {
                    const nextGroup = categoryGroups[index + 1];

                    return (
                      <div key={`${milestone.id}-${group.categoryKey}-${index}`}>
                        <StartupMapCategoryGroup group={group} />
                        {nextGroup && (
                          <div
                            className="w-2.5 h-16.25 -my-2.5 mx-1.25 rounded-[10px]"
                            aria-hidden="true"
                            style={
                              {
                                background: "linear-gradient(180deg, var(--startup-map-transition-from) 20%, var(--startup-map-transition-to) 80%)",
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
  yellow: "var(--color-accent-yellow)",
  green: "var(--color-accent-red)",
  blue: "var(--color-accent-blue)",
  pink: "var(--color-accent-pink)",
  orange: "var(--color-accent-orange)",
};

function getCategoryColorValue(categoryColor: string) {
  return colorMap[categoryColor] ?? "var(--color-text)";
}