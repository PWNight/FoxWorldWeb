"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {NavMe} from "@/components/navbar_me";
import Image from "next/image";
import Link from "next/link";

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
                getGuilds(json)
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
        return (
            <div className="grid sm:grid-cols-[300px,1fr] gap-6 mt-6">
                <NavMe/>
                <div className="">
                    {userGuilds.map(function (guild:any) {
                        return (
                            <div key={guild.url} id={guild.url}>
                                <div className="flex flex-row gap-1 items-center">
                                    <Image
                                      src={"https://cravatar.eu/helmavatar/"+ guild.owner_nickname +"/25.png"}
                                      alt={guild.owner_nickname}
                                      width={25}
                                      height={25}
                                      quality={100}
                                    />
                                    <h1>{guild.owner_nickname}</h1>
                                </div>
                                <div>
                                    <h1>{guild.name}</h1>
                                    <p>{guild.description}</p>
                                </div>
                                <div>
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
                                    </ul>
                                    <div>
                                        <Link href={'/guilds/' + guild.url}>Открыть страницу</Link>
                                        {guild.permission == 2 && (
                                            <button>Редактировать</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}
