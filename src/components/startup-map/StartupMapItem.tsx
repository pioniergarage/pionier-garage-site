import { cva, type VariantProps } from "class-variance-authority";
import type { StartupMapViewEntry } from "./types";

const categoryTextVariants = cva(
  "inline-block text-[14px] uppercase",
  {
    variants: {
      color: {
        yellow: "text-accent-yellow",
        green: "text-accent-red",
        blue: "text-accent-blue",
        pink: "text-accent-pink",
        orange: "text-accent-orange",
      },
    },
  }
);

type StartupMapItemProps = {
  entry: StartupMapViewEntry;
};

export default function StartupMapItem({ entry }: StartupMapItemProps) {
  return (
    <article className="flex flex-row gap-2.5">
      <div className="flex justify-center min-h-full w-5 shrink-0" aria-hidden="true">
        <span className="w-[14px] h-[14px] shrink-0 rounded-full border-2 border-bg bg-text mt-[22px]" />
      </div>
      
      <div className="min-w-0 flex flex-col gap-[5px]">
        <div className="flex flex-col gap-0 justify-start">
          <span className={categoryTextVariants({ color: entry.category.color as VariantProps<typeof categoryTextVariants>["color"] })}>
            {entry.category.name}
          </span>
          <h3 className="m-0 text-text font-medium text-xl">{entry.name}</h3>
        </div>
        
        {entry.description && (
          <span className="text-secondary text-[14px] line-clamp-2">
            {entry.description}
          </span>
        )}
      </div>
    </article>
  );
}