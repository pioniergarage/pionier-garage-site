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
        //"startup-search-panel__empty"
        <p className='startup-search-panel__empty'>{labels.empty}</p>
      ) : (
        <div className="startup-search-panel__results">
          <Grid<StartupItem> items={visibleStartups} keyExtractor={(startup) => startup.name} card={(startup) => <StartupListCard startup={startup} />} />
          {hasMoreStartups && (
            <div className="startup-search-panel__pagination">
              <button
                type="button"
                className="button"
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
