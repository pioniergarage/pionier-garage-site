import { useEffect, useState } from "react"
import { pb } from "../../lib/pocketbase";
import { CheckCircle2, RefreshCcw, TriangleAlertIcon, Logs } from "lucide-react";

interface DeployState {
    project: string;
    message: string;
    created: string;
    success: string;
}

export default function DeployBadge() {
    const [deployState, setDeployState] = useState<Array<DeployState>>([]);

    const [showDetails, setShowDetails] = useState<boolean>(false);

    const handleStateChange = async () => {
        try {
            const timeThreshold = new Date(Date.now() - 60 * 1000);

            const thresholdString = timeThreshold.toISOString();

            const state = (await pb.collection<DeployState>("coolify_logs").getFullList()).reverse();

            console.log(`Pocketbase event log: ${JSON.stringify(state)}`);

            if (state)
                setDeployState(state);
        } catch (err) {
            // PocketBase throws a 404 error if no record matches the query
            console.error(`Pocketbase event log error: ${err}`);
        }
    }

    useEffect(() => {
        handleStateChange();

        const intervalId = setInterval(handleStateChange, 30000);

        return () => clearInterval(intervalId);

    }, []);

    return (
        <>
            {(deployState.length > 0) && new Date(deployState[deployState.length - 1].created) > new Date(Date.now() - 60) && <span
                className={`tag-item tag-item--white`}
            >

                <h2>{deployState[deployState.length - 1].project}</h2>
                <span>{deployState[deployState.length - 1].message} <i>{deployState[deployState.length - 1].created}</i></span>
                {deployState[deployState.length - 1].success ? <CheckCircle2 /> : <TriangleAlertIcon />}
                <button onClick={handleStateChange}><RefreshCcw /></button>
            </span>}
            <button onClick={() => { setShowDetails(!showDetails) }}><Logs /></button>
            {showDetails && <div className="fixed left-5 bottom-20 flex flex-col gap-4 pb-4 overflow-y-scroll max-h-16">
                {deployState.map((item) => (
                    <>
                        <div className="flex flex-row gap-4 items-center">
                            {item.success ? <CheckCircle2 /> : <TriangleAlertIcon />}
                            <div><h2>{item.project}</h2>
                                <span>{item.message}</span>
                                <p><i>{item.created}</i></p>
                            </div>
                            
                        </div>


                    </>
                ))}
            </div>
            }

        </>

    )

    /**
     * 
     */
}