"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/notify-alert";
import { Crown } from "lucide-react";
import {GuildSkeleton} from "@/components/skelets/guilds";

export default function Guilds() {
    const [guilds, setGuilds] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [notifyMessage, setNotifyMessage] = useState('');
    const [notifyType, setNotifyType] = useState('');
    const [pageLoaded, setPageLoaded] = useState(false);

    // Функция для получения данных о гильдиях
    const fetchGuilds = async () => {
        try {
            const response = await fetch("/api/v1/guilds", {
                method: "GET"
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData);
                setNotifyMessage(`Произошла ошибка при загрузке гильдий`);
                setNotifyType('error');
                setGuilds([]);
                setPageLoaded(true);
                return;
            }

            const json = await response.json();
            const sortedGuilds = json.data.sort((a:any, b:any) => b.member_count - a.member_count);

            setGuilds(sortedGuilds);
            setPageLoaded(true);
        } catch (error) {
            console.error('Ошибка при загрузке гильдий:', error);

            setNotifyMessage(`Произошла ошибка при загрузке гильдий`);
            setNotifyType('error');

            setGuilds([]);
            setPageLoaded(true);
        }
    };

    // Инициализация и настройка интервала обновления
    useEffect(() => {
        fetchGuilds();

        const intervalId = setInterval(() => {
            fetchGuilds();
        }, 15000);

        return () => clearInterval(intervalId);
    }, []);

    // Фильтрация гильдий по поисковому запросу
    const filteredGuilds = () => {
        if (!searchQuery) {
            return guilds;
        }
        return guilds.filter((guild:any) =>
            guild.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const handleClose = () => {
        setNotifyMessage('');
    };

    if (guilds.length == 0 || !pageLoaded) {
        return (
            <div className="flex flex-col px-4 w-full mx-auto sm:w-[95%]">
                {notifyMessage && (
                    <ErrorMessage
                        message={notifyMessage}
                        onClose={handleClose}
                        type={notifyType}
                    />
                )}
                <div className="flex mt-4 flex-col gap-4 select-none">
                    <h1 className="text-3xl font-bold dark:text-white text-black">Гильдии</h1>
                    <div className="sm:w-62 w-full h-10 bg-gray-300 dark:bg-neutral-700 rounded-lg"></div>
                    <div className="w-40 h-10 bg-gray-300 dark:bg-neutral-700 rounded-lg"></div>
                </div>
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-8 mb-4">
                    <GuildSkeleton />
                    <GuildSkeleton />
                    <GuildSkeleton />
                    <GuildSkeleton />
                    <GuildSkeleton />
                    <GuildSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col px-4 py-2 w-full mx-auto sm:w-[95%]">
            {notifyMessage && (
                <ErrorMessage
                    message={notifyMessage}
                    onClose={handleClose}
                    type={notifyType}
                />
            )}
            <div className="flex flex-col gap-4 select-none">
                <h1 className="text-3xl font-bold dark:text-white text-black">Гильдии</h1>
                <input
                    className="sm:w-fit p-3 border rounded-lg outline-none
                dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 dark:text-white
                bg-white text-black
                placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                    type="text"
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Поиск"
                    value={searchQuery}
                />
                <Link
                    href="/guilds/create"
                    className="sm:w-fit bg-[#F38F54] hover:bg-orange-400 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                >
                    Создать гильдию
                </Link>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-8 mb-4">
                {filteredGuilds().map((guild:any) => (
                    <div
                        key={guild.url}
                        id={guild.url}
                        className='flex flex-col justify-between gap-4 items-start border-2 rounded-lg py-6 px-4
                    dark:bg-neutral-800 dark:border-zinc-700 dark:hover:border-[#F38F54]
                    bg-white border-zinc-200 hover:border-[#F38F54]
                    transition-all duration-300 shadow-md hover:shadow-lg w-full'
                    >
                        <div className='flex flex-col gap-3 w-full'>
                            <div className="flex flex-row gap-2 items-center">
                                <Image
                                    src={`https://minotar.net/helm/${guild.owner_nickname}/150.png`}
                                    alt={guild.owner_nickname}
                                    width={30}
                                    height={30}
                                    quality={100}
                                    className={'overflow-hidden rounded-lg'}
                                />
                                <div className={'flex gap-1 items-center'}>
                                    {guild.hasFoxPlus && <Crown className={'text-orange-400 w-5 h-5'}/>}
                                    <h1 className="font-semibold text-lg dark:text-white text-black">
                                        {guild.owner_nickname}
                                    </h1>
                                </div>
                            </div>
                            <div className="grid grid-cols-[1fr_.3fr] gap-3">
                                <div className="space-y-2">
                                    <h1 className='text-2xl font-bold dark:text-white text-black'>{guild.name}</h1>
                                    <p className="text-sm dark:text-zinc-300 text-zinc-700">{guild.info}</p>
                                    <p className="text-sm italic dark:text-zinc-400 text-zinc-500">{guild.description}</p>
                                    <ul className="list-inside list-disc text-sm space-y-1
                                dark:text-zinc-300 text-zinc-700">
                                        {guild.is_recruit ? (
                                            <li className="text-green-400">Принимает заявки</li>
                                        ) : (
                                            <li className="text-red-400">Не принимает заявки</li>
                                        )}
                                        {guild.discord_code && (
                                            <li className="text-blue-400">Есть Discord сервер</li>
                                        )}
                                        <li>Создана {new Date(guild.create_date).toLocaleString("ru-RU")}</li>
                                        <li>{guild.member_count} участников</li>
                                    </ul>
                                </div>
                                {guild.badge_url && (
                                    <Image
                                        src={guild.badge_url}
                                        alt={`Эмблема ${guild.url}`}
                                        width={100}
                                        height={100}
                                        objectFit={'cover'}
                                        quality={100}
                                        className={'rounded-lg overflow-hidden'}
                                    />
                                )}
                            </div>
                        </div>
                            {guild.is_recruit ? (
                                <Link
                                    href={`/guilds/${guild.url}/application`}
                                    className={buttonVariants({
                                        variant: "accent",
                                        className: "px-4 py-2 w-full sm:w-auto dark:text-white text-black",
                                        size: "sm",
                                    })}
                                >
                                    Подать заявку
                                </Link>
                            ) : ""}
                    </div>
                ))}
            </div>
        </div>
    );
}