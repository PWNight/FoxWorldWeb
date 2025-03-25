"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {getSession, getVerifyApplications} from "@/app/actions/getDataHandlers";
import {LucideCheck, Loader2, LucideX, SearchX} from "lucide-react";
import Image from "next/image";
import ErrorMessage from "@/components/ui/notify-alert";

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
                router.push("/login?to=admin/applications")
                return
            }

            if ( !r.data.profile.hasAdmin ){
                router.push("/")
                return
            }
            setUserData(r.data)

            const verifyResponse = await getVerifyApplications(r.data.token)
            if ( !verifyResponse.success ){
                setNotifyMessage(`Произошла ошибка при загрузке заявок игроков`)
                setNotifyType('error')
                return
            }
            setVerifyApplications(verifyResponse.data)
            setPageLoaded(true)
        });
    },[router])

    const handleClose = () => {
        setNotifyMessage('')
    }

    const handleUpdate = async(status: string, nickname: string, appId: number) => {
        setUpdating(appId)

        let response = await fetch("/api/v1/users/applications", {
            headers: {
                "Authorization": `Bearer ${userData.token}`
            },
            method: "POST",
            body: JSON.stringify({
                application_id: appId,
                status,
                nickname
            })
        })
        if ( !response.ok ) {
            const errorData = await response.json()
            console.log(errorData)

            setNotifyMessage(`Произошла ошибка ${response.status} при обновлении заявки игрока`)
            setNotifyType('error')
            setUpdating(0);
            return;
        }
        response = await fetch("/api/v1/notifications", {
            headers: {
                "Authorization": `Bearer ${userData.token}`
            },
            method: "POST",
            body: JSON.stringify({
                nickname,
                message: `Ваша заявка была ${status == 'Принята' ? 'Принята. Теперь вы можете начать игру на нашем сервере.' : 'Отклонена. Причину отказа вы можете узнать в службе поддержки.'}`
            })
        })
        if ( !response.ok ) {
            const errorData = await response.json()
            console.log(errorData)

            setNotifyMessage(`Произошла ошибка ${response.status} при отправке уведомления игроку`)
            setNotifyType('error')
            setUpdating(0);
            return;
        }

        await getVerifyApplications(userData.token).then(async r => {
            if ( !r.success ){
                setNotifyMessage(`Произошла ошибка при загрузке заявок игроков`)
                setNotifyType('error')
                return
            }
            setNotifyMessage(`Заявка игрока успешно обновлена`)
            setNotifyType('success')
            setVerifyApplications(r.data)
        })

    }

    return (
        <div>
            { notifyMessage && <ErrorMessage message={notifyMessage} onClose={handleClose} type={notifyType} />}
            <h1 className="text-3xl font-bold mb-4">Управление заявками</h1>
            {!pageLoaded ? (
                <div className="flex gap-2 text-xl">
                    <Loader2 className="animate-spin" /> <p>Загружаю анкеты...</p>
                </div>
            ) :
                verifyApplications.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {verifyApplications.map((app:any) => (
                            <div key={app.id} className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4 w-fit">
                                <div className="flex flex-row gap-1 items-center mb-2">
                                    <Image
                                        src={`https://minotar.net/helm/${app.nickname}/150.png`}
                                        alt={app.nickname}
                                        width={25}
                                        height={25}
                                        quality={100}
                                        className={'rounded-md overflow-hidden'}
                                    />
                                    <div className={'flex gap-1 items-center'}>
                                        <h1 className={'text-lg font-medium'}>{app.nickname}</h1>
                                    </div>
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
                                    <button
                                        onClick={() => handleUpdate('Принята', app.nickname, app.id)}
                                        disabled={updating === app.id}
                                        className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded flex"
                                    >
                                        {updating == app.id ? <><Loader2 className="mr-2 animate-spin" /> Выполняю..</> : <><LucideCheck className={'mr-2'}/>Принять</>}
                                    </button>
                                    <button
                                        onClick={() => handleUpdate('Отклонена', app.nickname, app.id)}
                                        disabled={updating === app.id}
                                        className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded flex"
                                    >
                                        {updating == app.id ? <><Loader2 className="mr-2 animate-spin" /> Выполняю..</> : <><LucideX className={'mr-2'}/>Отклонить</>}
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
                    ): (
                    <div className='w-fit bg-neutral-100 rounded-sm p-4 dark:bg-neutral-800 flex flex-col h-fit justify-between gap-2'>
                        { notifyMessage && <ErrorMessage message={notifyMessage} onClose={handleClose} type={notifyType} />}
                        <div className=''>
                            <SearchX className='h-20 w-20'/>
                            <h1 className='text-3xl'>Заявки не найдены</h1>
                            <p>Пока что здесь вы можете найти только заявки, на которые нужен ответ.</p>
                            <p>В будущем вы сможете просматривать все заявки, которые есть в системе.</p>
                        </div>
                    </div>
                )
            }
        </div>
    )
}
