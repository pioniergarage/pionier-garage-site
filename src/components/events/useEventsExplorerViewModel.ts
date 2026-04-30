import { useEffect, useMemo, useRef, useState } from "react";

import type { SearchFilterGroup, SelectedTagChip } from "../search/types";
import type { EventItem } from "./types";
import type { FilterGroupKey } from "./SearchBar";

type IndexedEvent = {
  event: EventItem;
  searchText: string;
};

function formatSearchDate(dateValue: Date | string, locale: "de" | "en") {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function buildSearchText(event: EventItem, locale: "de" | "en") {
  const priceLabel = event.freeEvent
    ? locale === "de"
      ? "kostenlos free"
      : "free kostenlos"
    : locale === "de"
      ? "kostenpflichtig paid"
      : "paid kostenpflichtig";

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

function buildIndexedEvent(event: EventItem, locale: "de" | "en"): IndexedEvent {
  return {
    event,
    searchText: buildSearchText(event, locale),
  };
}

export function useEventsExplorerViewModel(
  events: EventItem[],
  locale: "de" | "en" = "en",
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
