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
    <>
      <header className="startups-header">
        <h2 className="startups-header__title">{title}</h2>
        <div className="startups-header__controls">
          <StartupSearchShell placeholder={searchPlaceholder} />
          <StartupSortControl label={sortLabel} />
        </div>
      </header>

      <style>{`
        .startups-header {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 20px;
          margin-bottom: 16px;
        }

        .startups-header__title {
          margin: 0;
          width: 100%;
          display: block;
          font-family: var(--font-display), sans-serif;
          font-size: 30px;
          font-weight: 700;
          line-height: normal;
          letter-spacing: 0;
          color: #fff;
        }

        .startups-header__controls {
          display: flex;
          align-items: center;
          gap: 20px;
          width: 100%;
        }

        @media (max-width: 640px) {
          .startups-header {
            gap: 14px;
          }

          .startups-header__title {
            font-size: 28px;
          }

          .startups-header__controls {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>
    </>
  );
}
