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
    const [guildUsers, setGuildUsers] = useState(Object)

    const router = useRouter();
   useEffect(()=>{
        async function getSession() {
            const response = await fetch("/api/v1/users/me", {
                method: "GET"
            });
            if ( !response.ok ) {
                return { success: false}
            }
            const json = await response.json();
            if ( !json.success ) {
                return { success: false }
            }
            return { success: true, data: json }
        }
        async function getUserGuild(data:any) {
            const params = await props.params
            const {url} = params;

            const session_token = data.token
            // TODO: Rewrite get user guild by guild url and user id
            const response = await fetch(`/api/v1/guilds/me`, {
                method: "POST",
                body: JSON.stringify({session_token}),
            });

            if ( !response.ok ) {
                return { success: false }
            }

            const json = await response.json();
            if ( !json.success ) {
                return { success: false }
            }

            let has_access = false
            let user_guild;
            json.data.map((item:any)=> {
                if (item.url == url) {
                    if (item.permission == 2) {
                        has_access = true
                        user_guild = item
                    }
                }
            })

            if (!has_access) {
                return {success: false}
            }
            return { success: true, data: user_guild }
        }
        async function getGuildUsers() {
            const params = await props.params
            const {url} = params;

            const response = await fetch(`/api/v1/guilds/${url}/users`, {
                method: "GET",
            });
            if ( !response.ok ) {
                return { success: false }
            }

            const json = await response.json()
            if ( !json.success ) {
                return { success: false }
            }
            return { success: true, data: json.data }
        }
        getSession().then(async r => {
            if ( !r.success ) {
                router.push("/login")
                return
            }
            getUserGuild(r.data).then((r) => {
                if ( !r.success ) {
                    router.push("/me/guilds")
                    return
                }
                getGuildUsers().then((r) => {
                    if ( !r.success ) {
                        router.push("/me/guilds")
                    }
                    setGuildUsers(r.data)
                    setPageLoaded(true)
                })
            })
        });
        //TODO: Page loaded state update (in last async function)
    },[router, props])

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