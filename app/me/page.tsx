"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SubAnchor from "@/components/subanchor";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Castle, CloudUpload, House, Landmark, ShieldCheck, Store, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Me() {
    const [userData, setUserData] = useState(Object)
    const [statsData, setStatsData] = useState(Object)
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
        console.log(json)
        setUserData(json)
        getStats(json)
    }

    async function getStats(data : any){
        const response = await fetch(`http://135.181.126.159:25576/v1/player?player=${data.profile.fk_uuid}`,{
            method: "GET"
        })
        if(!response.ok){
            console.log(response)
            return
        }
        const json = await response.json()
        console.log(json)
        setStatsData(json)
    }
    useEffect(()=>{
        getSession()
    },[])
    if(Object.keys(userData).length != 0 && Object.keys(statsData).length != 0){
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
                <div className="grid lg:grid-cols-3 lg:grid-rows-2 gap-2">
                    <div className="bg-neutral-100 rounded-sm p-4 flex justify-center flex-col">
                        <div className="border-b">
                            <h1 className="text-2xl">Информация об аккаунте</h1>
                            <p className="text-muted-foreground">Основная информация о вас</p>
                        </div>
                        <div className="my-2">
                            <div className="flex flex-col gap-1">
                                <div className="flex gap-2"><p className="text-muted-foreground">Никннейм:</p><p>{userData.profile.nick}</p></div>
                                <div className="xs:flex gap-2"><p className="text-muted-foreground">Дата регистрации:</p><p>{new Date(userData.user.joined).toLocaleString("ru-RU")}</p></div>
                                <div className="xs:flex gap-2"><p className="text-muted-foreground">Дата последнего входа на сервер:</p><p>{new Date(userData.user.last_seen).toLocaleString("ru-RU")}</p></div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-neutral-100 rounded-sm p-4 lg:col-span-2">
                        <div className="border-b">
                            <h1 className="text-2xl">Игровая статистика</h1>
                            <p className="text-muted-foreground">Статистика вашей игры</p>
                        </div>
                        <div className="my-2">
                            <div className="flex flex-col gap-1">
                                <Accordion type='multiple' className="grid lg:grid-cols-2 gap-2">
                                    <AccordionItem value="online_all">
                                        <AccordionTrigger>
                                            <div className="flex gap-2"><p className="text-muted-foreground">Статистика онлайна за всё время</p></div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                        <div className="flex gap-1"><p className="text-muted-foreground">Всего наиграно</p><p>{statsData.info.playtime}</p></div>
                                            <div className="flex gap-1"><p>{statsData.info.active_playtime}</p><p className="text-muted-foreground">активной игры</p></div>
                                            <div className="flex gap-1"><p>{statsData.info.afk_time}</p><p className="text-muted-foreground">в афк</p></div>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="online_30d">
                                        <AccordionTrigger>
                                            <div className="flex gap-2"><p className="text-muted-foreground">Статистика онлайна за 30 дней</p></div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                        <div className="flex gap-1"><p className="text-muted-foreground">Всего наиграно</p><p>{statsData.online_activity.playtime_30d}</p></div>
                                            <div className="flex gap-1"><p>{statsData.online_activity.active_playtime_30d}</p><p className="text-muted-foreground">активной игры</p></div>
                                            <div className="flex gap-1"><p>{statsData.online_activity.afk_time_30d}</p><p className="text-muted-foreground">в афк</p></div>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="sessions">
                                        <AccordionTrigger>
                                            <div className="flex gap-2"><p className="text-muted-foreground">Статистика сессий</p></div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                        <div className="flex gap-1"><p className="text-muted-foreground">Всего вы зашли к нам</p><p>{statsData.info.session_count}</p><p className="text-muted-foreground">раз</p></div>
                                            <div className="flex gap-1"><p>{statsData.online_activity.session_count_30d}</p><p className="text-muted-foreground">раз(-а) за последние 30 дней</p></div>
                                            <div className="flex gap-1"><p>{statsData.online_activity.session_count_7d}</p><p className="text-muted-foreground">раз(-а) за последние 7 дней</p></div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                    <div className="bg-neutral-100 rounded-sm p-4 max-h-fit flex justify-center flex-col">
                        <div className="border-b">
                            <h1 className="text-2xl">Управление скином</h1>
                            <p className="text-muted-foreground">Здесь вы можете изменить свой скин</p>
                        </div>
                        <div className="flex flex-col gap-4 my-2">
                            <div className="flex gap-1"><p className="text-muted-foreground">Устанавливаемый скин не должен нарушать</p><Link href='/rules' className="text-orange-400 hover:text-orange-500 transition-all">правила сервера</Link></div>
                            <div className="flex 2xl:flex-row flex-col gap-2">
                                <Button variant='accent' className="flex gap-1"><CloudUpload/>Выбрать файл</Button>
                                <Button variant='destructive' className="flex gap-1"><Trash2/>Сбросить скин</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
