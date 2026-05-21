import { Search, XIcon } from "lucide-react";
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

// Static color mapping dictionaries ensure Tailwind detects full utility class names
const tagBaseColors: Record<string, string> = {
  summary: "text-primary-muted bg-white/5 border-white/10",
  green: "text-accent-green bg-accent-green/14 border-accent-green/20 hover:bg-accent-green/30",
  yellow: "text-accent-yellow bg-accent-yellow/14 border-accent-yellow/20 hover:bg-accent-yellow/30",
  blue: "text-accent-blue bg-accent-blue/14 border-accent-blue/20 hover:bg-accent-blue/30",
  pink: "text-accent-pink bg-accent-pink/14 border-accent-pink/20 hover:bg-accent-pink/30",
  orange: "text-accent-orange bg-accent-orange/14 border-accent-orange/20 hover:bg-accent-orange/30",
};

const tagSelectedColors: Record<string, string> = {
  green: "bg-accent-green text-primary-muted hover:bg-accent-green hover:opacity-80",
  yellow: "bg-accent-yellow text-primary-muted hover:bg-accent-yellow hover:opacity-80",
  blue: "bg-accent-blue text-primary-muted hover:bg-accent-blue hover:opacity-80",
  pink: "bg-accent-pink text-primary-muted hover:bg-accent-pink hover:opacity-80",
  orange: "bg-accent-orange text-primary-muted hover:bg-accent-orange hover:opacity-80",
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

  // Common button class derived from global.css
  const tagItemBaseClass = "inline-flex items-center justify-center px-2.5 py-1.25 rounded border text-[14px] font-normal leading-normal whitespace-nowrap capitalize transition duration-150 ease-out cursor-pointer";

  return (
    <section className={className} aria-label={labels.ariaLabel}>
      {/* Top Row / Closed State Bar */}
      <div className="flex flex-col mt-0.5 py-2 rounded border-2 border-[#2a2c2e] bg-black/50 backdrop-blur-md shadow-[0_2px_24px_rgba(0,0,0,0.25)]">
        <div className="flex justify-between gap-2.5 items-center m-0 max-[900px]:items-center">
          <button
            type="button"
            className="flex items-center align-self-stretch flex-1 min-w-0 border-0 bg-transparent -my-3 -ml-3.5 py-3 px-3.5 color-inherit font-inherit text-left cursor-text"
            onClick={onOpen}
            aria-expanded={isOpen}
            aria-controls={overlayId}
          >
            <div className="flex items-center gap-2.5 min-w-0 w-full text-white p-2">
              <Search className="w-3.75 height-3.75 text-primary-muted shrink-0" />


              {query ? (
                <span className="text-primary min-w-0 overflow-hidden w-full line-clamp-1 vertical-box-orient">{query}</span>
              ) : (
                <span className="text-primary-muted min-w-0 overflow-hidden w-full line-clamp-1 vertical-box-orient">
                  {labels.searchPlaceholder}
                </span>
              )}
            </div>
            {(selectedTagChips.length < 1 && hasActiveFilters) && <ClearAllButton />}
          </button>

        </div>
        {selectedTagChips.length > 0 && <div className="flex items-center gap-2.5 min-w-0 w-full px-2 my-3 justify-between">
          <SelectedTags />
          <ClearAllButton />
        </div>}
      </div>

      {/* Backdrop overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/25 backdrop-blur-[1px] z-11" />}

      {/* Open Search Filter Panel */}
      <div
        id={overlayId}
        ref={panelRef}
        className={`flex-col gap-5 p-3.5 pt-0 border-2 border-[#2a2c2e] bg-black/80 backdrop-blur-[5px] shadow-[0_2px_24px_rgba(0,0,0,0.25)] absolute left-0 right-0 top-0 z-12 rounded ${isOpen ? "flex" : "hidden"}`}
      >
        {/* Inner Panel Header Row */}
        <div className="flex justify-between gap-2.5 items-center p-3.5-4 border-2 border-[#2a2c2e] bg-black/50 backdrop-blur-md shadow-[0_2px_24px_rgba(0,0,0,0.25)] -mx-3.5 border-t-0 border-x-0 rounded max-[900px]:items-center">
          <label className="flex items-center gap-2.5 min-w-0 w-full px-2 my-3" htmlFor={inputId}>
            <Search className="w-3.75 height-3.75 text-primary-muted shrink-0" />
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              className="flex-1 min-w-0 border-0 bg-transparent text-primary font-inherit text-initial outline-none p-0 overflow-hidden w-full line-clamp-1 vertical-box-orient placeholder:text-primary-muted"
              placeholder={labels.searchPlaceholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleInputKeyDown}
            />
            <ClearAllButton />
          </label>
        </div>

        <SelectedTags />

        {/* Filter Groups */}
        {groups.map((group) => (
          <div className="flex flex-col gap-1.25" key={group.key}>
            <p className="m-0 text-white">{group.title}</p>
            <div className="flex flex-wrap gap-1.25">
              {group.values.filter(p => query.length < 2 || p.value.toLowerCase().toLowerCase().includes(query))
                .map((value) => {
                  const colorKey = value.color ?? group.color;
                  return (
                    <button
                      type="button"
                      key={`${group.key}-${value.value}`}
                      className={`${tagItemBaseClass} ${tagBaseColors[colorKey] ?? ""} ${value.isSelected ? tagSelectedColors[colorKey] ?? "" : ""}`}
                      onClick={() => toggleFilter(group.key, value.value)}
                    >
                      {value.label ?? value.value}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}

        {/* Close Panel Button */}
        <button
          type="button"
          className="border-0 rounded bg-white text-black text-base font-inherit py-2.5 px-3.75 w-full cursor-pointer transition duration-150 ease-out hover:bg-[#e6e6e6]"
          onClick={close}
        >
          {labels.searchButton}
        </button>
      </div>
    </section>
  );

  function ClearAllButton() {
    return (
      <button
        type="button"
        className={`inline-flex items-center gap-1.25 rounded border-[1.5px] border-accent-pink bg-bg text-accent-pink text-initial font-body shrink-0 py-1.25 px-2.5 cursor-pointer transition duration-150 ease-out ${hasActiveFilters ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"}`}
        onClick={clearAll}
        aria-label={
          hasActiveFilters
            ? `${labels.clearAllAriaLabel} (${activeFilterCount})`
            : labels.noActiveFiltersAriaLabel
        }
      >
        <XIcon className="w-3.75 height-3.7 shrink-0" />
        <span className="text-caption leading-none max-[820px]:hidden">{labels.clearAll}</span>
      </button>
    );
  }

  function SelectedTags() {
    return (
      <div className="inline-flex gap-1.25 flex-nowrap min-w-0 overflow-hidden shrink-0">
        {selectedTagChips.map((chip) => (
          <button
            type="button"
            key={`${chip.key}-${chip.value}`}
            className={`${tagItemBaseClass} ${tagBaseColors[chip.color] ?? ""} max-[820px]:nth-child-n-2:hidden max-[820px]:last:inline-flex`}
            onClick={(event) => handleTagRemove(event, chip.key, chip.value)}
          >
            <XIcon className="w-3.75 height-3.7 shrink-0 mr-1" /><span>{chip.label ?? chip.value}</span>
          </button>
        ))}
      </div>
    );
  }
}