import Grid from "../ui/Grid";
import EventListCard from "./EventListCard";
import type { EventItem } from "./types";

export interface Props {
    events: EventItem[];
    locale?: "de" | "en";
}

export default function EventHighlightComponent({
    events,
    locale = "en",
}: Props) {

    return (<Grid items={events} keyExtractor={(event) => event.title} card={(event) => <EventListCard event={event} locale={locale} />} />);
}
