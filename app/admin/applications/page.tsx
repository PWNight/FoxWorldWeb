"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {getSession, getVerifyApplications} from "@/app/actions/getInfo";
import MeSkelet from "@/components/skelets/me_skelet";
import InDev from "@/components/indev";
import {LucideCheck, LucideLoader, LucideX} from "lucide-react";
import Image from "next/image";

export default function VerifyApplications() {
    const [userData, setUserData] = useState(Object)
    const [verifyApplications, setVerifyApplications] = useState([])

    const [notifyMessage, setNotifyMessage] = useState('');
    const [notifyType, setNotifyType] = useState('');

    const [pageLoaded, setPageLoaded] = useState(false);
    const [updating, setUpdating] = useState(0);

    const router = useRouter()

    useEffect(()=>{
        getSession().then(async r => {
            if ( !r.success ) {
                router.push("/login")
                return
            }

            if ( !['dev','staff'].includes(r.data.group) ){
                router.push("/")
                return
            }
            setUserData(r.data)

            const verifyResponse = await getVerifyApplications(r.data.token)
            if ( !verifyResponse.success ){
                //TODO: Implement error handler
                return
            }
            setVerifyApplications(verifyResponse.data)
            setPageLoaded(true)
        });
    },[router])

    const handleClose = () => {
        setNotifyMessage('')
    }

    const handleUpdate = async(status: string, appId: number) => {
        setUpdating(appId)
        const response = await fetch("/api/v1/users/applications", {
            headers: {
                "Authorization": `Bearer ${userData.token}`
            },
            method: "POST",
            body: JSON.stringify({
                applicationId: appId,
                status: status,
            })
        })

        if ( !response.ok ) {
            //TODO: Implement error handler
            return;
        }
        const json = await response.json();
        if ( !json.success ){
            //TODO: Implement error handler
            return
        }

        await getVerifyApplications(userData.token).then(async r => {
            if ( !r.success ){
                //TODO: Implement error handler
                return
            }
            setVerifyApplications(r.data)
        })
    }

    return (
        <div className=" p-4">
            <h1 className="text-3xl font-bold mb-4">Управление заявками</h1>

            {!pageLoaded ? (
                <div className="flex gap-2 text-xl">
                    <LucideLoader className="animate-spin" /> <p>Загружаю анкеты...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {verifyApplications.map((app:any) => (
                        <div key={app.id} className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
                            <div className="flex flex-row gap-1 items-center mb-2">
                                <Image
                                    src={"https://minotar.net/helm/" + app.nickname + "/25.png"}
                                    alt={app.nickname}
                                    width={25}
                                    height={25}
                                    quality={100}
                                    className={'rounded-md overflow-hidden'}
                                />
                                <h1 className={'text-lg font-medium'}>{app.nickname}</h1>
                            </div>
                            <div className="mb-2">
                                <p className="text-gray-500 dark:text-gray-400">Возраст: {app.age}</p>
                            </div>
                            <div className="mb-2">
                                <p className="text-gray-500 dark:text-gray-400">О себе: {app.about}</p>
                            </div>
                            <div className="mb-2">
                                <p className="text-gray-500 dark:text-gray-400">Откуда узнал: {app.where_find}</p>
                            </div>
                            <div className="mb-2">
                                <p className="text-gray-500 dark:text-gray-400">Планы: {app.plans}</p>
                            </div>
                            <div className="mb-4">
                                <p className={`font-medium ${
                                    app.status === 'approved' ? 'text-green-500' :
                                        app.status === 'rejected' ? 'text-red-500' :
                                            'text-yellow-500' // Pending or other statuses
                                }`}>
                                    Статус: {app.status}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {updating == app.id ? <p><LucideLoader className="animate-spin w-4 h-4"/> Выполняю</p> :
                                    <button
                                        onClick={() => handleUpdate('Принята',app.id)}
                                        disabled={updating === app.id}
                                        className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded flex"
                                    >
                                        <LucideCheck /> Принять
                                    </button>
                                }
                                {updating == app.id ? <p><LucideLoader className="animate-spin w-4 h-4"/> Выполняю</p> :
                                    <button
                                        onClick={() => handleUpdate('Отклонена',app.id)}
                                        disabled={updating === app.id}
                                        className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded flex"
                                    >
                                        <LucideX /> Отклонить
                                    </button>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
