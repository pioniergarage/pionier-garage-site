import { localized } from "../../utils/utils";
import type { TeamData } from "./types";

interface Props {
    team_member: TeamData;
    locale: "de" | "en";
}

const translations = {
    de: {
        talkTo: (name: string) => `Sprich mit ${name}`,
    },
    en: {
        talkTo: (name: string) => `Talk to ${name}`,
    },
} as const;

export default function TeamMemberCard({ team_member, locale }: Props) {
    const t = translations[locale];
    const firstName = team_member.title?.split(" ")[0] ?? team_member.title;

    return (
        <article className="flex flex-col gap-3">

            {/* Profile Image */}
            <div className="relative w-full max-w-[300px] shrink-0 overflow-hidden rounded">
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
            </div>

            {/* Name & Position */}
            <div className="flex flex-col px-2 -mt-19 z-2">
                {team_member.position && (
                    <span className="font-accent text-lg leading-tight">
                        {team_member.position}
                    </span>
                )}
                <h3 className="m-0 font-accent text-3xl leading-tight text-white whitespace-normal line-clamp-2">
                    {team_member.title}
                </h3>
            </div>

            {/* Contact Button */}
            <a
                href={localized(team_member.coffeeChatLink || `mailto:${team_member.email}`, locale)}
                className="w-full text-center px-4 py-3 text-lg font-accent text-white bg-transparent border-2 border-primary rounded cursor-pointer transition duration-150 ease-out hover:bg-primary hover:text-bg hover:border-primary"
            >
                {t.talkTo(firstName)}
            </a>
        </article>
    );
}
