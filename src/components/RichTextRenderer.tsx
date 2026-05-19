import { twMerge } from "tailwind-merge";
import { sectionVariants } from "../utils/style-mapping";
import type { BlockProps } from "./types/types";


// Extend your base props to accept the pre-processed HTML
type Props = BlockProps<"rich-text"> & {
  html?: string;
  children?: React.ReactNode;
};

export default function RichTextRenderer({ html, style, children }: Props) {
  // 1. Wrapper styles using CVA
  const sectionClasses = twMerge(
    sectionVariants({ alignment: style.alignment, size: style.size })
  );

  // 2. Mapping your global CSS rules to Tailwind arbitrary child selectors
  const richTextClasses = twMerge(
    "flex flex-col gap-5 leading-relaxed text-[var(--text-color,#fff)]",

    // Headings
    "[&_:is(h1,h2,h3,h4)]:font-bold [&_:is(h1,h2,h3,h4)]:leading-tight [&_:is(h1,h2,h3,h4)]:mt-4",
    "[&_h1]:text-4xl [&_h2]:text-[1.85rem] [&_h3]:text-2xl",

    // Lists
    "[&_ul]:list-disc [&_ul]:pl-6",
    "[&_ol]:list-decimal [&_ol]:pl-6",

    // Links
    "[&_a]:text-[var(--accent-color,#007bff)] [&_a]:underline [&_a]:underline-offset-4",

    // Blockquotes
    "[&_blockquote]:border-l-2 [&_blockquote]:border-[#d1d1d1] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#e1e1e1]",

    // Tables
    "[&_table]:w-full [&_table]:caption-bottom [&_table]:text-sm [&_table]:border-collapse [&_table]:text-[var(--text)] [&_table]:my-6",
    "[&_thead]:border-b [&_thead]:border-[var(--stroke)]",
    "[&_th]:h-12 [&_th]:px-4 [&_th]:text-left [&_th]:align-middle [&_th]:font-medium [&_th]:text-[var(--text-muted)] [&_th]:border [&_th]:border-[var(--stroke)]",
    "[&_td]:p-4 [&_td]:align-middle [&_td]:border [&_td]:border-[var(--stroke)]",
    "[&_tbody_tr:last-child_td]:border-b-0",
    "[&_tbody_tr]:transition-colors [&_tbody_tr]:duration-200 hover:[&_tbody_tr]:bg-[rgba(39,39,42,0.5)]",

    // Inherit custom classes
    style.className
  );

  return (
    <section className={sectionClasses}>
      {html ? (
        <div
          className={richTextClasses}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div className={richTextClasses}>
          {children}
        </div>
      )}
    </section>
  );
}