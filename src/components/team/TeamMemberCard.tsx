import { ArrowUpRight } from "lucide-react";
import type { TeamData } from "./types";

interface Props {
    team_member: TeamData;
}

export default function TeamMemberCard({ team_member }: Props) {
    // Format the start date safely if it exists
    const formattedDate = team_member.startDate
        ? new Date(team_member.startDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
        : null;

    return (
        <article className="flex flex-col w-full min-w-0 rounded border-2 border-stroke bg-black transition duration-150 ease-out hover:-translate-y-0.5">

            {/* Profile Image */}
            <div className="relative h-37.5 shrink-0 overflow-hidden -mb-5.75">
                {team_member.image ? (
                    <img
                        src={team_member.image}
                        alt={team_member.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-center block"
                    />
                ) : (
                    <div className="w-full h-full bg-stroke flex items-center justify-center text-secondary">
                        No Image
                    </div>
                )}
                <div className="absolute inset-0 bg-linear-to-b from-black/15 to-black/50"></div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2.5 p-2.5 z-10 relative">
                <div className="flex flex-row gap-2.5 min-w-0 items-start justify-between">
                    <div className="flex flex-col min-w-0 flex-1">

                        {team_member.position && (
                            <div className="flex items-center justify-between font-accent text-primary -mb-2">
                                <span>{team_member.position}</span>
                            </div>
                        )}
                        <div className="min-w-0">
                            <h3 className="m-0 font-accent text-3xl leading-normal text-white whitespace-normal line-clamp-2">
                                {team_member.title}
                            </h3>
                        </div>

                        {/* {formattedDate && (
                            <div className="flex flex-wrap gap-1.25 px-2.5 text-secondary">
                                <time dateTime={new Date(team_member.startDate!).toISOString()}>
                                    Joined {formattedDate}
                                </time>
                            </div>
                        )} */}
                    </div>
                </div>

                <div className="flex flex-row gap-2 mt-2">
                    <div className="flex flex-col gap-4 space-between mt-1">
                        <a
                            href={team_member.coffeeChatLink ?? `mailto:${team_member.email}`}
                            className="inline-flex items-center gap-2 px-2 py-1 text-base font-inherit text-primary bg-transparent border-2 border-primary rounded transition duration-150 ease-out cursor-pointer hover:bg-primary hover:text-bg"
                        >
                            Contact
                            <ArrowUpRight size={18} />
                        </a>

                    </div>
                </div>

            </div>
        </article>
    );
}