import { cva } from "class-variance-authority";

export const alignmentVariants: Record<string, string> = {
  left: "items-start",
  center: "items-center",
  right: "items-end",
};

/**
 * Maps from CMS alignment styles to Tailwind classnames.
 */
export const sectionVariants = cva(
  // Base classes applied to all sections
  "flex flex-col gap-5 flex-wrap",
  {
    variants: {
      alignment: alignmentVariants,
      size: {
        full: "w-full max-w-7xl mx-auto",
        half: "max-w-[50%]",
        third: "max-w-[33.333333333333336%]",
        screen: "w-screen"
      },
    },
    defaultVariants: {
      alignment: "left",
      size: "full",
    },
  }
);
