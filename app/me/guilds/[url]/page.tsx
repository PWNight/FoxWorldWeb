"use client"
import { useRouter } from"next/navigation";
import { useEffect, useState } from"react";

type PageProps = {
    params: Promise<{ url: string }>;
};

export default function MyGuild(props: PageProps) {
    const [userData, setUserData] = useState(Object)
    const [userGuilds, setUserGuilds] = useState([])

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
                    setUserData(json);
                    await getGuildUsers(json);
                }
            }
        }

        async function getGuildUsers(data:any) {
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
                            }
                        }
                    })
                    if(!has_access){
                        router.push('/me/guilds')
                    }
                } else{
                    router.push('/me/guilds');
                }
            }
        }

        getSession();
    }, [router]);
    return (
        <div></div>
    )
}