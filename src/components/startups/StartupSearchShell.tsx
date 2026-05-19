export interface Props {
  placeholder?: string;
}

export default function StartupSearchShell({
  placeholder = "Suche nach Startups, Branchen, ...",
}: Props) {
  return (
    <div 
      className="inline-flex items-center gap-3.75 flex-1 min-w-0 h-14.5 px-5 rounded-[40px] border border-stroke bg-black/20 text-secondary shadow-[0_2px_15px_rgba(0,0,0,0.15)] max-sm:w-full max-sm:h-13 max-sm:px-4" 
      role="search" 
      aria-label="Search startups"
    >
      <svg viewBox="0 0 24 24" className="w-3.75 h-3.75 fill-current" aria-hidden="true">
        <path d="M11 4a7 7 0 0 1 5.53 11.29l3.09 3.09a1 1 0 0 1-1.41 1.41l-3.09-3.09A7 7 0 1 1 11 4Zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" />
      </svg>
      <span className="font-body text-base font-normal leading-[1.1] whitespace-nowrap overflow-hidden text-ellipsis">
        {placeholder}
      </span>
    </div>
  );
}