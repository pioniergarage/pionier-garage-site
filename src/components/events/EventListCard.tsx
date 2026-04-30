import { pb } from "../../lib/pocketbase";
import type { EventItem } from "./types";

const translations = {
  de: {
    empty: "Keine passenden Events gefunden.",
    free: "Kostenlos",
    paid: "Kostenpflichtig",
    untitled: "Event",
  },
  en: {
    empty: "No matching events found.",
    free: "Free",
    paid: "Paid",
    untitled: "Event",
  },
} as const;

function formatEventDate(dateValue: Date | string, locale: "de" | "en") {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const hasMidnightTime =
    typeof dateValue === "string"
      ? /\b00:00:00(?:\.0+)?Z?$/.test(dateValue.trim())
      : date.getHours() === 0 &&
      date.getMinutes() === 0 &&
      date.getSeconds() === 0 &&
      date.getMilliseconds() === 0;

  return new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-US", {
    month: "short",
    day: "numeric",
    ...(hasMidnightTime ? {} : { hour: "numeric", minute: "2-digit" }),
  }).format(date);
}

function getEventDateParts(dateValue: Date | string, locale: "de" | "en") {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return { day: "", month: "" };

  const day = date.getDate().toString();
  const month = new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-US", {
    month: "short",
  }).format(date);

  return { day, month };
}

function formatDuration(duration: Number, locale: "de" | "en") {
  const numericDuration = Number(duration);

  if (!Number.isFinite(numericDuration) || numericDuration <= 0) {
    return "";
  }

  return locale === "de"
    ? `${numericDuration} Std.`
    : `${numericDuration} hr`;
}

export default function EventListCard({
  event,
  locale = "en",
}: {
  event: EventItem;
  locale?: "de" | "en";
}) {
  const labels = translations[locale];
  const title = event.title?.trim() || labels.untitled;
  const shortDescription = event.shortDescription?.trim();
  const location = event.location?.trim();
  const duration = formatDuration(event.duration, locale);

  // Get split date parts
  const { day, month } = getEventDateParts(event.date, locale);

  const href = event.eventUrl?.trim() || "#";
  const hasExternalUrl = href !== "#";

  return (
    <a
      href={href}
      {...(hasExternalUrl ? { target: "_blank", rel: "noreferrer" } : {})}
      className="card-anchor"
    >
      <article className="card event-list-card">
        <div className="card__media">
          {event.headerImageUrl ? (
            <>
              <img src={pb.files.getURL(event, event.headerImageUrl)} alt="" loading="lazy" className="card__banner-image" />
              <div className="card__banner-overlay"></div>
            </>
          ) : (
            <div className="card__banner-fallback"></div>
          )}
        </div>

        <div className="card__content">
          <div className="l-row--sm">
            <div className="l-stack--sm">
              <h1 className="card__title">{title}</h1>
              <div className="tag-item-wrapper" aria-label="Event tags">
                {location && <span className="tag-item tag-item--yellow">{location}</span>}
                {duration && <span className="tag-item tag-item--blue">{duration}</span>}
                {event.freeEvent && <span className="tag-item tag-item--pink">{labels.free}</span>}
              </div>
            </div>
            {day && (
              <div className="l-stack center-text">
                <h1>{day}</h1>
                <h3>{month}</h3>
              </div>
            )}
          </div>

          {shortDescription && (
            <div className="card__desc-wrap">
              <p className="card__description">{shortDescription}</p>
            </div>
          )}
        </div>
      </article>
    </a>
  );
}