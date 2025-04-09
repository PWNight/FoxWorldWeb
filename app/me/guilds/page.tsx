"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Crown, SearchX } from "lucide-react";
import { getAllMyGuilds, getSession } from "@/app/actions/getDataHandlers";
import ErrorMessage from "@/components/ui/notify-alert";
import {GuildSkeleton} from "@/components/skelets/guilds";

export default function MeGuilds() {
    const [userGuilds, setUserGuilds] = useState([]);

    const [notifyMessage, setNotifyMessage] = useState('');
    const [notifyType, setNotifyType] = useState('');

    const [pageLoaded, setPageLoaded] = useState(false);

    const router = useRouter();

    useEffect(() => {
        getSession().then(async r => {
            if (!r.success) {
                router.push("/login?to=me/guilds");
                return;
            }

            const myGuildsResult = await getAllMyGuilds(r.data.token)
            if (!myGuildsResult.success) {
                setNotifyMessage(`Произошла ошибка при загрузке списка гильдий`);
                setNotifyType('error');
                return;
            }

            setUserGuilds(myGuildsResult.data || []);
            setPageLoaded(true);
        });
    }, [router]);

    const handleClose = () => setNotifyMessage('');

    if (!pageLoaded) {
        return (
            <div className="flex flex-col px-2 w-full">
                {notifyMessage && <ErrorMessage message={notifyMessage} onClose={handleClose} type={notifyType} />}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Мои гильдии</h1>
                    <Link
                        href="/guilds/create"
                        className={buttonVariants({
                            size: 'sm',
                            variant: 'accent',
                            className: "w-full sm:w-auto px-4 py-2 bg-[#F38F54] hover:bg-[#e07b44] text-white"
                        })}
                    >
                        Создать гильдию
                    </Link>
                </div>
                <div className="grid gap-2 grid-cols-1 xl:grid-cols-2">
                    <GuildSkeleton />
                    <GuildSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-2">
            {notifyMessage && <ErrorMessage message={notifyMessage} onClose={handleClose} type={notifyType} />}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Мои гильдии</h1>
                <Link
                    href="/guilds/create"
                    className={buttonVariants({
                        size: 'sm',
                        variant: 'accent',
                        className: "w-full sm:w-auto px-4 py-2 bg-[#F38F54] hover:bg-[#e07b44] text-white"
                    })}
                >
                    Создать гильдию
                </Link>
            </div>

            {userGuilds.length > 0 ? (
                <div className="grid gap-2 grid-cols-1 lg:grid-cols-2 w-fit">
                    {userGuilds.map((guild: any) => (
                        <div
                            key={guild.url}
                            className="flex flex-col justify-between gap-4 items-start border-2 rounded-lg py-6 px-4
                    dark:bg-neutral-800 dark:border-zinc-700 dark:hover:border-[#F38F54]
                    bg-white border-zinc-200 hover:border-[#F38F54]
                    transition-all duration-300 shadow-md hover:shadow-lg w-full"
                        >
                            <div className="flex flex-col gap-4 w-full">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={`https://minotar.net/helm/${guild.owner_nickname}/150.png`}
                                        alt={guild.owner_nickname}
                                        width={36}
                                        height={36}
                                        quality={100}
                                        className="rounded-lg"
                                    />
                                    <div className="flex items-center gap-2">
                                        {guild.hasFoxPlus && <Crown className="text-orange-400 w-5 h-5" />}
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            {guild.owner_nickname}
                                        </h2>
                                    </div>
                                </div>

                                <div className="flex flex-row items-start gap-4 w-full">
                                    <div className="flex-1 space-y-3">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                            {guild.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{guild.info}</p>
                                        <ul className="list-disc list-inside text-sm space-y-1 text-gray-600 dark:text-gray-300">
                                            {guild.is_openProfile ? (
                                                <li className="text-green-400">Открытый профиль</li>
                                            ) : (
                                                <li className="text-red-400">Закрытый профиль</li>
                                            )}
                                            {guild.is_recruit ? (
                                                <li className="text-green-400">Принимает заявки</li>
                                            ) : (
                                                <li className="text-red-400">Не принимает заявки</li>
                                            )}
                                            {guild.discord_code && (
                                                <li className="text-blue-400">Есть Discord сервер ({
                                                    guild.is_openDiscord ? "открытый" : "закрытый"
                                                })</li>
                                            )}
                                            <li>Создана {new Date(guild.create_date).toLocaleString("ru-RU")}</li>
                                            <li>{guild.member_count} участников</li>
                                        </ul>
                                    </div>
                                    {guild.badge_url && (
                                        <div className={'flex justify-end'}>
                                            <Image
                                                src={guild.badge_url}
                                                alt={`Эмблема ${guild.url}`}
                                                width={100}
                                                height={100}
                                                objectFit={'cover'}
                                                quality={100}
                                                className={'rounded-lg overflow-hidden'}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-row flex-wrap gap-2 mt-4">
                                {guild.permission == 2 && (
                                    <Link
                                        href={`/me/guilds/${guild.url}`}
                                        className={buttonVariants({
                                            size: 'sm',
                                            variant: 'accent',
                                            className: "bg-[#F38F54] hover:bg-[#e07b44] text-white"
                                        })}
                                    >
                                        Редактировать гильдию
                                    </Link>
                                )}
                                {guild.permission > 0 && (
                                    <Link
                                        href={`/me/guilds/${guild.url}/users`}
                                        className={buttonVariants({
                                            size: 'sm',
                                            variant: 'accent',
                                            className: "bg-[#F38F54] hover:bg-[#e07b44] text-white"
                                        })}
                                    >
                                        Управлять заявками
                                    </Link>
                                )}
                                {guild.discord_code && (
                                    <Link
                                        href={guild.discord_code}
                                        className={buttonVariants({
                                            size: 'sm',
                                            variant: 'accent',
                                            className: "bg-[#F38F54] hover:bg-[#e07b44] text-white"
                                        })}
                                    >
                                        Перейти в Discord
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-fit bg-white dark:bg-neutral-800 rounded-lg p-6 border-2
                border-zinc-200 dark:border-zinc-700 shadow-md">
                    <div className="flex flex-col gap-4">
                        <SearchX className="h-16 w-16 text-gray-500 dark:text-gray-400" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Гильдии не найдены
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Попробуйте вступить в одну из гильдий или создайте собственную
                        </p>
                        <Link
                            href="/guilds"
                            className={buttonVariants({
                                size: 'lg',
                                variant: 'accent',
                                className: "w-full sm:w-fit mt-4 bg-[#F38F54] hover:bg-[#e07b44] text-white"
                            })}
                        >
                            Найти гильдию
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}