"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SubAnchor from "@/components/subanchor";
import { Castle, House, Landmark, ShieldCheck } from "lucide-react";

export default function Me() {
    const [userData, setUserData] = useState(Object)
    const router = useRouter()
    async function getSession(){
        const response = await fetch("/api/v1/users/me",{
            method: "GET"
        })
        if(!response.ok){
            router.push('/login')
            return
        }
        const json = await response.json()
        setUserData(json)
    }
    useEffect(()=>{
        getSession()
    },[])
    return (
        <div className="grid grid-cols-[300px,1fr] gap-6 mt-6">
            <div className="flex items-center">
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-md flex flex-col gap-5 px-6 py-4 lg:min-w-[300px]">
                    <h1 className="border-b text-xl my-2 w-full text-center">Меню навигации</h1>
                    <div className="w-full flex flex-col gap-2 items-center">
                        <SubAnchor
                            key='/me'
                            activeClassName="bg-orange-300"
                            absolute
                            className="flex items-center gap-1 hover:bg-orange-200 transition-all w-full py-2 px-1 rounded-sm"
                            href='/me'
                        >
                        <House/>Главная страница
                        </SubAnchor>
                        <SubAnchor
                            key='/me/security'
                            activeClassName="bg-orange-300"
                            absolute
                            className="flex items-center gap-1 hover:bg-orange-200 transition-all w-full py-2 px-1 rounded-sm"
                            href='/me/security'
                        >
                        <ShieldCheck/>Настройки безопасности
                        </SubAnchor>
                        <SubAnchor
                            key='/me/bank'
                            activeClassName="bg-orange-300"
                            absolute
                            className="flex items-center gap-1 hover:bg-orange-200 transition-all w-full py-2 px-1 rounded-sm"
                            href='/me/bank'
                        >
                        <Landmark/> Управление средствами
                        </SubAnchor>
                        <SubAnchor
                            key='/me/guilds'
                            activeClassName="bg-orange-300"
                            absolute
                            className="flex items-center gap-1 hover:bg-orange-200 transition-all w-full py-2 px-1 rounded-sm"
                            href='/me/guilds'
                        >
                        <Castle/> Управление гильдиями
                        </SubAnchor>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <div className="bg-neutral-100 grid grid-cols-[.3fr,1fr]">
                </div>
                <div className="bg-neutral-100 col-span-2"></div>
            </div>
        </div>
    )
}
