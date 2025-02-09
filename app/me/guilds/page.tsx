"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {SearchX} from "lucide-react";
import GuildSkelet from "@/components/skelets/guild_skelet";
import {getAllMyGuilds, getSession} from "@/app/actions/getInfo";

export default function MeGuilds() {
    const [pageLoaded, setPageLoaded] = useState(false);
    const [userGuilds, setUserGuilds] = useState([])

    const router = useRouter()

    useEffect(()=>{
        getSession().then(async r => {
            if ( !r.success ) {
                router.push("/login")
                return
            }
            getAllMyGuilds(r.data).then((r) => {
                if ( r.success ) {
                    setUserGuilds(r.data);
                }
                if ( r.data == null ) {
                    setUserGuilds([]);
                }
                setPageLoaded(true);
            })
        });
    },[router])

    if (pageLoaded) {
        if (userGuilds.length != 0) {
            return (
                <div className='grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 sm:gap-8 gap-4'>
                    {userGuilds.map(function (guild:any) {
                        return (
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
                                                <li>Вы состоите в гильдии с {new Date(guild.member_since).toLocaleString("ru-RU")}</li>
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
                                <div className='flex sm:flex-row flex-col w-full gap-5'>
                                    <Link href={'/guilds/' + guild.url}
                                    className={buttonVariants({
                                        variant: "accent",
                                        className: "px-2",
                                        size: "sm",
                                    })}>Открыть страницу
                                    </Link>
                                    {guild.permission == 2 && (
                                        <Link href={'/me/guilds/'+ guild.url} className={buttonVariants({size: 'sm', variant: 'accent'})}>Редактировать гильдию</Link>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )
        }else{
            return (
                <div className='sm:w-fit w-full bg-neutral-100 rounded-sm p-4 dark:bg-neutral-800 flex flex-col h-fit justify-between gap-2'>
                    <div className=''>
                        <SearchX className='h-20 w-20'/>
                        <h1 className='text-3xl'>Гильдии не найдены</h1>
                        <p>Попробуйте вступить в одну из гильдий или создайте собственную</p>
                    </div>
                    <div className='flex flex-col gap-2 mt-6'>
                        <Link href='/guilds' className={buttonVariants({size: 'sm', variant: 'accent'})}>Найти гильдию</Link>
                        <Link href='/guilds/create' className={buttonVariants({size: 'sm', variant: 'accent'})}>
                            Создать гильдию
                        </Link>
                    </div>
                </div>
            )
        }
    }else{
        return (
            <GuildSkelet/>
        )
    }
}
