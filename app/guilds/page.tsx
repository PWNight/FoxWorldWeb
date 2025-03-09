"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/notify-alert";
import { Crown } from "lucide-react";

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
            // Сортировка по количеству участников по убыванию
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
        fetchGuilds(); // Первоначальная загрузка

        // Установка интервала обновления каждые 15 секунд
        const intervalId = setInterval(() => {
            fetchGuilds();
        }, 15000);

        // Очистка интервала при размонтировании компонента
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

    if (!pageLoaded) {
        return <div>Загрузка...</div>; // Можно добавить спиннер
    }

    if (guilds.length === 0) {
        return (
            <>
                {notifyMessage && (
                    <ErrorMessage
                        message={notifyMessage}
                        onClose={handleClose}
                        type={notifyType}
                    />
                )}
            </>
        );
    }

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
                <h1 className="text-3xl font-bold">Гильдии</h1>
                <input
                    className="p-3 border border-gray-600 rounded-lg outline-none"
                    type="text"
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Поиск"
                    value={searchQuery}
                />
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-8 mb-4">
                {filteredGuilds().map((guild:any) => (
                    <div
                        key={guild.url}
                        id={guild.url}
                        className='flex flex-col justify-between gap-2 items-start border-2 rounded-md py-5 px-3 bg-accent hover:border-[#F38F54] transition-all w-full'
                    >
                        <div className='flex flex-col gap-2 w-full'>
                            <div className="flex flex-row gap-1 items-center">
                                <Image
                                    src={`https://minotar.net/helm/${guild.owner_nickname}/100.png`}
                                    alt={guild.owner_nickname}
                                    width={25}
                                    height={25}
                                    quality={100}
                                    className={'rounded-md overflow-hidden'}
                                />
                                <div className={'flex gap-1 items-center'}>
                                    {guild.hasFoxPlus && <Crown className={'text-orange-400'}/>}
                                    <h1>{guild.owner_nickname}</h1>
                                </div>
                            </div>
                            <div className="grid grid-cols-[1fr_.3fr]">
                                <div>
                                    <h1 className='text-3xl'>{guild.name}</h1>
                                    <p>{guild.info}</p>
                                    <p className={'mt-2'}>{guild.description}</p>
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
                                {guild.badge_url && (
                                    <Image
                                        src={guild.badge_url}
                                        alt={`Эмблема ${guild.url}`}
                                        width={200}
                                        height={200}
                                        objectFit={'cover'}
                                        quality={100}
                                        className={'rounded-md overflow-hidden'}
                                    />
                                )}
                            </div>
                        </div>
                        <div className='flex sm:flex-row flex-col w-full gap-5 mt-4'>
                            <Link
                                href={`/guilds/${guild.url}/application`}
                                className={buttonVariants({
                                    variant: "accent",
                                    className: "px-4 py-2",
                                    size: "sm",
                                })}
                            >
                                Подать заявку
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}