"use client"
import { useRouter } from"next/navigation";
import { useEffect, useState } from"react";
import {NavMe} from "@/components/navbar_me";
import Image from "next/image";
import {Button} from "@/components/ui/button";

type PageProps = {
    params: Promise<{ url: string }>;
};

export default function MyGuildMembers(props: PageProps) {
    const [pageLoaded, setPageLoaded] = useState(false);
    const [userGuild, setUserGuild] = useState(Object)
    const [guildUsers, setGuildUsers] = useState(Object)

    const router = useRouter();

    useEffect(() => {
        async function getSession() {
            const response = await fetch("/api/v1/users/me", {
                method: "GET"
            });
            if (response.ok) {
                const json = await response.json();
                if (!json.success) {
                    router.push('/login');
                }else {
                    await getUserGuild(json);
                }
            }
        }

        async function getUserGuild(data:any) {
            const params = await props.params
            const {url} = params;

            const session_token = data.token
            const response = await fetch(`/api/v1/guilds/me`, {
                method: "POST",
                body: JSON.stringify({session_token}),
            });

            if (!response.ok){
                router.push('/me/guilds');
            }else{
                const json = await response.json()
                if(json.success){
                    let has_access = false
                    json.data.map(function (item:any){
                        if(item.url == url){
                            if(item.permission == 2){
                                has_access = true
                                setUserGuild(item)
                            }
                        }
                    })
                    if(!has_access){
                        router.push('/me/guilds')
                    }else{
                        await getGuildUsers();
                    }
                } else{
                    router.push('/me/guilds');
                }
            }
        }

        async function getGuildUsers() {
            const params = await props.params
            const {url} = params;

            const response = await fetch(`/api/v1/guilds/${url}/users`, {
                method: "GET",
            });

            if (!response.ok){
                router.push('/me/guilds');
            }else{
                const json = await response.json()
                console.log(json)

                setGuildUsers(json.data)
                setPageLoaded(true)
            }
        }

        getSession();
    }, [router, props]);

    if(pageLoaded){
        return (
            <div className="grid sm:grid-cols-[300px,1fr] gap-6 mt-6">
                <NavMe/>
                <div className="flex flex-col gap-2 mb-6 w-fit">
                    {guildUsers.map((user:any, key:any) => {
                        return (
                            <div key={key} className="bg-neutral-100 rounded-sm p-4 dark:bg-neutral-800 h-fit w-fit flex flex-col gap-4">
                                <div className="flex items-center gap-2 w-fit ">
                                    <Image
                                        src={"https://cravatar.eu/helmavatar/" + user.nickname + "/50.png"}
                                        alt={user.nickname}
                                        width={50}
                                        height={50}
                                        quality={100}
                                        className='rounded-lg'
                                    />
                                    <h1 className='text-2xl'>{user.nickname}</h1>
                                </div>
                                <div>
                                    <p>Уровень доступа: {user.permission}</p>
                                    <p>Участник с {new Date(user.member_since).toLocaleString("ru-RU")}</p>
                                </div>
                                {user.permission != 2 &&
                                    <div className="flex items-center gap-2">
                                        <Button>Изменить уровень</Button>
                                        <Button>Исключить игрока</Button>
                                    </div>
                                }
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}