import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { formatStartupTaxonomyLabel } from "../../utils/startupTaxonomy";
import type { StartupDetailData } from "./types";
import { sectionVariants } from "../../utils/style-mapping";

export interface Props {
  startup: StartupDetailData;
}

type DetailRow = {
  label: string;
  value: string;
  href?: string;
};

const tagStyles = {
  green: "text-accent-green bg-accent-green/15 border-bg-accent-green/20",
  yellow: "text-accent-yellow bg-accent-yellow/15 border-accent-yellow/20",
  blue: "text-accent-blue bg-accent-blue/15 border-accent-blue/20",
};


function toDisplayValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function pickDisplayValue(...values: unknown[]): string {
  for (const value of values) {
    const displayValue = toDisplayValue(value);
    if (displayValue) return displayValue;
  }
  return "";
}

function buildWebsiteUrl(value: string): string {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

function getInitials(name: string): string {
  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) return "?";
  return parts.map((part) => part.charAt(0).toUpperCase()).join("");
}

function normalizeRichText(html: string): string {
  return html
    .replace(/<p>\s*(?:&nbsp;|\u00A0)?\s*<\/p>/gi, "")
    .trim();
}

export default function StartupDetail({ startup }: Props) {
  const company = startup.ourCompany ?? {};
  const product = startup.ourProduct ?? {};

  const name = pickDisplayValue(startup.name) || "Startup";
  const description = pickDisplayValue(startup.longDescription, startup.shortDescription);
  const richDescription = description ? normalizeRichText(description) : "";
  const headerImageUrl = pickDisplayValue(startup.headerImageUrl);
  const logoUrl = pickDisplayValue(startup.logoUrl);

  const industry = formatStartupTaxonomyLabel(
    pickDisplayValue(startup.industry, company.industry),
  );
  const marketModel = formatStartupTaxonomyLabel(pickDisplayValue(
    startup.marketModel,
    product.marketModel,
    product.goToMarketModel,
    company.businessReadinessLevel,
  ));
  const stage = formatStartupTaxonomyLabel(pickDisplayValue(
    startup.stage,
    product.stage,
    product.productReadinessLevel,
  ));
  const productType = formatStartupTaxonomyLabel(pickDisplayValue(
    startup.productType,
    product.productType,
    product.technologyReadinessLevel,
  ));

  const foundingYear = pickDisplayValue(
    startup.foundingYear,
    startup.foundedYear,
    company.foundingYear,
    company.foundedYear,
    company.yearFounded,
  );
  const founders = pickDisplayValue(startup.founders, company.founders);
  const employees = pickDisplayValue(startup.employees, company.employees);
  const region = pickDisplayValue(
    startup.region,
    startup.location,
    startup.headquarters,
    company.region,
    company.location,
    company.headquarters,
  );
  const website = pickDisplayValue(
    startup.website,
    startup.web,
    company.website,
    company.web,
  );

  const productRows: DetailRow[] = [
    { label: "Stage", value: stage },
    { label: "Go To Market Model", value: marketModel },
    { label: "Product Type", value: productType },
  ].filter((row) => row.value);

  const pitchloadUrl = import.meta.env.PUBLIC_PITCHLOAD_URL;

  const companyRows: DetailRow[] = [
    { label: "Gründungsjahr", value: foundingYear },
    { label: "Gründer", value: founders },
    { label: "Mitarbeiter", value: employees },
    { label: "Region", value: region },
    { label: "Branche", value: industry }
  ].filter((row) => row.value);

  const tags = [
    industry ? { tone: "green", label: industry } : null,
    marketModel ? { tone: "yellow", label: marketModel } : null,
    stage ? { tone: "blue", label: stage } : null,
  ].filter(Boolean) as { tone: "green" | "yellow" | "blue"; label: string }[];

  return (
    <div className="w-[min(100%,1120px)] mx-auto py-6 pt-2.5 text-text max-lg:pt-4">
      <a
        href="startups"
        className="inline-flex items-center justify-center font-inherit text-text p-2.5 rounded w-13 h-13 border-2 border-text transition duration-150 ease-out cursor-pointer bg-transparent hover:bg-text hover:text-bg mb-4"
      >
        <ArrowLeft />
      </a>

      {/* Merging your CVA sectionVariants with the detail-specific layout needs */}
      <section
        className={`${sectionVariants({ alignment: "left", size: "full" })} block!`}
        aria-label={`${name} details`}
      >
        <div className="relative">
          {headerImageUrl && (
            <div className="relative rounded overflow-hidden bg-[#111] border-[5px] border-black">
              <img
                className="w-full h-full max-h-75 block object-cover object-center"
                src={headerImageUrl}
                alt="banner image"
              />
              <div className="absolute inset-0 bg-linear-to-b from-black/15 to-black/50" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="flex gap-4.5 -mt-5.5 px-6 relative z-10 max-sm:items-start max-sm:gap-3.5 max-sm:-mt-4.5">
          <div className="w-18 h-18 rounded overflow-hidden border-[3px] border-black bg-white flex-none flex items-center justify-center shadow-[0_10px_26px_rgba(0,0,0,0.26)] max-sm:w-16 max-sm:h-16">
            {logoUrl ? (
              <img
                className="w-full h-full object-contain object-center block"
                src={logoUrl}
                alt={`${name} logo`}
              />
            ) : (
              <span className="flex items-center justify-center text-[#151515] font-display text-[1.35rem] font-bold" aria-hidden="true">
                {getInitials(name)}
              </span>
            )}
          </div>

          <div className="min-w-0 flex flex-col gap-2.5 pb-1.5">
            <h1 className="m-0 font-display tracking-tight text-white [text-shadow:-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000,2px_2px_0_#000]">
              {name}
            </h1>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.25 capitalize" aria-label="Startup tags">
                {tags.map((tag) => (
                  <span
                    key={`${tag.tone}-${tag.label}`}
                    className={`inline-flex items-center justify-center py-1.25 px-2.5 rounded border border-transparent font-inherit text-caption font-normal leading-normal whitespace-nowrap capitalize ${tagStyles[tag.tone]}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {richDescription && (
          <div
            // Hardcoded child combinators for rich text — consider replacing with Tailwind Typography plugin
            className="max-w-245 mt-4.5 mx-0 px-6 text-white/90 font-normal text-base leading-[1.45] font-body max-md:px-4 [&>p]:mb-4 [&>ul]:mb-4 [&>ol]:mb-4 [&>ul]:pl-6 [&>ol]:pl-6 [&_li+li]:mt-1.5 [&_a]:text-white [&_a]:underline [&_a]:decoration-white/45 [&_a]:underline-offset-2 [&_strong]:text-white [&_b]:text-white [&_em]:italic [&_i]:italic"
            dangerouslySetInnerHTML={{ __html: richDescription }}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 items-start mt-6 px-3 max-md:px-0">
          {productRows.length > 0 && (
            <article className="rounded border border-stroke bg-black/80 shadow-[0_14px_34px_rgba(0,0,0,0.2)] py-4.5 px-4 pb-3.5 max-sm:px-3.5 max-sm:py-4">
              <h2 className="m-0 mb-3.5 font-bold text-[1.55rem] leading-[1.1] font-display max-sm:text-xl">Unser Produkt</h2>
              <dl className="m-0 grid gap-3">
                {productRows.map((row) => (
                  <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-1 sm:gap-5 items-baseline" key={row.label}>
                    <dt className="m-0 text-white/80">{row.label}</dt>
                    <dd className="m-0 text-white text-left sm:text-right wrap-break-word">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          )}

          {companyRows.length > 0 && (
            <article className="rounded border border-stroke bg-black/80 shadow-[0_14px_34px_rgba(0,0,0,0.2)] py-4.5 px-4 pb-3.5 max-sm:px-3.5 max-sm:py-4">
              <h2 className="m-0 mb-3.5 font-bold text-[1.55rem] leading-[1.1] font-display max-sm:text-xl">Unser Unternehmen</h2>
              <dl className="m-0 grid gap-3">
                {companyRows.map((row) => (
                  <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-1 sm:gap-5 items-baseline" key={row.label}>
                    <dt className="m-0 text-white/80">{row.label}</dt>
                    <dd className="m-0 text-white text-left sm:text-right wrap-break-word">
                      {row.href ? (
                        <a
                          className="text-inherit font-bold no-underline hover:underline focus-visible:underline"
                          href={row.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {row.value}
                        </a>
                      ) : (
                        row.value
                      )}
                    </dd>
                  </div>
                ))}
                <dd className="m-0 text-white font-body text-left sm:text-right wrap-break-word">
                  <a
                    href={`https://pitchload.net/startups/${startup.id}`}
                    target="_blank"             // Opens the link in a new tab
                    rel="noopener noreferrer"   // Security safeguard for blank targets
                    className="inline-flex items-center gap-2 px-2 py-1 font-body bg-transparent border-2 border-text rounded transition duration-150 ease-out cursor-pointer hover:bg-text hover:text-bg"
                  >
                    Visit on Pitchload
                    <ArrowUpRight size={18} />
                  </a>
                </dd>
              </dl>
            </article>
          )}
        </div>
      </section>
    </div>
  );
}

