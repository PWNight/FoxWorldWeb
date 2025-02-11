"use client";
import { useEffect, useState } from "react";
import {useRouter} from "next/navigation";

type PageProps = {
    params: Promise<{ url: string }>;
};

export default function GuildApplication(props: PageProps) {
    const [guild, setGuild] = useState(Object);
    const router = useRouter();

    useEffect(() => {
        async function getGuild() {
            const params = await props.params;
            const guildUrl = params.url;
            const response = await fetch(`/api/v1/guilds/${guildUrl}`, { // Fetch specific guild
                method: "GET"
            });
            if (!response.ok) {
                // TODO: Implement error handler (redirect, show message, etc.)
                console.error("Error fetching guild:", response.status);
                router.push('/guilds')
            }

            const json = await response.json();
            if (!json.success) {
                // TODO: Implement error handler
                console.error("Error fetching guild:", json.message);
                router.push('/guilds');
            }
            setGuild(json.data);
        }

        getGuild();
    });

    return (
        <>
        </>
    );
}