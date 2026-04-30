export interface Props {
  placeholder?: string;
}

export default function StartupSearchShell({
  placeholder = "Suche nach Startups, Branchen, ...",
}: Props) {
  return (
    <>
      <div className="startup-search-shell" role="search" aria-label="Search startups">
        <svg viewBox="0 0 24 24" className="startup-search-shell__icon" aria-hidden="true">
          <path d="M11 4a7 7 0 0 1 5.53 11.29l3.09 3.09a1 1 0 0 1-1.41 1.41l-3.09-3.09A7 7 0 1 1 11 4Zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" />
        </svg>
        <span className="startup-search-shell__placeholder">{placeholder}</span>
      </div>

      <style>{`
        .startup-search-shell {
          display: inline-flex;
          align-items: center;
          gap: 15px;
          flex: 1;
          min-width: 0;
          height: 58px;
          padding: 0 20px;
          border-radius: 40px;
          border: 1px solid var(--stroke);
          background: rgba(0, 0, 0, 0.2);
          color: var(--secondary);
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.15);
        }

        .startup-search-shell__icon {
          width: 15px;
          height: 15px;
          fill: currentColor;
        }

        .startup-search-shell__placeholder {
          font-family: var(--font-body), sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 640px) {
          .startup-search-shell {
            width: 100%;
            height: 52px;
            padding: 0 16px;
          }
        }
      `}</style>
    </>
  );
}
