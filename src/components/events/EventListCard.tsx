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

  const { day, month } = getEventDateParts(event.date, locale);

  const href = event.eventUrl?.trim() || "#";
  const hasExternalUrl = href !== "#";

  return (
    <a
      href={href}
      {...(hasExternalUrl ? { target: "_blank", rel: "noreferrer" } : {})}
      className="block min-w-0"
    >
      <article className="flex w-full min-w-0 flex-col overflow-hidden rounded border-2 border-stroke bg-black transition duration-150 ease-out hover:-translate-y-[2px]">
        <div className="relative -mb-[23px] h-[150px] shrink-0 overflow-hidden">
          {event.headerImageUrl ? (
            <>
              <img src={pb.files.getURL(event, event.headerImageUrl)} alt="" loading="lazy" className="block h-full w-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/15 to-black/50"></div>
            </>
          ) : (
            <div className="h-full w-full bg-gradient-to-b from-[#22252c] to-black"></div>
          )}
        </div>

        <div className="relative flex flex-col gap-2.5 p-2.5">
          <div className="flex flex-row justify-between gap-2">
            <div className="flex min-w-0 flex-col justify-start gap-2">
              <h1 className="m-0 line-clamp-2 whitespace-normal font-display text-[21px] font-semibold leading-normal text-white [text-shadow:-1.5px_-1.5px_0_black,1.5px_-1.5px_0_black,-1.5px_1.5px_0_black,1.5px_1.5px_0_black]">{title}</h1>
              <div className="flex flex-wrap gap-1.5 capitalize" aria-label="Event tags">
                {location && <span className="inline-flex items-center justify-center whitespace-nowrap rounded border border-accent-yellow/20 bg-accent-yellow/15 px-2.5 py-1.5 font-inherit text-[14px] font-normal leading-normal text-accent-yellow capitalize">{location}</span>}
                {duration && <span className="inline-flex items-center justify-center whitespace-nowrap rounded border border-accent-blue/20 bg-accent-blue/15 px-2.5 py-1.5 font-inherit text-[14px] font-normal leading-normal text-accent-blue capitalize">{duration}</span>}
                {event.freeEvent && <span className="inline-flex items-center justify-center whitespace-nowrap rounded border border-accent-pink/20 bg-accent-pink/15 px-2.5 py-1.5 font-inherit text-[14px] font-normal leading-normal text-accent-pink capitalize">{labels.free}</span>}
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
              <p className="m-0 line-clamp-2 overflow-hidden text-ellipsis font-inherit leading-normal text-text-muted">{shortDescription}</p>
            </div>
          )}
        </div>
      </article>
    </a>
  );
}