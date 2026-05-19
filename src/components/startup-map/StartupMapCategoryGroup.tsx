import { cva, type VariantProps } from "class-variance-authority";
import StartupMapItem from "./StartupMapItem";
import type { StartupMapViewEntry } from "./types";

const indicatorVariants = cva(
  "w-2.5 mx-1.25 rounded-full shrink-0",
  {
    variants: {
      color: {
        yellow: "bg-accent-yellow",
        green: "bg-accent-red",
        blue: "bg-accent-blue",
        pink: "bg-accent-pink",
        orange: "bg-accent-orange",
      },
    },
  }
);

type StartupMapCategoryGroupData = {
  categoryKey: string;
  categoryColor: string;
  entries: StartupMapViewEntry[];
};

type StartupMapCategoryGroupProps = {
  group: StartupMapCategoryGroupData;
};

export default function StartupMapCategoryGroup({ group }: StartupMapCategoryGroupProps) {
  return (
    <div className="flex flex-row">
      <div className={indicatorVariants({ color: group.categoryColor as VariantProps<typeof indicatorVariants>["color"] })} />
      <div className="flex flex-col gap-7.5 -ml-5">
        {group.entries.map((entry) => (
          <StartupMapItem entry={entry} key={entry.id} />
        ))}
      </div>
    </div>
  );
}