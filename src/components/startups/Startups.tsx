import { useEffect, useState } from "react";
import type { StartupDetailData, StartupItem } from "./types";
import StartupExplorer from "./StartupExplorer";
import StartupDetail from "./StartupDetail";

export interface Props {
    startups: StartupItem[];
    locale?: "de" | "en";
}

export default function Startups({ startups, locale = "en" }: Props) {

    const [startup, setStartup] = useState<StartupDetailData | undefined>(undefined);
    useEffect(() => {
        // 1. Move the fetch logic inside a dedicated handler
        const handleHashChange = async () => {
            const id = window.location.hash.slice(1);

            // If there is no hash (user went back to main list), clear state
            if (!id) {
                setStartup(undefined);
                return;
            }

            try {
                const pitchloadUrl = import.meta.env.PUBLIC_PITCHLOAD_URL;
                const token = import.meta.env.PUBLIC_PITCHLOAD_AUTH_TOKEN;
                const detailUrl = `${pitchloadUrl}/startups/${id}/details`;

                const res = await fetch(detailUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

                const startup_raw = await res.json();
                const details = startup_raw.data as StartupDetailData;

                setStartup(details);
            } catch (err) {
                console.error(err);
                setStartup(undefined);
            }
        };

        // 2. Call it immediately on mount to check initial URL
        handleHashChange();

        // 3. Set up an event listener to catch future hash changes
        window.addEventListener("hashchange", handleHashChange);

        // 4. Clean up the listener when the component unmounts
        return () => {
            window.removeEventListener("hashchange", handleHashChange);
        };
    }, []);

    return (startup != undefined ? <StartupDetail startup={startup} /> : <StartupExplorer startups={startups} locale={locale} />)
}
