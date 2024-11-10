"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SubAnchor from "@/components/subanchor";

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
        <div className="sm:container grid grid-cols-3 mt-6">
            <div className="flex items-center">
                <div className="bg-neutral-100 dark:bg-neutral-900 rounded-md flex flex-col gap-5 items-center px-4 py-2 lg:min-w-[250px]">
                    <h1 className="border-b text-xl">Меню навигации</h1>
                    <div className="w-full flex flex-col gap-2 items-center">
                        <SubAnchor
                            key='/me'
                            activeClassName="bg-orange-300"
                            absolute
                            className="flex items-center gap-1 hover:bg-orange-200 transition-all w-full py-2 px-1 rounded-sm"
                            href='/me'
                        >
                        Главная страница
                        </SubAnchor>
                        <SubAnchor
                            key='/me/security'
                            activeClassName="bg-orange-300"
                            absolute
                            className="flex items-center gap-1 hover:bg-orange-200 transition-all w-full py-2 px-1 rounded-sm"
                            href='/me/security'
                        >
                        Настройки безопасности
                        </SubAnchor>
                    </div>
                </div>
            </div>
            <div className="col-span-2">
                <p>t</p>
            </div>
        </div>
    )
}
