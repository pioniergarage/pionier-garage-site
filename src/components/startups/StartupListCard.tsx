import { pb } from "../../lib/pocketbase";
import { formatStartupTaxonomyLabel } from "../../utils/startupTaxonomy";
import type { StartupItem } from "./types";

export interface Props {
  startup: StartupItem;
}

export default function StartupListCard({ startup }: Props) {
  const detailUrl = `startups#${startup.externalId}`;
  const industry = formatStartupTaxonomyLabel(startup.industry);
  const marketModel = formatStartupTaxonomyLabel(startup.marketModel);
  const stage = formatStartupTaxonomyLabel(startup.stage);

  return (
    <a href={detailUrl} className="block min-w-0">
      <article className="flex flex-col w-full min-w-0 rounded border-2 border-stroke bg-black transition duration-150 ease-out hover:-translate-y-0.5">
        <div className="relative h-37.5 shrink-0 overflow-hidden -mb-5.75">
          <img 
            src={startup.headerImageUrl ? pb.files.getURL(startup, startup.headerImageUrl) : pb.files.getURL(startup, startup.logoUrl)} 
            alt="" 
            loading="lazy" 
            className="w-full h-full object-cover object-center block" 
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/15 to-black/50"></div>
        </div>

        <div className="flex flex-col gap-2.5 p-2.5 z-10 relative">
          <div className="flex flex-row gap-2.5 min-w-0 items-center justify-between">
            <div className="flex flex-col gap-2.5 min-w-0 flex-1">
              <div className="px-2.5 min-w-0">
                <h3 className="m-0 font-display text-[21px] font-semibold leading-normal text-white whitespace-normal line-clamp-2 [text-shadow:-1.5px_-1.5px_0_#000,1.5px_-1.5px_0_#000,-1.5px_1.5px_0_#000,1.5px_1.5px_0_#000]">
                  {startup.name}
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.25 capitalize">
                {industry && (
                  <span
                    key={`${startup.name}-${startup.industry}`}
                    className="inline-flex items-center justify-center py-1.25 px-2.5 rounded border border-accent-green/20 bg-accent-green/15 font-inherit text-caption font-normal leading-normal whitespace-nowrap capitalize text-accent-green"
                  >
                    {industry}
                  </span>
                )}

                {marketModel && (
                  <span
                    key={`${startup.name}-${startup.marketModel}`}
                    className="inline-flex items-center justify-center py-1.25 px-2.5 rounded border border-accent-yellow/20 bg-accent-yellow/15 font-inherit text-caption font-normal leading-normal whitespace-nowrap capitalize text-accent-yellow"
                  >
                    {marketModel}
                  </span>
                )}

                {stage && (
                  <span
                    key={`${startup.name}-${startup.stage}`}
                    className="inline-flex items-center justify-center py-1.25 px-2.5 rounded border border-accent-blue/20 bg-accent-blue/15 font-inherit text-caption font-normal leading-normal whitespace-nowrap capitalize text-accent-blue"
                  >
                    {stage}
                  </span>
                )}
              </div>
            </div>
            {startup.logoUrl && (
              <div className="w-15 h-15 rounded overflow-hidden border-[1.5px] border-black bg-white shrink-0">
                <img
                  src={pb.files.getURL(startup, startup.logoUrl)}
                  alt={startup.logoUrl ?? `${startup.name} logo`}
                  loading="lazy"
                  className="w-full h-full object-contain object-center block"
                />
              </div>
            )}
          </div>
          <div className="px-2.5 pb-2.5">
            <p className="m-0 text-secondary font-body leading-normal line-clamp-2">{startup.shortDescription}</p>
          </div>
        </div>
      </article>
    </a>
  );
}