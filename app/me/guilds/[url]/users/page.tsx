"use client"
import { useRouter } from"next/navigation";
import { useEffect, useState } from"react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {checkGuildAccess, getGuildUsers, getSession} from "@/app/actions/getInfo";

type PageProps = {
    params: Promise<{ url: string }>;
};

export default function MyGuildMembers(props: PageProps) {
    const [pageLoaded, setPageLoaded] = useState(false);
    const [guildUsers, setGuildUsers] = useState(Object)

    const router = useRouter();
   useEffect(()=>{
        getSession().then(async r => {
            if ( !r.success ) {
                router.push("/login")
                return
            }

            const params = await props.params
            const {url} = params;
            checkGuildAccess(url, r.data).then((r) => {
                if ( !r.success ) {
                    router.push("/me/guilds")
                    return
                }
                getGuildUsers(url).then((r) => {
                    if ( !r.success ) {
                        router.push("/me/guilds")
                        return
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
            <div className="flex flex-col gap-2 w-fit">
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
        )
    }
}