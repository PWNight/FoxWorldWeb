"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {getSession, getStats} from "@/app/actions/getInfo";
import MeSkelet, {MeStatisticSkelet} from "@/components/skelets/me_skelet";
import ErrorMessage from "@/components/ui/notify-alert";

export default function Me() {
    const [userData, setUserData] = useState(Object)
    const [statsData, setStatsData] = useState(Object)
    const [notifyMessage, setNotifyMessage] = useState('');
    const [notifyType, setNotifyType] = useState('');
    const [pageLoaded, setPageLoaded] = useState(false);
    const [statisticLoadError, setStatisticLoadError] = useState(false);
    const router = useRouter()

    useEffect(()=>{
        getSession().then(async r => {
            if (!r.success) {
                router.push("/login")
                return
            }
            setUserData(r.data)
            getStats(r.data).then(r => {
                if (!r.success) {
                    setStatisticLoadError(true);
                    setNotifyMessage(`Произошла ошибка при загрузке игровой статистики`)
                    setNotifyType('warning')
                } else {
                    setStatsData(r.data)
                }
                setPageLoaded(true)
            })
        });
    },[router])

    const handleClose = () => {
        setNotifyMessage('')
    }

    function getActivityClass(activityIndex: number) {
      if (activityIndex >= 4) return ["text-[#79C37C] font-semibold text-right", "Очень активный"];
      if (activityIndex >= 3) return ["text-[#A8D277] font-semibold text-right", "Активный"];
      if (activityIndex >= 2) return ["text-[#D9E56A] font-semibold text-right", "Постоянный"];
      if (activityIndex >= 1) return ["text-[#F3D476] font-semibold text-right", "Регулярный"];
      return ["text-[#D9DCDE] font-semibold", "Неактивный"];
    }

    if (!pageLoaded) {
        return <MeSkelet/>
    }

    return (
        <div className="grid xl:grid-cols-[.7fr_1fr] gap-6">
            {notifyMessage && <ErrorMessage message={notifyMessage} onClose={handleClose} type={notifyType} />}

            <div className="flex flex-col gap-6">
                <div className="bg-neutral-100 rounded-lg p-6 shadow-sm dark:bg-neutral-800">
                    <h1 className="text-2xl font-semibold border-b border-neutral-200 pb-3 dark:border-neutral-700">
                        Информация об аккаунте
                    </h1>
                    <div className="mt-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Никнейм</span>
                            <span>{userData.profile.nick}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Индекс активности</span>
                            {statisticLoadError ? (
                                <div className="animate-pulse w-20 h-5 bg-neutral-200 dark:bg-neutral-700 rounded" />
                            ) : (
                                <span className={getActivityClass(statsData.info.activity_index)[0]}>
                                    {statsData.info.activity_index} ({getActivityClass(statsData.info.activity_index)[1]})
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Дата регистрации</span>
                            <span className={'text-right'}>{new Date(userData.user.joined).toLocaleString("ru-RU")}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Последний вход</span>
                            <span className={'text-right'}>{new Date(userData.user.last_seen).toLocaleString("ru-RU")}</span>
                        </div>
                    </div>
                </div>
            </div>

            {statisticLoadError ? <MeStatisticSkelet/> : (
                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Блок статистики активности */}
                        <div className="bg-neutral-100 rounded-lg p-6 shadow-sm dark:bg-neutral-800">
                            <h2 className="text-xl font-medium mb-4 border-b border-neutral-200 pb-2 dark:border-neutral-700">
                                Статистика активности
                            </h2>
                            <div className="space-y-6 text-sm">
                                <div>
                                    <h3 className="text-muted-foreground font-medium mb-2">Время игры</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-muted-foreground text-sm">За всё время</h4>
                                            <p>Всего наиграно: {statsData.info.playtime}</p>
                                            <p>Активной игры: {statsData.info.active_playtime}</p>
                                            <p>В АФК: {statsData.info.afk_time}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-muted-foreground text-sm">За 30 дней</h4>
                                            <p>Всего наиграно: {statsData.online_activity.playtime_30d}</p>
                                            <p>Активной игры: {statsData.online_activity.active_playtime_30d}</p>
                                            <p>В АФК: {statsData.online_activity.afk_time_30d}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-muted-foreground font-medium mb-2">Сессии</h3>
                                    <p>Всего заходов: {statsData.info.session_count}</p>
                                    <p>За 30 дней: {statsData.online_activity.session_count_30d}</p>
                                    <p>За 7 дней: {statsData.online_activity.session_count_7d}</p>
                                </div>
                            </div>
                        </div>

                        {/* Блок статистики убийств и смертей */}
                        <div className="bg-neutral-100 rounded-lg p-6 shadow-sm dark:bg-neutral-800">
                            <h2 className="text-xl font-medium mb-4 border-b border-neutral-200 pb-2 dark:border-neutral-700">
                                Статистика убийств и смертей
                            </h2>
                            <div className="space-y-6 text-sm">
                                <div>
                                    <h3 className="text-muted-foreground font-medium mb-2">Убийства мобов</h3>
                                    <p>Всего: {statsData.kill_data.mob_kills_total}</p>
                                    <p>За 30 дней: {statsData.kill_data.mob_kills_30d}</p>
                                    <p>За 7 дней: {statsData.kill_data.mob_kills_7d}</p>
                                </div>
                                <div>
                                    <h3 className="text-muted-foreground font-medium mb-2">Убийства игроков</h3>
                                    <p>Всего: {statsData.kill_data.player_kills_total}</p>
                                    <p>За 30 дней: {statsData.kill_data.player_kills_30d}</p>
                                    <p>За 7 дней: {statsData.kill_data.player_kills_7d}</p>
                                </div>
                                <div>
                                    <h3 className="text-muted-foreground font-medium mb-2">Смерти</h3>
                                    <p>Всего: {statsData.kill_data.deaths_total}</p>
                                    <p>За 30 дней: {statsData.kill_data.deaths_30d}</p>
                                    <p>За 7 дней: {statsData.kill_data.deaths_7d}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}