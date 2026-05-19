import Grid from "../ui/Grid";
import type { StartupItem } from "./types";
import StartupListCard from "./StartupListCard";

export interface Props {
    startups: StartupItem[];
    locale: "de" | "en";
}

export default function StartupExplorer({ startups, locale }: Props) {

    return (<Grid items={startups} keyExtractor={(startup) => startup.name} card={(startup) => <StartupListCard startup={startup} locale={locale} />} />);
}