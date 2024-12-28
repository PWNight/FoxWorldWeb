"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SubAnchor from "@/components/subanchor";
import { Castle, House, Landmark, ShieldCheck, Store } from "lucide-react";

export default function MeGuilds() {
    const [userData, setUserData] = useState(Object)
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
            }
        }
        getSession()
    },[router])
    if(Object.keys(userData).length != 0){
        return (
            <div className="grid sm:grid-cols-[300px,1fr] gap-6 mt-6">
                <div className="sm:flex items-start">
                    <div className="bg-neutral-100 rounded-sm dark:bg-neutral-800 flex flex-col gap-5 px-6 py-4">
                        <h1 className="border-b text-xl my-2 w-full text-center">Меню навигации</h1>
                        <div className="w-full flex flex-col gap-2 items-center">
                            <SubAnchor
                                key='/me'
                                activeClassName="bg-orange-400 text-muted hover:bg-orange-500"
                                absolute
                                className="flex items-center gap-1 hover:bg-orange-400 hover:text-muted transition-all w-full py-2 px-1 rounded-sm"
                                href='/me'
                            >
                            <House/>Главная страница
                            </SubAnchor>
                            <SubAnchor
                                key='/me/donate'
                                activeClassName="bg-orange-400 text-muted hover:bg-orange-500"
                                absolute
                                className="flex items-center gap-1 hover:bg-orange-400 hover:text-muted transition-all w-full py-2 px-1 rounded-sm"
                                href='/me/donate'
                            >
                            <Store/> Магазин сервера
                            </SubAnchor>
                            <SubAnchor
                                key='/me/security'
                                activeClassName="bg-orange-400 text-muted hover:bg-orange-500"
                                absolute
                                className="flex items-center gap-1 hover:bg-orange-400 hover:text-muted transition-all w-full py-2 px-1 rounded-sm"
                                href='/me/security'
                            >
                            <ShieldCheck/> Настройки безопасности
                            </SubAnchor>
                            <SubAnchor
                                key='/me/bank'
                                activeClassName="bg-orange-400 text-muted hover:bg-orange-500"
                                absolute
                                className="flex items-center gap-1 hover:bg-orange-400 hover:text-muted transition-all w-full py-2 px-1 rounded-sm"
                                href='/me/bank'
                            >
                            <Landmark/> Управление средствами
                            </SubAnchor>
                            <SubAnchor
                                key='/me/guilds'
                                activeClassName="bg-orange-400 text-muted hover:bg-orange-500"
                                absolute
                                className="flex items-center gap-1 hover:bg-orange-400 hover:text-muted transition-all w-full py-2 px-1 rounded-sm"
                                href='/me/guilds'
                            >
                            <Castle/> Управление гильдиями
                            </SubAnchor>
                        </div>
                    </div>
                </div>
                <div className="">
                </div>
            </div>
        )
    }
}
