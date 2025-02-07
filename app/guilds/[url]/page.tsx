"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

type PageProps = {
    params: Promise<{ url: string }>;
};

export default function GuildDetails(props: PageProps) {
    const [guild, setGuild] = useState(Object);

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
                return;
            }

            const json = await response.json();
            if (!json.success) {
                // TODO: Implement error handler
                console.error("Error fetching guild:", json.message);
                return;
            }
            setGuild(json.data);
        }

        getGuild();
    });

    return (
        <div className="flex flex-col px-4 sm:w-[90%] w-full mx-auto container mt-4">
            <div className="flex flex-col gap-4 select-none">
                <div className="flex flex-row gap-1 items-center">
                    <Image
                        src={"https://minotar.net/helm/" + guild.owner_nickname + "/25.png"}
                        alt={guild.owner_nickname}
                        width={25}
                        height={25}
                        quality={100}
                    />
                    <h1>{guild.owner_nickname}</h1>
                </div>
                <h1 className="text-3xl font-bold">{guild.name}</h1>
                <p>{guild.description}</p>
            </div>


            <div className="mt-8"> {/* Added margin top */}
                <ul className="list-inside list-disc">
                    {guild.is_recruit ? (
                        <li>Принимает заявки</li>
                    ) : (
                        <li>Не принимает заявки</li>
                    )}
                    {guild.discord_code && (
                        <li>Есть Discord сервер: <Link href={`https://discord.gg/${guild.discord_code}`} target="_blank" rel="noopener noreferrer">{guild.discord_code}</Link></li>
                    )}
                    <li>Создана {new Date(guild.create_date).toLocaleString("ru-RU")}</li>
                    <li>{guild.member_count} участников</li>
                </ul>
            </div>

            {guild.members && guild.members.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold">Участники</h2>
                    <ul className="list-inside list-disc">
                        {guild.members.map((member: any) => (
                            <li key={member.uid}>{member.nickname}</li> // Make sure members have unique IDs
                        ))}
                    </ul>
                </div>
            )}
            <div className="mt-8">
                <Link href="/guilds" className={buttonVariants({
                    variant: "accent",
                    className: "px-2",
                    size: "sm",
                })}>Назад к списку гильдий</Link>
            </div>
        </div>
    );
}