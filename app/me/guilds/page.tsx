"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {Crown, SearchX} from "lucide-react";
import {getAllMyGuilds, getSession} from "@/app/actions/getInfo";
import ErrorMessage from "@/components/ui/notify-alert";
import GuildSkelet from "@/components/skelets/guild_skelet";

export default function MeGuilds() {
    const [pageLoaded, setPageLoaded] = useState(false);
    const [userGuilds, setUserGuilds] = useState([]);
    const [notifyMessage, setNotifyMessage] = useState('');
    const [notifyType, setNotifyType] = useState('');

    const router = useRouter();

    useEffect(() => {
        getSession().then(async r => {
            if (!r.success) {
                router.push("/login");
                return;
            }
            getAllMyGuilds(r.data).then((r) => {
                if (!r.success) {
                    setNotifyMessage(`Произошла ошибка при загрузке списка гильдий`);
                    setNotifyType('error');
                    return;
                }
                setUserGuilds(r.data || []);
                setPageLoaded(true);
            });
        });
    }, [router]);

    const handleClose = () => {
        setNotifyMessage('');
    };

    if (pageLoaded) {
        if (userGuilds.length !== 0) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-4">
                    {notifyMessage && <ErrorMessage message={notifyMessage} onClose={handleClose} type={notifyType} />}
                    {userGuilds.map((guild: any) => (
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
                                <div className="grid grid-cols-[1fr_.3fr] gap-1">
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
                            <div className='flex flex-col w-fit gap-2'>
                                {guild.permission === 2 && (
                                    <div className={'flex flex-row gap-2'}>
                                        <Link href={`/me/guilds/${guild.url}`} className={buttonVariants({size: 'sm', variant: 'accent'})}>
                                            Редактировать гильдию
                                        </Link>
                                        <Link href={`/me/guilds/${guild.url}/users`} className={buttonVariants({size: 'sm', variant: 'accent'})}>
                                            Управлять заявками
                                        </Link>
                                    </div>
                                )}
                                {guild.discord_code && (
                                    <Link href={guild.discord_code} className={buttonVariants({size: 'sm', variant: 'accent'})}>
                                        Перейти в Discord
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            );
        } else {
            return (
                <div className='sm:w-fit w-full bg-neutral-100 rounded-sm p-4 dark:bg-neutral-800 flex flex-col h-fit justify-between gap-2'>
                    {notifyMessage && <ErrorMessage message={notifyMessage} onClose={handleClose} type={notifyType} />}
                    <div className=''>
                        <SearchX className='h-20 w-20'/>
                        <h1 className='text-3xl'>Гильдии не найдены</h1>
                        <p>Попробуйте вступить в одну из гильдий или создайте собственную</p>
                    </div>
                    <div className='flex flex-col gap-2 mt-6'>
                        <Link href='/guilds' className={buttonVariants({size: 'sm', variant: 'accent'})}>
                            Найти гильдию
                        </Link>
                        <Link href='/guilds/create' className={buttonVariants({size: 'sm', variant: 'accent'})}>
                            Создать гильдию
                        </Link>
                    </div>
                </div>
            );
        }
    } else {
        return (
            <>
                {notifyMessage && <ErrorMessage message={notifyMessage} onClose={handleClose} type={notifyType} />}
                <GuildSkelet/>
            </>
        );
    }
}