import type { RefObject } from "react";

import FilterSearchBar from "../search/FilterSearchBar";
import type { SearchFilterGroup, SelectedTagChip } from "../search/types";

export type FilterGroupKey = "search";

type SearchBarProps = {
  activeFilterCount: number;
  clearAll: () => void;
  close: () => void;
  groups: SearchFilterGroup<FilterGroupKey>[];
  hasActiveFilters: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  isOpen: boolean;
  locale?: "de" | "en";
  onOpen: () => void;
  panelRef: RefObject<HTMLDivElement | null>;
  query: string;
  removeSelectedTag: (groupKey: FilterGroupKey, value: string) => void;
  selectedTagChips: SelectedTagChip<FilterGroupKey>[];
  setQuery: (value: string) => void;
  toggleFilter: (groupKey: FilterGroupKey, value: string) => void;
};

const translations = {
  de: {
    ariaLabel: "Event Suche",
    clearAll: "Alle löschen",
    clearAllAriaLabel: "Alle Filter zuruecksetzen",
    noActiveFiltersAriaLabel: "Keine aktiven Filter",
    searchButton: "Suchen",
    searchPlaceholder: "Suche nach Events, Orten, ...",
  },
  en: {
    ariaLabel: "Event search",
    clearAll: "Clear all",
    clearAllAriaLabel: "Clear all filters",
    noActiveFiltersAriaLabel: "No active filters",
    searchButton: "Search",
    searchPlaceholder: "Search events, locations, ...",
  },
} as const;

export default function SearchBar({
  activeFilterCount,
  clearAll,
  close,
  groups,
  hasActiveFilters,
  inputRef,
  isOpen,
  locale = "en",
  onOpen,
  panelRef,
  query,
  removeSelectedTag,
  selectedTagChips,
  setQuery,
  toggleFilter,
}: SearchBarProps) {
  return (
    <FilterSearchBar
      activeFilterCount={activeFilterCount}
      className="sticky top-20 z-10" // Replaced .startup-explorer
      clearAll={clearAll}
      close={close}
      groups={groups}
      hasActiveFilters={hasActiveFilters}
      inputId="event-search-input"
      inputRef={inputRef}
      isOpen={isOpen}
      labels={translations[locale]}
      onOpen={onOpen}
      overlayId="event-search-overlay"
      panelRef={panelRef}
      query={query}
      removeSelectedTag={removeSelectedTag}
      selectedTagChips={selectedTagChips}
      setQuery={setQuery}
      toggleFilter={toggleFilter}
    />
  );
}