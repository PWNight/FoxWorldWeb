"use client"
import { useRouter } from"next/navigation";
import { useEffect, useState } from"react";
import {NavMe} from "@/components/navbar_me";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {CloudUpload, LucideLoader, Trash2} from "lucide-react";

type PageProps = {
    params: Promise<{ url: string }>;
};

export default function MyGuild(props: PageProps) {
    const [userData, setUserData] = useState(Object)
    const [userGuilds, setUserGuilds] = useState([])
    const [userGuild, setUserGuild] = useState(Object)

    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [info, setInfo] = useState('');
    const [description, setDescription] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('')

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
                                setUserGuild(item)
                                setName(item.name)
                                setDescription(item.description)
                                setInfo(item.info)
                                setUrl(item.url)
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
        <div className="grid sm:grid-cols-[300px,1fr] gap-6 mt-6">
            <NavMe/>
            <div className="grid grid-flow-col gap-2 mb-6 w-fit">
                <div className="bg-neutral-100 rounded-sm p-4 flex flex-col dark:bg-neutral-800 h-full w-fit">
                    <form className="text-sm w-fit bg-neutral-100 dark:bg-neutral-800 rounded-xl p-5 text-gray-900 dark:text-gray-100">
                        <div className="flex flex-col gap-2 mb-5">
                            <h1 className='text-3xl'>Информация о гильдии</h1>
                            <p>Вы можете изменить некоторые параметры вашей гильдии на нажать &#39;Обновить гильдию&#39;</p>
                        </div>
                        <div className="mb-5 select-none">
                            <label htmlFor="name" className="block mb-2 font-medium">Название гильдии</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                            />
                        </div>
                        <div className="mb-5 select-none">
                            <label htmlFor="url" className="block mb-2 font-medium">Введите краткую ссылку на
                                гильдию</label>
                            <input
                                type="text"
                                id="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                            />
                        </div>
                        <div className="mb-5 select-none">
                            <label htmlFor="info" className="block mb-2 font-medium">Введите слоган вашей
                                гильдии</label>
                            <input
                                type="text"
                                id="info"
                                value={info}
                                onChange={(e) => setInfo(e.target.value)}
                                className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                            />
                        </div>
                        <div className="mb-5 select-none">
                            <label htmlFor="description" className="block mb-2 font-medium">Введите полное описание
                                гильдии</label>
                            <input
                                type="text"
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                            />
                        </div>
                        <div>
                            <button type="submit"
                                    disabled={isLoading}
                                    className="select-none text-white bg-orange-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center flex items-center gap-1">{isLoading ? <>
                                <LucideLoader/><p>Обновляю гильдию</p></> : 'Обновить гильдию'}</button>
                            {error && <p className="text-red-400 mt-1 mb-5">{error}</p>}
                        </div>
                    </form>
                </div>
                <div className="flex flex-col gap-2 ">
                    <div
                        className="bg-neutral-100 rounded-sm p-4 flex justify-center flex-col dark:bg-neutral-800 h-full">
                    </div>
                </div>
            </div>
        </div>
    )
}