import { Search, X } from "lucide-react";
import type { KeyboardEvent, MouseEvent, RefObject } from "react";

import type { SearchFilterGroup, SelectedTagChip } from "./types";

type FilterSearchBarLabels = {
  ariaLabel: string;
  clearAll: string;
  clearAllAriaLabel: string;
  noActiveFiltersAriaLabel: string;
  searchButton: string;
  searchPlaceholder: string;
};

type FilterSearchBarProps<GroupKey extends string = string> = {
  activeFilterCount: number;
  className?: string;
  clearAll: () => void;
  close: () => void;
  groups: SearchFilterGroup<GroupKey>[];
  hasActiveFilters: boolean;
  inputId: string;
  inputRef: RefObject<HTMLInputElement | null>;
  isOpen: boolean;
  labels: FilterSearchBarLabels;
  onOpen: () => void;
  overlayId: string;
  panelRef: RefObject<HTMLDivElement | null>;
  query: string;
  removeSelectedTag: (groupKey: GroupKey, value: string) => void;
  selectedTagChips: SelectedTagChip<GroupKey>[];
  setQuery: (value: string) => void;
  toggleFilter: (groupKey: GroupKey, value: string) => void;
};

export default function FilterSearchBar<GroupKey extends string = string>({
  activeFilterCount,
  className,
  clearAll,
  close,
  groups,
  hasActiveFilters,
  inputId,
  inputRef,
  isOpen,
  labels,
  onOpen,
  overlayId,
  panelRef,
  query,
  removeSelectedTag,
  selectedTagChips,
  setQuery,
  toggleFilter,
}: FilterSearchBarProps<GroupKey>) {
  const handleTagRemove = (
    event: MouseEvent<HTMLButtonElement>,
    key: GroupKey,
    value: string,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    removeSelectedTag(key, value);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      close();
    }
  };

  const desktopVisibleTagCount = 2;
  const mobileVisibleTagCount = 1;
  const desktopHiddenSelectedTagCount = Math.max(
    selectedTagChips.length - desktopVisibleTagCount,
    0,
  );
  const mobileHiddenSelectedTagCount = Math.max(
    selectedTagChips.length - mobileVisibleTagCount,
    0,
  );

  return (
    <section className={className} aria-label={labels.ariaLabel}>
      <div className="startup-search-panel__top-row startup-search-panel__top-row--closed">
        <button
          type="button"
          className="startup-search-trigger"
          onClick={onOpen}
          aria-expanded={isOpen}
          aria-controls={overlayId}
        >
          <div className="startup-search-panel__search startup-search-panel__search--summary">
            <Search className="startup-search-panel__icon" />
            {selectedTags()}

            {query ? (
              <span className="startup-search-trigger__text">{query}</span>
            ) : (
              <span className="startup-search-trigger__text startup-search-trigger__text--placeholder">
                {labels.searchPlaceholder}
              </span>
            )}
          </div>
        </button>
        {clearAllButton()}
      </div>

      {isOpen && <div className="startup-search-backdrop" />}

      <div
        id={overlayId}
        ref={panelRef}
        className={`startup-search-panel ${isOpen ? "is-open" : ""}`}
      >
        <div className="startup-search-panel__top-row startup-search-panel__top-row--overlay">
          <label className="startup-search-panel__search" htmlFor={inputId}>
            <Search className="startup-search-panel__icon" />
            {selectedTags()}

            <input
              ref={inputRef}
              id={inputId}
              type="text"
              placeholder={labels.searchPlaceholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleInputKeyDown}
            />
          </label>
          {clearAllButton()}
        </div>

        {groups.map((group) => (
          <div className="startup-search-panel__group" key={group.key}>
            <p>{group.title}</p>
            <div className="startup-search-panel__chips">
              {group.values
                .filter((value) => value.value)
                .map((value) => (
                  <button
                    type="button"
                    key={`${group.key}-${value.value}`}
                    className={`tag-item tag-item__clickable tag-item--${value.color ?? group.color} ${value.isSelected ? "is-selected" : ""}`}
                    onClick={() => toggleFilter(group.key, value.value)}
                  >
                    {value.label ?? value.value}
                  </button>
                ))}
            </div>
          </div>
        ))}

        <button type="button" className="button-filled__white" onClick={close}>
          {labels.searchButton}
        </button>
      </div>
    </section>
  );

  function clearAllButton() {
    return (
      <button
        type="button"
        className={`startup-search-panel__clear ${hasActiveFilters ? "is-visible" : ""}`}
        onClick={clearAll}
        aria-label={
          hasActiveFilters
            ? `${labels.clearAllAriaLabel} (${activeFilterCount})`
            : labels.noActiveFiltersAriaLabel
        }
      >
        <X className="startup-search-panel__icon startup-search-panel__icon--clear" />
        <span className="startup-search-panel__clear-label">{labels.clearAll}</span>
      </button>
    );
  }

  function selectedTags() {
    return (
      <div className="startup-search-panel__selected-tags">
        {selectedTagChips.map((chip) => (
          <button
            type="button"
            key={`${chip.key}-${chip.value}`}
            className={`tag-item tag-item__clickable tag-item--${chip.color} is-selected startup-search-panel__selected-tag`}
            onClick={(event) => handleTagRemove(event, chip.key, chip.value)}
          >
            <span>{chip.label ?? chip.value}</span>
          </button>
        ))}
        {desktopHiddenSelectedTagCount > 0 && (
          <span className="tag-item tag-item--summary startup-search-panel__selected-tag-count startup-search-panel__selected-tag-count--desktop">
            +{desktopHiddenSelectedTagCount}
          </span>
        )}
        {mobileHiddenSelectedTagCount > 0 && (
          <span className="tag-item tag-item--summary startup-search-panel__selected-tag-count startup-search-panel__selected-tag-count--mobile">
            +{mobileHiddenSelectedTagCount}
          </span>
        )}
      </div>
    );
  }
}
