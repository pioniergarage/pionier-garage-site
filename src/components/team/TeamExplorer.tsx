
import Grid from "../ui/Grid";
import type { TeamData } from "./types";
import TeamMemberCard from "./TeamMemberCard";

interface Props {
    team_members: TeamData[]
}

export default function TeamExplorer({team_members }: Props) {
    return (
        <Grid
            items={team_members}
            keyExtractor={(team_member) => `${team_member.title}-${team_member.email}`}
            card={(team_member) => <TeamMemberCard team_member={team_member} />}
        />
    );
}