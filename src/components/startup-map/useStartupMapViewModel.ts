import { useEffect, useMemo, useRef, useState } from "react";

import type {
  FilterColor,
  SearchFilterGroup,
  SelectedTagChip as SharedSelectedTagChip,
} from "../search/types";
import type { StartupMapViewMilestone } from "./types";

export type StartupMapFilterGroupKey = "category";
export type StartupMapSearchBarGroup = SearchFilterGroup<StartupMapFilterGroupKey>;
export type StartupMapSelectedTagChip = SharedSelectedTagChip<StartupMapFilterGroupKey>;

type SelectedFilters = Record<StartupMapFilterGroupKey, Set<string>>;

const GROUP_TITLES = {
  de: {
    category: "Kategorien:",
  },
  en: {
    category: "Categories:",
  },
} as const;

function normalizeValue(value?: string): string {
  if (!value) {
    return "";
  }

  return value.trim().replaceAll("_", " ").toLowerCase();
}

function createEmptySelectedFilters(): SelectedFilters {
  return {
    category: new Set(),
  };
}

function toFilterTone(color?: string): FilterColor {
  switch (color) {
    case "yellow":
    case "green":
    case "blue":
    case "pink":
    case "orange":
      return color;
    default:
      return "green";
  }
}

function buildSearchText(milestoneName: string, entry: StartupMapViewMilestone["entries"][number]) {
  return [
    milestoneName,
    entry.name ?? "",
    entry.description ?? "",
    entry.category?.name ?? "",
  ]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function useStartupMapViewModel(
  map: StartupMapViewMilestone[],
  locale: "de" | "en" = "en",
) {
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(
    createEmptySelectedFilters,
  );

  const titles = GROUP_TITLES[locale];
  const normalizedQuery = query.trim().toLowerCase();
  const safeMap = Array.isArray(map) ? map : [];

  const groups = useMemo<StartupMapSearchBarGroup[]>(() => {
    const values = new Map<
      string,
      {
        color: FilterColor;
      }
    >();

    for (const milestone of safeMap) {
      for (const entry of milestone.entries ?? []) {
        const normalizedCategory = normalizeValue(entry.category?.name);
        if (!normalizedCategory) {
          continue;
        }

        values.set(normalizedCategory, {
          color: toFilterTone(entry.category?.color),
        });
      }
    }

    return [
      {
        key: "category",
        title: titles.category,
        color: "orange",
        values: [...values.entries()]
          .sort(([left], [right]) =>
            left.localeCompare(right, locale, { sensitivity: "base" }),
          )
          .map(([value, metadata]) => ({
            value,
            isSelected: selectedFilters.category.has(value),
            color: metadata.color,
          })),
      },
    ].filter((group) => group.values.length > 0);
  }, [locale, safeMap, selectedFilters.category, titles.category]);

  const filteredMap = useMemo(() => {
    return safeMap
      .map((milestone) => ({
        ...milestone,
        entries: (milestone.entries ?? []).filter((entry) => {
          if (
            normalizedQuery &&
            !buildSearchText(milestone.name, entry).includes(normalizedQuery)
          ) {
            return false;
          }

          if (selectedFilters.category.size === 0) {
            return true;
          }

          return selectedFilters.category.has(normalizeValue(entry.category?.name));
        }),
      }))
      .filter((milestone) => milestone.entries.length > 0);
  }, [safeMap, normalizedQuery, selectedFilters.category]);

  const selectedTagChips = useMemo<StartupMapSelectedTagChip[]>(() => {
    return groups.flatMap((group) =>
      group.values
        .filter((value) => value.isSelected)
        .map((value) => ({
          key: group.key,
          value: value.value,
          color: value.color ?? group.color,
        })),
    );
  }, [groups]);

  const activeFilterCount =
    selectedTagChips.length + (normalizedQuery.length > 0 ? 1 : 0);
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

  const toggleFilter = (groupKey: StartupMapFilterGroupKey, value: string) => {
    const normalizedValue = normalizeValue(value);

    setSelectedFilters((currentFilters) => {
      const nextFilters = { ...currentFilters };
      const nextGroupValues = new Set(nextFilters[groupKey]);

      if (nextGroupValues.has(normalizedValue)) {
        nextGroupValues.delete(normalizedValue);
      } else {
        nextGroupValues.add(normalizedValue);
      }

      nextFilters[groupKey] = nextGroupValues;
      return nextFilters;
    });
  };

  const removeSelectedTag = (
    groupKey: StartupMapFilterGroupKey,
    value: string,
  ) => {
    const normalizedValue = normalizeValue(value);

    setSelectedFilters((currentFilters) => {
      const nextFilters = { ...currentFilters };
      const nextGroupValues = new Set(nextFilters[groupKey]);

      nextGroupValues.delete(normalizedValue);
      nextFilters[groupKey] = nextGroupValues;
      return nextFilters;
    });
  };

  const clearAll = () => {
    setQuery("");
    setSelectedFilters(createEmptySelectedFilters());
  };

  return {
    activeFilterCount,
    clearAll,
    close: () => setIsOpen(false),
    filteredMap,
    groups,
    hasActiveFilters,
    inputRef,
    isOpen,
    open: () => setIsOpen(true),
    panelRef,
    query,
    removeSelectedTag,
    selectedTagChips,
    setQuery,
    toggleFilter,
  };
}
