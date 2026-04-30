import { useEffect, useMemo, useState } from "react";
import { pb } from "../../lib/pocketbase";
import SearchBar from "./SearchBar";
import type { EventItem } from "./types";
import { useEventsExplorerViewModel } from "./useEventsExplorerViewModel";
import EventListCard from "./EventListCard";

export interface Props {
  events: EventItem[];
  locale?: "de" | "en";
}

const INITIAL_VISIBLE_EVENTS = 24;
const LOAD_MORE_STEP = 24;

const translations = {
  de: {
    empty: "Keine passenden Events gefunden.",
    free: "Kostenlos",
    loadMore: "Mehr laden",
    paid: "Kostenpflichtig",
    untitled: "Event",
  },
  en: {
    empty: "No matching events found.",
    free: "Free",
    loadMore: "Load more",
    paid: "Paid",
    untitled: "Event",
  },
} as const;

export default function EventsGrid({ events, locale = "en" }: Props) {
  const {
    activeFilterCount,
    clearAll,
    close,
    filteredEvents,
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
  } = useEventsExplorerViewModel(events, locale);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_EVENTS);
  const labels = translations[locale];

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_EVENTS);
  }, [filteredEvents]);

  const visibleEvents = useMemo(
    () => filteredEvents.slice(0, visibleCount),
    [filteredEvents, visibleCount],
  );
  const hasMoreEvents = visibleEvents.length < filteredEvents.length;

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

      {filteredEvents.length === 0 ? (
        <p className="startup-search-panel__empty">{labels.empty}</p>
      ) : (
        <div className="startup-search-panel__results">
          <div className="grid" aria-label="Event list">
            {visibleEvents.map((event) => (
              <div key={event.id}>
                <EventListCard event={event} locale={locale} />
              </div>
            ))}
          </div>

          {hasMoreEvents && (
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
