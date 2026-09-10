import Grid from "../ui/Grid";
import type { StartupItem } from "./types";
import StartupListCard from "./StartupListCard";
import type { Locale } from "../../utils/i18n";

export interface Props {
    startups: StartupItem[];
    locale: Locale;
}

export default function StartupExplorer({ startups, locale }: Props) {

    return (<Grid items={startups} keyExtractor={(startup) => startup.name} card={(startup) => <StartupListCard startup={startup} locale={locale} />} />);
}
