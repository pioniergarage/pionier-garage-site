import { cva } from "class-variance-authority";

/**
 * Maps from CMS alignment styles to Tailwind classnames.
 */
export const sectionVariants = cva(
  // Base classes applied to all sections
  "flex flex-col gap-5 flex-wrap", 
  {
    variants: {
      alignment: {
        left: "items-start",
        center: "items-center",
        right: "items-end",
      },
      size: {
        full: "w-full",
        half: "max-w-[50%]",
        third: "max-w-[33%]",
        screen: "w-screen ml-[calc(50%-50vw)]"
      },
    },
    defaultVariants: {
      alignment: "left",
      size: "full",
    },
  }
);