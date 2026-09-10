import { useEffect, useMemo, useRef, useState } from "react";

import type { SearchFilterGroup, SelectedTagChip } from "../search/types";
import type { EventItem } from "./types";
import type { FilterGroupKey } from "./SearchBar";
import { getLocaleTag, type Locale } from "../../utils/i18n";

type IndexedEvent = {
  event: EventItem;
  searchText: string;
};

function formatSearchDate(dateValue: Date | string, locale: Locale) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(getLocaleTag(locale), {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

const priceSearchTerms = {
  de: { free: "kostenlos free gratuit", paid: "kostenpflichtig paid payant" },
  en: { free: "free kostenlos gratuit", paid: "paid kostenpflichtig payant" },
  fr: { free: "gratuit free kostenlos", paid: "payant paid kostenpflichtig" },
} as const;

function buildSearchText(event: EventItem, locale: Locale) {
  const priceLabel = event.freeEvent
    ? priceSearchTerms[locale].free
    : priceSearchTerms[locale].paid;

  return [
    event.title,
    event.shortDescription,
    event.location,
    event.eventUrl,
    formatSearchDate(event.date, locale),
    priceLabel,
  ]
    .map((value) => String(value ?? "").trim())
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function buildIndexedEvent(event: EventItem, locale: Locale): IndexedEvent {
  return {
    event,
    searchText: buildSearchText(event, locale),
  };
}

export function useEventsExplorerViewModel(
  events: EventItem[],
  locale: Locale = "en",
) {
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();
  const eventList = Array.isArray(events) ? events : [];

  const indexedEvents = useMemo(
    () => eventList.map((event) => buildIndexedEvent(event, locale)),
    [eventList, locale],
  );

  const groups = useMemo<SearchFilterGroup<FilterGroupKey>[]>(() => [], []);

  const filteredEvents = useMemo(() => {
    return indexedEvents
      .filter(({ searchText }) => {
        if (normalizedQuery && !searchText.includes(normalizedQuery)) {
          return false;
        }

        return true;
      })
      .map(({ event }) => event);
  }, [indexedEvents, normalizedQuery]);

  const selectedTagChips = useMemo<SelectedTagChip<FilterGroupKey>[]>(() => [], []);

  const activeFilterCount = normalizedQuery.length > 0 ? 1 : 0;
  const hasActiveFilters = activeFilterCount > 0;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!panelRef.current) {
        return;
      }

      const target = event.target as Node;
      if (!panelRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    inputRef.current?.focus();

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return {
    activeFilterCount,
    clearAll: () => setQuery(""),
    close: () => setIsOpen(false),
    filteredEvents,
    groups,
    hasActiveFilters,
    inputRef,
    isOpen,
    open: () => setIsOpen(true),
    panelRef,
    query,
    removeSelectedTag: () => undefined,
    selectedTagChips,
    setQuery,
    toggleFilter: () => undefined,
  };
}
