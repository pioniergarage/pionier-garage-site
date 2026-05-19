import StartupSearchShell from "./StartupSearchShell";
import StartupSortControl from "./StartupSortControl";

export interface Props {
  title?: string;
  searchPlaceholder?: string;
  sortLabel?: string;
}

export default function StartupsHeader({
  title = "Unsere Startups",
  searchPlaceholder = "Suche nach Startups, Branchen, ...",
  sortLabel = "Recently Added",
}: Props) {
  return (
    <header className="flex flex-col items-stretch gap-5 mb-4 max-sm:gap-3.5">
      <h2 className="m-0 w-full block font-display text-[30px] font-bold leading-normal tracking-normal text-white max-sm:text-[28px]">
        {title}
      </h2>
      <div className="flex items-center gap-5 w-full max-sm:flex-col max-sm:items-start max-sm:gap-2">
        <StartupSearchShell placeholder={searchPlaceholder} />
        <StartupSortControl label={sortLabel} />
      </div>
    </header>
  );
}