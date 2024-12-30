"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SubAnchor from "@/components/subanchor";
import {Castle, House, Landmark, ShieldCheck, Store, Pencil} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {NavMe} from "@/components/navbar_me";

export default function MeSecurity() {
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
                <NavMe/>
                <div className="grid lg:grid-cols-[.8fr,1fr] gap-2 ">
                    <div className="flex flex-col gap-2">
                        <div
                            className="bg-neutral-100 rounded-sm p-4 max-h-fit flex justify-center flex-col dark:bg-neutral-800">
                            <div className="border-b">
                                <h1 className="text-2xl">Изменение никнейма</h1>
                            </div>
                            <div className="flex flex-col gap-4 my-2">
                                <Link href='/docs/rules'
                                      className="text-orange-400 hover:text-orange-500 transition-all 2xl:flex gap-2">
                                    <p className="text-muted-foreground">Никнейм не должен нарушать</p>правила сервера
                                </Link>
                                <div className="flex 2xl:flex-row flex-col gap-2 2xl:items-center">
                                    <input
                                        type="text"
                                        className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                                        placeholder="Введите никнейм"
                                    />
                                    <Button variant="accent" className="flex gap-1"><Pencil/>Изменить</Button>
                                </div>
                            </div>
                        </div>
                        <div
                            className="bg-neutral-100 rounded-sm p-4 max-h-fit flex justify-center flex-col dark:bg-neutral-800">
                            <div className="border-b">
                                <h1 className="text-2xl">Изменение пароля</h1>
                            </div>
                            <div className="flex flex-col gap-4 my-2">
                                <div className="flex 2xl:flex-row flex-col gap-2 2xl:items-center">
                                    <input
                                        type="text"
                                        className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                                        placeholder="Введите новый пароль"
                                    />
                                    <Button variant="accent" className="flex gap-1"><Pencil/>Изменить</Button>
                                </div>
                                <Link href='/recover'
                                      className="text-orange-400 hover:text-orange-500 transition-all 2xl:flex gap-2">
                                    <p className="text-muted-foreground">Забыли пароль?</p>Перейти к восстановлению
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="bg-neutral-100 rounded-sm p-4 dark:bg-neutral-800 h-full">
                    </div>
                </div>
            </div>
        )
    }
}
