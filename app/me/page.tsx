"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CloudUpload, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {NavMe} from "@/components/navbar_me";

export default function Me() {
    const [userData, setUserData] = useState(Object)
    const [statsData, setStatsData] = useState(Object)
    const router = useRouter()
    
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
            return {success: true, data: json}
        }
        async function getStats(data : any){
            const response = await fetch(`https://foxworldstatisticplan.dynmap.xyz/v1/player?player=${data.profile.fk_uuid}`,{
                method: "GET"
            })
            if ( !response.ok ) {
                return { success: false }
            }
            return { success: true, data: await response.json() };
        }
        getSession().then(async r => {
            if ( !r.success ) {
                router.push("/login")
                return
            }
            setUserData(r.data)
            getStats(r.data).then(r => {
                if ( !r.success ) {
                    // TODO: Implement error handler when stats load failed
                    return
                }
                setStatsData(r.data)
            })
        });
        //TODO: Page loaded state update (in last async function)
    },[router])

    if(Object.keys(userData).length != 0 && Object.keys(statsData).length != 0){
        return (
            <div className="grid sm:grid-cols-[300px,1fr] gap-6 mt-6">
                <NavMe/>
                <div className="grid lg:grid-cols-[.6fr,1fr] gap-2 mb-6">
                    <div className="flex flex-col gap-2 ">
                        <div className="bg-neutral-100 rounded-sm p-4 flex justify-center flex-col dark:bg-neutral-800">
                            <div className="border-b">
                                <h1 className="text-2xl">Информация об аккаунте</h1>
                                <p className="text-muted-foreground">Основная информация о вас</p>
                            </div>
                            <div className="my-2">
                                <div className="flex flex-col gap-1">
                                    <div className="xl:flex gap-2"><p className="text-muted-foreground">Ваш никнейм</p><p>{userData.profile.nick}</p></div>
                                    <div className="xl:flex gap-2"><p className="text-muted-foreground">Ваш индекс активности</p><p>{statsData.info.activity_index}</p></div>
                                    <div className="xl:flex gap-2"><p className="text-muted-foreground">Вы создали аккаунт</p><p>{new Date(userData.user.joined).toLocaleString("ru-RU")}</p></div>
                                    <div className="xl:flex gap-2"><p className="text-muted-foreground">Последний раз входили</p><p>{new Date(userData.user.last_seen).toLocaleString("ru-RU")}</p></div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-neutral-100 rounded-sm p-4 max-h-fit flex justify-center flex-col dark:bg-neutral-800">
                            <div className="border-b">
                                <h1 className="text-2xl">Управление скином</h1>
                                <p className="text-muted-foreground">Здесь вы можете изменить свой скин</p>
                            </div>
                            <div className="flex flex-col gap-4 my-2">
                                <Link href='/wiki/rules' className="text-orange-400 hover:text-orange-500 transition-all"><p className="text-muted-foreground">Устанавливаемый скин не должен нарушать</p>правила сервера</Link>
                                <div className="flex 2xl:flex-row flex-col gap-2">
                                    <Button variant='accent' className="flex gap-1"><CloudUpload/>Выбрать файл</Button>
                                    <Button variant='destructive' className="flex gap-1"><Trash2/>Сбросить скин</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="bg-neutral-100 rounded-sm p-4 lg:row-span-1 lg:col-span-2 dark:bg-neutral-800">
                            <div className="border-b">
                                <h1 className="text-2xl">Игровая статистика</h1>
                                <p className="text-muted-foreground">Статистика вашей игры</p>
                            </div>
                            <div className="my-2">
                                <div className="gap-2 grid 2xl:grid-cols-2">
                                    <div>
                                        <p className="text-muted-foreground text-xl">Статистика активности</p>
                                        <div className="flex flex-col gap-2 text-sm">
                                            <div>
                                                <h1 className="text-muted-foreground text-lg">За всё время</h1>
                                                <div className="flex gap-1"><p className="text-muted-foreground">Всего
                                                    наиграно</p><p>{statsData.info.playtime}</p></div>
                                                <div className="flex gap-1"><p>{statsData.info.active_playtime}</p><p
                                                    className="text-muted-foreground">активной игры</p></div>
                                                <div className="flex gap-1"><p>{statsData.info.afk_time}</p><p
                                                    className="text-muted-foreground">в афк</p></div>
                                            </div>
                                            <div>
                                                <h1 className="text-muted-foreground text-lg">За 30 дней</h1>
                                                <div className="flex gap-1"><p className="text-muted-foreground">Всего
                                                    наиграно</p><p>{statsData.online_activity.playtime_30d}</p></div>
                                                <div className="flex gap-1">
                                                    <p>{statsData.online_activity.active_playtime_30d}</p><p
                                                    className="text-muted-foreground">активной игры</p></div>
                                                <div className="flex gap-1">
                                                    <p>{statsData.online_activity.afk_time_30d}</p><p
                                                    className="text-muted-foreground">в афк</p></div>
                                            </div>
                                            <div>
                                                <h1 className="text-muted-foreground text-lg">Ваши сессии</h1>
                                                <div className="flex gap-1"><p className="text-muted-foreground">Всего
                                                    вы зашли к нам</p><p>{statsData.info.session_count}</p><p
                                                    className="text-muted-foreground">раз</p></div>
                                                <div className="flex gap-1">
                                                    <p>{statsData.online_activity.session_count_30d}</p><p
                                                    className="text-muted-foreground">раз(-а) за последние 30 дней</p>
                                                </div>
                                                <div className="flex gap-1">
                                                    <p>{statsData.online_activity.session_count_7d}</p><p
                                                    className="text-muted-foreground">раз(-а) за последние 7 дней</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-xl">Статистика убийств и
                                            смертей</p>
                                        <div className="flex flex-col gap-2">
                                        <div className='text-sm'>
                                                <h1 className="text-muted-foreground text-lg">Убийства мобов</h1>
                                                <div className="flex gap-1"><p className="text-muted-foreground">Всего
                                                    вы убили</p><p>{statsData.kill_data.mob_kills_total}</p><p
                                                    className="text-muted-foreground">животных</p></div>
                                                <div className="flex gap-1"><p>{statsData.kill_data.mob_kills_30d}</p><p
                                                    className="text-muted-foreground">раз(-а) за последние 30 дней</p>
                                                </div>
                                                <div className="flex gap-1"><p>{statsData.kill_data.mob_kills_7d}</p><p
                                                    className="text-muted-foreground">раз(-а) за последние 7 дней</p>
                                                </div>
                                            </div>
                                            <div>
                                                <h1 className="text-muted-foreground text-lg">Убийства игроков</h1>
                                                <div className="flex gap-1"><p className="text-muted-foreground">Всего
                                                    вы убили</p><p>{statsData.kill_data.player_kills_total}</p><p
                                                    className="text-muted-foreground">игроков</p></div>
                                                <div className="flex gap-1">
                                                    <p>{statsData.kill_data.player_kills_30d}</p><p
                                                    className="text-muted-foreground">раз(-а) за последние 30 дней</p>
                                                </div>
                                                <div className="flex gap-1"><p>{statsData.kill_data.player_kills_7d}</p>
                                                    <p className="text-muted-foreground">раз(-а) за последние 7 дней</p>
                                                </div>
                                            </div>
                                            <div>
                                                <h1 className="text-muted-foreground text-lg">Ваши смерти</h1>
                                                <div className="flex gap-1"><p className="text-muted-foreground">Всего
                                                    вы умерли</p><p>{statsData.kill_data.deaths_total}</p><p
                                                    className="text-muted-foreground">раз(-а)</p></div>
                                                <div className="flex gap-1"><p>{statsData.kill_data.deaths_30d}</p><p
                                                    className="text-muted-foreground">раз(-а) за последние 30 дней</p>
                                                </div>
                                                <div className="flex gap-1"><p>{statsData.kill_data.deaths_7d}</p><p
                                                    className="text-muted-foreground">раз(-а) за последние 7 дней</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
