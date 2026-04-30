export type FilterColor = "green" | "yellow" | "blue" | "pink" | "orange";

export type SearchFilterGroup<GroupKey extends string = string> = {
  key: GroupKey;
  title: string;
  color: FilterColor;
  values: Array<{
    value: string;
    label?: string;
    isSelected: boolean;
    color?: FilterColor;
  }>;
};

export type SelectedTagChip<GroupKey extends string = string> = {
  key: GroupKey;
  value: string;
  label?: string;
  color: FilterColor;
};
