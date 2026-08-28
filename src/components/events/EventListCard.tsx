import { pb } from "../../lib/pocketbase";
import type { EventItem } from "./types";
import { getLocaleTag, type Locale } from "../../utils/i18n";

const translations = {
  de: {
    empty: "Keine passenden Events gefunden.",
    free: "Kostenlos",
    paid: "Kostenpflichtig",
    untitled: "Event",
    tagsAriaLabel: "Event-Kategorien",
  },
  en: {
    empty: "No matching events found.",
    free: "Free",
    paid: "Paid",
    untitled: "Event",
    tagsAriaLabel: "Event tags",
  },
  fr: {
    empty: "Aucun événement correspondant.",
    free: "Gratuit",
    paid: "Payant",
    untitled: "Événement",
    tagsAriaLabel: "Catégories de l’événement",
  },
} as const;

function getEventDateParts(dateValue: Date | string, locale: Locale) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return { day: "", month: "" };

  const day = date.getDate().toString();
  const month = new Intl.DateTimeFormat(getLocaleTag(locale), {
    month: "short",
  }).format(date);

  return { day, month };
}

function formatDuration(duration: Number, locale: Locale) {
  const numericDuration = Number(duration);

  if (!Number.isFinite(numericDuration) || numericDuration <= 0) {
    return "";
  }

  const formattedDuration = new Intl.NumberFormat(getLocaleTag(locale)).format(
    numericDuration,
  );

  if (locale === "de") return `${formattedDuration} Std.`;
  if (locale === "fr") return `${formattedDuration} h`;
  return `${formattedDuration} hr`;
}

export default function EventListCard({
  event,
  locale = "en",
}: {
  event: EventItem;
  locale?: Locale;
}) {
  const labels = translations[locale];
  const title = event.title?.trim() || labels.untitled;
  const shortDescription = event.shortDescription?.trim();
  const location = event.location?.trim();
  const duration = formatDuration(event.duration, locale);

  const { day, month } = getEventDateParts(event.date, locale);

  const href = event.eventUrl?.trim() || "#";
  const hasExternalUrl = href !== "#";
  const event_header_url = pb.files.getURL(event, event.headerImageUrl);

  return (
    <a
      href={href}
      {...(hasExternalUrl ? { target: "_blank", rel: "noreferrer" } : {})}
      className="block min-w-0"
    >
      <article className="flex w-full min-w-0 flex-col overflow-hidden rounded border-2 border-stroke bg-black transition duration-150 ease-out hover:-translate-y-0.5">
        <div className="relative -mb-5.75 h-37.5 shrink-0 overflow-hidden">
          {event_header_url ? (
            <>
              <img src={event_header_url} alt="" loading="lazy" className="block h-full w-full object-cover object-center" />
              <div className="absolute inset-0 bg-linear-to-b from-black/15 to-black/50"></div>
            </>
          ) : (
            <div className="h-full w-full bg-linear-to-b from-[#22252c] to-black"></div>
          )}
        </div>

        <div className="relative flex flex-col gap-2.5 p-2.5">
          <div className="flex flex-row justify-between gap-2">
            <div className="flex min-w-0 flex-col justify-start gap-2">
              <h1 className="m-0 line-clamp-2 whitespace-normal font-display text-[21px] font-semibold leading-normal text-white [text-shadow:-1.5px_-1.5px_0_black,1.5px_-1.5px_0_black,-1.5px_1.5px_0_black,1.5px_1.5px_0_black]">{title}</h1>
              <div className="flex flex-wrap gap-1.5 capitalize" aria-label={labels.tagsAriaLabel}>
                {location && <span className="inline-flex items-center justify-center whitespace-nowrap rounded border border-accent-yellow/20 bg-accent-yellow/15 px-2.5 py-1.5 font-inherit text-caption font-normal leading-normal text-accent-yellow capitalize">{location}</span>}
                {duration && <span className="inline-flex items-center justify-center whitespace-nowrap rounded border border-accent-blue/20 bg-accent-blue/15 px-2.5 py-1.5 font-inherit text-caption font-normal leading-normal text-accent-blue capitalize">{duration}</span>}
                {event.freeEvent && <span className="inline-flex items-center justify-center whitespace-nowrap rounded border border-accent-pink/20 bg-accent-pink/15 px-2.5 py-1.5 font-inherit text-caption font-normal leading-normal text-accent-pink capitalize">{labels.free}</span>}
              </div>
            </div>
            {day && (
              <div className="flex shrink-0 flex-col justify-start text-center">
                <h1 className="text-white m-0">{day}</h1>
                <h3 className="text-white m-0">{month}</h3>
              </div>
            )}
          </div>

          {shortDescription && (
            <div className="px-2.5 pb-2.5">
              <p className="m-0 line-clamp-2 overflow-hidden text-ellipsis font-inherit leading-normal text-primary-muted">{shortDescription}</p>
            </div>
          )}
        </div>
      </article>
    </a>
  );
}
