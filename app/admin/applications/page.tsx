"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {getSession, getVerifyApplications} from "@/app/actions/getInfo";
import MeSkelet from "@/components/skelets/me_skelet";
import InDev from "@/components/indev";
import {LucideCheck, LucideLoader, LucideX} from "lucide-react";

export default function Me() {
    const [verifyApplications, setVerifyApplications] = useState([])

    const [notifyMessage, setNotifyMessage] = useState('');
    const [notifyType, setNotifyType] = useState('');

    const [pageLoaded, setPageLoaded] = useState(false);
    const [updating, setUpdating] = useState(null);

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

    return (
        <div className=" p-4">
            <h1 className="text-3xl font-bold mb-4">Управление заявками</h1>

            {!pageLoaded ? (
                <div className="text-center">
                    <LucideLoader className="animate-spin" /> Loading applications...
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-5 gap-4">
                    {verifyApplications.map((app:any) => (
                        <div key={app.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium mb-2">{app.nickname}</h3> {/* Nickname as title */}
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
                                <button
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                                >
                                    <LucideCheck />
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                >
                                    <LucideX />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
