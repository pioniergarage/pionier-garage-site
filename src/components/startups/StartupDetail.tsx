import { ArrowLeft } from "lucide-react";
import { formatStartupTaxonomyLabel } from "../../utils/startupTaxonomy";
import type { StartupDetailData } from "./types";

export interface Props {
  startup: StartupDetailData;
}

type DetailRow = {
  label: string;
  value: string;
  href?: string;
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
  // console.log("Startup detail")
  // console.log(JSON.stringify(startup));
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
    { label: "Branche", value: industry },
    {
      label: "Web",
      value: 'View on Pitchload',
      href: `https://pitchload.net/startups/${startup.id}`, //Once pitchload implements URL-sanitization: website ? buildWebsiteUrl(website) : undefined
    },
  ].filter((row) => row.value);

  const tags = [
    industry ? { tone: "green", label: industry } : null,
    marketModel ? { tone: "yellow", label: marketModel } : null,
    stage ? { tone: "blue", label: stage } : null,
  ].filter(Boolean) as { tone: "green" | "yellow" | "blue"; label: string }[];

  return (
    <div className="startup-detail">
      <a href={'startups'} className='button-icon'><ArrowLeft /></a>
      <section className="startup-detail" aria-label={`${name} details`}>

        <div className="startup-detail__hero-frame">

          {headerImageUrl ? (
            <div className="startup-detail__hero">
              <img
                className="startup-detail__hero-image"
                src={headerImageUrl}
                alt="banner image"
              />
              <div className="startup-detail__hero-overlay" aria-hidden="true" />
            </div>
          ) : (<></>)}

        </div>

        <div className="startup-detail__identity">
          <div className="startup-detail__logo-wrap">
            {logoUrl ? (
              <img
                className="startup-detail__logo"
                src={logoUrl}
                alt={`${name} logo`}
              />
            ) : (
              <span className="startup-detail__logo-fallback" aria-hidden="true">
                {getInitials(name)}
              </span>
            )}
          </div>

          <div className="startup-detail__heading">
            <h1 className="startup-detail__title">{name}</h1>

            {tags.length > 0 && (
              <div className="tag-item-wrapper" aria-label="Startup tags">
                {tags.map((tag) => (
                  <span
                    key={`${tag.tone}-${tag.label}`}
                    className={`tag-item tag-item--${tag.tone}`}
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
            className="startup-detail__description"
            dangerouslySetInnerHTML={{ __html: richDescription }}
          />
        )}

        <div className="startup-detail__info-grid">
          {productRows.length > 0 && (
            <article className="startup-detail__card">
              <h2 className="startup-detail__card-title">Unser Produkt</h2>
              <dl className="startup-detail__meta-list">
                {productRows.map((row) => (
                  <div className="startup-detail__meta-row" key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          )}

          {companyRows.length > 0 && (
            <article className="startup-detail__card">
              <h2 className="startup-detail__card-title">Unser Unternehmen</h2>
              <dl className="startup-detail__meta-list">
                {companyRows.map((row) => (
                  <div className="startup-detail__meta-row" key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>
                      {row.href ? (
                        <a
                          className="startup-detail__link"
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
              </dl>
            </article>
          )}
        </div>
      </section>
    </div>

  );
}
