"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {NavMe} from "@/components/navbar_me";
import Image from "next/image";
import Link from "next/link";
import {Button, buttonVariants} from "@/components/ui/button";
import {SearchX} from "lucide-react";

export default function MeGuilds() {
    const [userData, setUserData] = useState(Object)
    const [userGuilds, setUserGuilds] = useState(Object)
    const router = useRouter()

    useEffect(()=>{
        async function getSession(){
            const response = await fetch("/api/v1/users/me",{
                method: "GET"
            })
            if(!response.ok){
                // TODO: Implement error handler
                console.log(response)
                return
            }

            const json = await response.json()
            if (!json.success) {
                router.push('/login')
            }else{
                setUserData(json)
                await getGuilds(json)
            }
        }
        async function getGuilds(data:any){
            const session_token = data.token
            const response = await fetch("/api/v1/guilds/me",{
                method: "POST",
                body: JSON.stringify({session_token}),
            })
            if(!response.ok){
                // TODO: Implement error handler
                console.log(response)
                return
            }

            const json = await response.json()
            if (!json.success) {
                router.push('/login')
            }else{
                setUserGuilds(json.data)
                console.log(json.data)
            }
        }
        getSession()
    },[router])
    if(Object.keys(userData).length != 0 && Object.keys(userGuilds).length != 0){
        if (userGuilds.length != 0){
            return (
                <div className="grid sm:grid-cols-[300px,1fr] gap-6 mt-6">
                    <NavMe/>
                    <div className='grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 sm:gap-8 gap-4'>
                        {userGuilds.map(function (guild:any) {
                            return (
                                <div key={guild.url} id={guild.url}
                                     className='flex flex-col justify-between gap-2 items-start border-2 rounded-md py-5 px-3 bg-accent hover:border-[#F38F54] transition-all w-fit'>
                                    <div className='flex flex-col gap-2'>
                                        <div className="flex flex-row gap-1 items-center">
                                            <Image
                                                src={"https://cravatar.eu/helmavatar/" + guild.owner_nickname + "/25.png"}
                                                alt={guild.owner_nickname}
                                                width={25}
                                                height={25}
                                                quality={100}
                                            />
                                            <h1>{guild.owner_nickname}</h1>
                                        </div>
                                        <h1 className='text-3xl'>{guild.name}</h1>
                                        <p>{guild.description}</p>
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
                                            <li>Вы состоите в гильдии
                                                с {new Date(guild.member_since).toLocaleString("ru-RU")}</li>
                                        </ul>
                                    </div>
                                    <div className='flex flex-row gap-5'>
                                        <Link href={'/guilds/' + guild.url}
                                        className={buttonVariants({
                                            variant: "accent",
                                            className: "px-2",
                                            size: "sm",
                                        })}>Открыть страницу
                                        </Link>
                                        {guild.permission == 2 && (
                                            <button
                                              className={buttonVariants({
                                                variant: "accent",
                                                className: "px-2",
                                                size: "sm",
                                              })}>Редактировать
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        }else{
            return (
                <div className="grid sm:grid-cols-[300px,1fr] gap-6 mt-6">
                    <NavMe/>
                    <div className='bg-neutral-100 rounded-sm p-4 dark:bg-neutral-800 w-fit h-fit flex flex-col gap-2'>
                        <SearchX className='h-20 w-20'/>
                        <h1 className='text-3xl'>Гильдии не найдены</h1>
                        <p className='text-lg'>Попробуйте вступить в одну из гильдий или создайте собственную</p>
                        <div className='flex flex-row gap-2 mt-6'>
                            <Link href='/guilds' className={buttonVariants({size: 'sm', variant: 'accent'})}>Найти гильдию</Link>
                            <Button className={buttonVariants({size: 'sm', variant: 'accent'})}>Создать гильдию</Button>
                        </div>
                    </div>
                </div>
            )
        }
    }
}
