// import type { CSSProperties } from "react"; //
import { pb } from "../../lib/pocketbase";
import { formatStartupTaxonomyLabel } from "../../utils/startupTaxonomy";
import type { StartupItem } from "./types";

export interface Props {
  startup: StartupItem;
  // setStartup: React.Dispatch<React.SetStateAction<StartupItem | undefined>>;
}

export default function StartupListCard({ startup }: Props) {
  const detailUrl = `startups#${startup.externalId}`;
  const industry = formatStartupTaxonomyLabel(startup.industry);
  const marketModel = formatStartupTaxonomyLabel(startup.marketModel);
  const stage = formatStartupTaxonomyLabel(startup.stage);

  return (
    <a href={detailUrl}>
      <article className="card">
        <div className="card__media">
          {
            <>
              <img src={startup.headerImageUrl ? pb.files.getURL(startup, startup.headerImageUrl) : pb.files.getURL(startup, startup.logoUrl)} alt="" loading="lazy" className="card__banner-image" />
              <div className="card__banner-overlay"></div>
            </>
          }
        </div>

        <div className="card__content">
          <div className="card__title-image-wrapper">
            <div className="card__title-tags-wrapper">
              <div className="card__title-wrap">
                <h3 className="card__title">{startup.name}</h3>
              </div>
              <div className="tag-item-wrapper">
                {industry && (
                  <span
                    key={`${startup.name}-${startup.industry}`}
                    className={`tag-item tag-item--green`}
                  >
                    {industry}
                  </span>
                )}

                {marketModel && (
                  <span
                    key={`${startup.name}-${startup.marketModel}`}
                    className={`tag-item tag-item--yellow`}
                  >
                    {marketModel}
                  </span>
                )}

                {stage && (
                  <span
                    key={`${startup.name}-${startup.stage}`}
                    className={`tag-item tag-item--blue`}
                  >
                    {stage}
                  </span>
                )}
              </div>
            </div>
            {startup.logoUrl && (
              <div className="card__logo-wrap">
                <img
                  src={pb.files.getURL(startup, startup.logoUrl)}
                  alt={startup.logoUrl ?? `${startup.name} logo`}
                  loading="lazy"
                  className="card__logo"
                />
              </div>
            )}
          </div>
          <div className="card__desc-wrap">
            <p className="card__description">{startup.shortDescription}</p>
          </div>
        </div>
      </article>
    </a>
  );
}
