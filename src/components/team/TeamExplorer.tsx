
import Grid from "../ui/Grid";
import type { TeamData } from "./types";
import TeamMemberCard from "./TeamMemberCard";
import type { Locale } from "../../utils/i18n";

interface Props {
    team_members: TeamData[]
    locale: Locale
}

export default function TeamExplorer({team_members, locale, showContact = true }: Props) {
    return (
        <Grid
            items={team_members}
            keyExtractor={(team_member) => `${team_member.title}-${team_member.email}`}
            card={(team_member) => <TeamMemberCard team_member={team_member} locale={locale} showContact={showContact} />}
        />
    );
}
