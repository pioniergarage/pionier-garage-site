import { useEffect, useState } from "react";
import type { StartupDetailData, StartupItem } from "./types";
import StartupExplorer from "./StartupExplorer";
import StartupDetail from "./StartupDetail";
import { pb } from "../../lib/pocketbase";

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

        if (!id) {
            setStartup(undefined);
            return;
        }

        try {
            // Call the custom PocketBase proxy route using the PB SDK
            // This automatically includes the user's auth token if they are logged in
            const startup_raw = await pb.send(`/api/pitchload/startups/${id}`, {
                method: 'GET'
            });
            
            const details = startup_raw.data as StartupDetailData;
            setStartup(details);
            
        } catch (err) {
            console.error("Failed to fetch startup details:", err);
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
