import Grid from "../ui/Grid";
import EventListCard from "./EventListCard";
import type { EventItem } from "./types";
import { sectionVariants } from "../../styles/style-mapping"; // Added import

export interface Props {
    events: EventItem[];
    locale?: "de" | "en";
    alignment?: "left" | "center" | "right"; // Added standard variant props
    size?: "full" | "half" | "third";
}

export default function EventHighlightComponent({
    events,
    locale = "en",
    alignment = "left",
    size = "full"
}: Props) {
    return (
        <section className={sectionVariants({ alignment, size })}>
            <Grid 
                items={events} 
                keyExtractor={(event) => event.title} 
                card={(event) => <EventListCard event={event} locale={locale} />} 
            />
        </section>
    );
}