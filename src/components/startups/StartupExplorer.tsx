import { useEffect, useMemo, useState } from "react";
import Grid from "../ui/Grid";
import type { StartupItem } from "./types";
import StartupListCard from "./StartupListCard";
import SearchBar from "./SearchBar";
import { useStartupExplorerViewModel } from "./useStartupExplorerViewModel";


export interface Props {
  startups: StartupItem[];
  locale?: "de" | "en";
}

const INITIAL_VISIBLE_STARTUPS = 24;
const LOAD_MORE_STEP = 24;

const translations = {
  de: {
    empty: "Keine passenden Startups gefunden.",
    loadMore: "Mehr laden",
  },
  en: {
    empty: "No matching startups found.",
    loadMore: "Load more",
  },
} as const;

export default function StartupExplorer({ startups, locale = "en" }: Props) {
  const {
    activeFilterCount,
    clearAll,
    close,
    filteredStartups,
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
  } = useStartupExplorerViewModel(startups, locale);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_STARTUPS);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_STARTUPS);
  }, [filteredStartups]);

  const visibleStartups = useMemo(
    () => filteredStartups.slice(0, visibleCount),
    [filteredStartups, visibleCount],
  );
  const hasMoreStartups = visibleStartups.length < filteredStartups.length;
  const labels = translations[locale];

  return (
    <>
      <SearchBar
        activeFilterCount={activeFilterCount}
        clearAll={clearAll}
        close={close}
        groups={groups}
        hasActiveFilters={hasActiveFilters}
        inputRef={inputRef}
        isOpen={isOpen}
        locale={locale}
        onOpen={open}
        panelRef={panelRef}
        query={query}
        removeSelectedTag={removeSelectedTag}
        selectedTagChips={selectedTagChips}
        setQuery={setQuery}
        toggleFilter={toggleFilter}
      />

      {filteredStartups.length === 0 ? (
        <p className="text-center w-full text-secondary">{labels.empty}</p>
      ) : (
        <div className="[&_a]:block [&_a]:min-w-0">
          <Grid<StartupItem> items={visibleStartups} keyExtractor={(startup) => startup.name} card={(startup) => <StartupListCard startup={startup} />} />
          {hasMoreStartups && (
            <div className="flex justify-center mt-6">
              <button
                type="button"
                className="inline-block px-5 py-3.75 text-base font-inherit text-text bg-transparent border-2 border-text rounded transition duration-150 ease-out cursor-pointer hover:bg-text hover:text-bg w-full sm:w-auto"
                onClick={() => setVisibleCount((current) => current + LOAD_MORE_STEP)}
              >
                {labels.loadMore}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}