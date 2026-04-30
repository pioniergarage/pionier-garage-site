export interface Props {
  label?: string;
}

export default function StartupSortControl({ label = "Recently Added" }: Props) {
  return (
    <>
      <button type="button" className="startup-sort-control" aria-label="Sort startups">
        <svg viewBox="0 0 20 20" className="startup-sort-control__sort-icon" aria-hidden="true">
          <path d="M6 3.75a.75.75 0 0 1 .75.75v9.69l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72V4.5A.75.75 0 0 1 6 3.75Zm8 .53a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1-1.06 1.06l-1.72-1.72v9.63a.75.75 0 0 1-1.5 0V6.62l-1.72 1.72a.75.75 0 0 1-1.06-1.06l3-3Z"></path>
        </svg>
        <span>{label}</span>
      </button>

      <style>{`
        .startup-sort-control {
          display: inline-flex;
          align-items: center;
          justify-content: flex-start;
          gap: 10px;
          height: 40px;
          padding: 0;
          border-radius: 0;
          border: 0;
          background: transparent;
          color: #fff;
          font-family: var(--font-body), sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 1;
          cursor: pointer;
        }

        .startup-sort-control__sort-icon {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }

        @media (max-width: 640px) {
          .startup-sort-control {
            justify-content: flex-start;
            height: 36px;
          }
        }
      `}</style>
    </>
  );
}
