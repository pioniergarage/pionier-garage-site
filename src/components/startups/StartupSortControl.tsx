export interface Props {
  label?: string;
}

export default function StartupSortControl({ label = "Recently Added" }: Props) {
  return (
    <button 
      type="button" 
      className="inline-flex items-center justify-start gap-2.5 h-10 p-0 rounded-none border-0 bg-transparent text-white font-body text-base font-normal leading-none cursor-pointer max-sm:h-9" 
      aria-label="Sort startups"
    >
      <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current" aria-hidden="true">
        <path d="M6 3.75a.75.75 0 0 1 .75.75v9.69l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72V4.5A.75.75 0 0 1 6 3.75Zm8 .53a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1-1.06 1.06l-1.72-1.72v9.63a.75.75 0 0 1-1.5 0V6.62l-1.72 1.72a.75.75 0 0 1-1.06-1.06l3-3Z"></path>
      </svg>
      <span>{label}</span>
    </button>
  );
}