import { useEffect, useMemo, useRef, useState } from "react";
import type {
  FilterColor,
  SearchFilterGroup,
  SelectedTagChip as SharedSelectedTagChip,
} from "../search/types";
import {
  formatStartupTaxonomyLabel,
  normalizeStartupTaxonomyValue,
} from "../../utils/startupTaxonomy";
import type { StartupItem } from "./types";

export type FilterGroupKey =
  | "industry"
  | "productType"
  | "productStatus"
  | "grow";

type FilterGroupDefinition = {
  key: FilterGroupKey;
  tone: FilterColor;
  getValues: (startup: StartupItem) => string[];
};

export type SearchBarGroup = SearchFilterGroup<FilterGroupKey>;

export type SelectedTagChip = SharedSelectedTagChip<FilterGroupKey>;

type SelectedFilters = Record<FilterGroupKey, Set<string>>;

type IndexedStartup = {
  startup: StartupItem;
  searchText: string;
  filters: Record<FilterGroupKey, Set<string>>;
};

const FILTER_GROUPS: FilterGroupDefinition[] = [
  {
    key: "industry",
    tone: "green",
    getValues: (startup) => [startup.industry],
  },
  {
    key: "productType",
    tone: "yellow",
    getValues: (startup) => [startup.marketModel],
  },
  {
    key: "productStatus",
    tone: "blue",
    getValues: (startup) => [startup.stage],
  },
  {
    key: "grow",
    tone: "pink",
    getValues: (startup) =>
      [startup.industry, startup.marketModel, startup.stage].filter((value) =>
        value.trim().toUpperCase().startsWith("GROW"),
      ),
  },
];

const FILTER_GROUP_TITLES = {
  de: {
    industry: "Branchen:",
    productType: "Produkttyp:",
    productStatus: "Produktstatus:",
    grow: "GROW Teilnehmer:",
  },
  en: {
    industry: "Industries:",
    productType: "Product type:",
    productStatus: "Product status:",
    grow: "GROW participants:",
  },
} as const;

function normalizeValue(value: string): string {
  return normalizeStartupTaxonomyValue(value);
}

function buildSearchText(startup: StartupItem) {
  return [
    startup.name,
    startup.shortDescription,
    startup.industry,
    startup.marketModel,
    startup.stage,
  ]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function buildIndexedStartup(startup: StartupItem): IndexedStartup {
  const filters = {} as IndexedStartup["filters"];

  for (const group of FILTER_GROUPS) {
    filters[group.key] = new Set(
      group.getValues(startup).map(normalizeValue).filter(Boolean),
    );
  }

  return {
    startup,
    searchText: buildSearchText(startup),
    filters,
  };
}

function createEmptySelectedFilters(): SelectedFilters {
  return {
    industry: new Set(),
    productType: new Set(),
    productStatus: new Set(),
    grow: new Set(),
  };
}

function sortValues(values: Set<string>) {
  return [...values].sort((left, right) =>
    left.localeCompare(right, "de", { sensitivity: "base" }),
  );
}

export function useStartupExplorerViewModel(
  startups: StartupItem[],
  locale: "de" | "en" = "en",
) {
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(
    createEmptySelectedFilters,
  );
  const filterGroupTitles = FILTER_GROUP_TITLES[locale];

  const normalizedQuery = query.trim().toLowerCase();
  const startupList = Array.isArray(startups) ? startups : [];

  const indexedStartups = useMemo(
    () => startupList.map(buildIndexedStartup),
    [startupList],
  );

  const groups = useMemo(() => {
    return FILTER_GROUPS.map((group) => {
      const values = new Set<string>();

      for (const indexedStartup of indexedStartups) {
        for (const value of group.getValues(indexedStartup.startup)) {
          const normalizedGroupValue = normalizeValue(value);
          if (normalizedGroupValue) values.add(normalizedGroupValue);
        }
      }

      return {
        key: group.key,
        title: filterGroupTitles[group.key],
        color: group.tone,
        values: sortValues(values).map((value) => ({
          value,
          label: formatStartupTaxonomyLabel(value),
          isSelected: selectedFilters[group.key].has(value),
          color: group.tone,
        })),
      };
    }).filter((group) => group.values.length > 0);
  }, [filterGroupTitles, indexedStartups, selectedFilters]);

  const filteredStartups = useMemo(() => {
    return indexedStartups
      .filter(({ searchText, filters }) => {
        if (normalizedQuery && !searchText.includes(normalizedQuery)) {
          return false;
        }

        return FILTER_GROUPS.every((group) => {
          const selectedGroupValues = selectedFilters[group.key];
          if (selectedGroupValues.size === 0) {
            return true;
          }

          const startupValues = filters[group.key];
          return [...selectedGroupValues].some((selectedValue) =>
            startupValues.has(selectedValue),
          );
        });
      })
      .map(({ startup }) => startup);
  }, [indexedStartups, normalizedQuery, selectedFilters]);

  const selectedTagChips = useMemo(() => {
    return groups.flatMap((group) =>
      group.values
        .filter((value) => value.isSelected)
        .map((value) => ({
          key: group.key,
          value: value.value,
          label: value.label,
          color: group.color,
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

  const toggleFilter = (groupKey: FilterGroupKey, value: string) => {
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

  const removeSelectedTag = (groupKey: FilterGroupKey, value: string) => {
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
    filteredStartups,
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
