import type { RefObject } from "react";

import FilterSearchBar from "../search/FilterSearchBar";
import type { FilterGroupKey, SearchBarGroup, SelectedTagChip } from "./useStartupExplorerViewModel";

type SearchBarProps = {
  activeFilterCount: number;
  clearAll: () => void;
  close: () => void;
  groups: SearchBarGroup[];
  hasActiveFilters: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  isOpen: boolean;
  locale?: "de" | "en";
  onOpen: () => void;
  panelRef: RefObject<HTMLDivElement | null>;
  query: string;
  removeSelectedTag: (groupKey: FilterGroupKey, value: string) => void;
  selectedTagChips: SelectedTagChip[];
  setQuery: (value: string) => void;
  toggleFilter: (groupKey: FilterGroupKey, value: string) => void;
};

const translations = {
  de: {
    ariaLabel: "Startup Suche",
    clearAll: "Alle löschen",
    clearAllAriaLabel: "Alle Filter zuruecksetzen",
    noActiveFiltersAriaLabel: "Keine aktiven Filter",
    searchButton: "Suchen",
    searchPlaceholder: "Suche nach Startups, Branchen, ...",
  },
  en: {
    ariaLabel: "Startup search",
    clearAll: "Clear all",
    clearAllAriaLabel: "Clear all filters",
    noActiveFiltersAriaLabel: "No active filters",
    searchButton: "Search",
    searchPlaceholder: "Search startups, industries, ...",
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
      className="startup-explorer"
      clearAll={clearAll}
      close={close}
      groups={groups}
      hasActiveFilters={hasActiveFilters}
      inputId="startup-search-input"
      inputRef={inputRef}
      isOpen={isOpen}
      labels={translations[locale]}
      onOpen={onOpen}
      overlayId="startup-search-overlay"
      panelRef={panelRef}
      query={query}
      removeSelectedTag={removeSelectedTag}
      selectedTagChips={selectedTagChips}
      setQuery={setQuery}
      toggleFilter={toggleFilter}
    />
  );
}
