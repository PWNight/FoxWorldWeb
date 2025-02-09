"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";

export default function Guilds() {
    const [guilds, setGuilds] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function getAll() {
            const response = await fetch("/api/v1/guilds", {
                method: "GET"
            });
            if (!response.ok) {
                // TODO: Implement error handler
                return;
            }

            const json = await response.json();
            if (!json.success) {
                // TODO: Implement error handler
                return;
            }
            setGuilds(json.data);
        }
        getAll();
    }, []);

    const filteredGuilds = () => {
        if (!searchQuery) {
            return guilds;
        }
        return guilds.filter((guild: any) => guild.name.toLowerCase().includes(searchQuery.toLowerCase()));
    };

    if (guilds.length === 0) {
        return <></>;
    } else {
        return (
            <div className="flex flex-col min-h-screen px-4 sm:w-[90%] w-full mx-auto container">
                <div className="flex mt-4 flex-col gap-4 select-none">
                    <h1 className="text-3xl font-bold">Гильдии</h1>
                    <input
                        className="p-3 border border-gray-600 rounded-lg outline-none"
                        type="text"
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Поиск"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                    {filteredGuilds().map((guild: any) => (
                        <div key={guild.url} id={guild.url}
                             className='flex flex-col justify-between gap-2 items-start border-2 rounded-md py-5 px-3 bg-accent hover:border-[#F38F54] transition-all sm:w-fit'>
                            <div className='flex flex-col gap-2'>
                                <div className="flex flex-row gap-1 items-center">
                                    <Image
                                        src={"https://minotar.net/helm/" + guild.owner_nickname + "/25.png"}
                                        alt={guild.owner_nickname}
                                        width={25}
                                        height={25}
                                        quality={100}
                                        className={'rounded-md overflow-hidden'}
                                    />
                                    <h1>{guild.owner_nickname}</h1>
                                </div>
                                <div className="flex flex-row gap-1">
                                    <div>
                                        <h1 className='text-3xl'>{guild.name}</h1>
                                        <p>{guild.info}</p>
                                        <ul className="list-inside list-disc">
                                            {guild.is_recruit ? (
                                                <li>Принимает заявки</li>
                                            ) : (
                                                <li>Не принимает заявки</li>
                                            )}
                                            {guild.discord_code && (
                                                <li>Есть Discord сервер</li>
                                            )}
                                            <li>Создана {new Date(guild.create_date).toLocaleString("ru-RU")}</li>
                                           <li>{guild.member_count} участников</li>
                                        </ul>
                                    </div>
                                    <Image
                                      src={`/guilds/badges/g_${guild.id}.png`}
                                      alt={`Банер ${guild.url}`}
                                      height={200}
                                      width={150}
                                      quality={100}
                                      className={'rounded-md overflow-hidden'}
                                    />
                                </div>
                            </div>
                            <div className='flex sm:flex-row flex-col w-full gap-5 mt-4'> {/* Added margin-top */}
                                <Link href={'/guilds/' + guild.url}
                                      className={buttonVariants({
                                          variant: "accent",
                                          className: "px-4 py-2", // Adjusted padding
                                          size: "sm",
                                      })}>Открыть страницу
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}