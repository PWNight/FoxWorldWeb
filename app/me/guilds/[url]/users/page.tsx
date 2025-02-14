"use client"
import { useRouter } from "next/navigation";
import {useEffect, useState} from "react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {checkGuildAccess, getGuildApplications, getGuildUsers, getSession} from "@/app/actions/getInfo";
import {LucideLoader, Pencil, SearchX, Trash} from "lucide-react";
import ErrorMessage from "@/components/ui/notify-alert";

type PageProps = {
    params: Promise<{ url: string }>;
};

export default function MyGuildMembers(props: PageProps) {
    const [userData, setUserData] = useState(Object);
    const [guildUsers, setGuildUsers] = useState([]);
    const [guildApplications, setGuildApplications] = useState([]);

    const [guildUrl, setGuildUrl] = useState("");

    const [pageLoaded, setPageLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [notifyMessage, setNotifyMessage] = useState('');
    const [notifyType, setNotifyType] = useState('');

    const router = useRouter();

    useEffect(() => {
        getSession().then(async user_r => {
            if (!user_r.success) {
                router.push("/login");
                return;
            }
            setUserData(user_r.data);

            const params = await props.params;
            const { url } = params;
            setGuildUrl(url);

            const accessResult = await checkGuildAccess(url, user_r.data);
            if (!accessResult.success) {
                router.push("/me/guilds");
                return;
            }

            getGuildUsers(url).then((r)=>{
                if (!r.success) {
                    setGuildUsers([]);
                    setNotifyType('error');
                    setNotifyMessage('Не удалось получить участников гильдии');
                    setPageLoaded(true);
                    return
                }
                setGuildUsers(r.data);

                getGuildApplications(url, user_r.data.token).then((r)=>{
                    if ( !r.success ){
                       setGuildApplications([]);
                       setNotifyType('error');
                       setNotifyMessage('Не удалось получить заявки в гильдию');
                       setPageLoaded(true);
                       return
                    }
                    setGuildApplications(r.data)
                    setPageLoaded(true);
                })
            })
        });
    }, [guildUrl, props.params, router]);


    const handleUpdateUser = async (user: any, newPermission: number) => {
        setIsLoading(true);
        const session_token = userData.token;
        const response = await fetch(`/api/v1/guilds/${guildUrl}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: user.uid, permission: newPermission, session_token }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            setNotifyType('error');
            setNotifyMessage('Произошла ошибка при повышении пользователя');
            console.error(errorData);
            return
        }
        getGuildUsers(guildUrl).then((r)=>{
            if (!r.success) {
                setGuildUsers([]);
                setNotifyType('error');
                setNotifyMessage('Не удалось получить участников гильдии');
                return
            }
            setGuildUsers(r.data);
            setNotifyType('success');
            setNotifyMessage(`Пользователь успешно повышен до ${newPermission} уровня`);
            setIsLoading(false);
        })
    };

    const handleDeleteUser = async (user: any) => {
        setIsLoading(true);
        const session_token = userData.token;
        const response = await fetch(`/api/v1/guilds/${guildUrl}/users`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: user.uid, session_token }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            setNotifyType('error');
            setNotifyMessage(`Произошла ошибка ${response.status} при удалении пользователя`);
            console.error(errorData);
            return;
        }
        getGuildUsers(guildUrl).then((r)=>{
            if (!r.success) {
                setGuildUsers([]);
                setNotifyType('error');
                setNotifyMessage('Не удалось получить участников гильдии');
                return
            }
            setGuildUsers(r.data);
            setNotifyType('success');
            setNotifyMessage('Пользователь успешно исключён');
            setIsLoading(false);
        })
    };

    const handleClose = () => {
        setNotifyMessage('')
    }

    const handleApplication = async (application: any, is_accepted: boolean) => {
        setIsLoading(true);
        const user_id = application.fk_profile;
        let status;

        if ( is_accepted ) {
            status = 'Принята'
        }else{
            status = 'Отклонена'
        }

        const response = await fetch(`/api/v1/guilds/${guildUrl}/applications`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${userData.token}`,
            },
            body: JSON.stringify({ user_id, status }),
        })
        if (!response.ok) {
            const errorData = await response.json();
            setNotifyType('error');
            setNotifyMessage('Произошла ошибка при работе с заявками')
            console.error(errorData);
            setIsLoading(false);
            return;
        }
        getGuildUsers(guildUrl).then((r)=>{
            if (!r.success) {
                setGuildUsers([]);
                setNotifyType('error');
                setNotifyMessage('Не удалось получить участников гильдии');
                return
            }
            setGuildUsers(r.data);
            setNotifyType('success');
            setNotifyMessage(`Статус заявки успешно изменён на "${status}"`)
            setIsLoading(false);
        })
    }
    if (pageLoaded) {
        return (
            <div className="flex flex-col gap-2">
                { notifyMessage && <ErrorMessage message={notifyMessage} onClose={handleClose} type={notifyType} />}
                { guildUsers.length != 0
                    ? (
                        <div className="h-full w-full">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow">
                                <h2 className="text-xl font-semibold">Участники</h2>
                            </div>
                            <div className="my-2 grid xl:grid-cols-3 gap-2 xl:w-fit">
                                {guildUsers.map((user: any) => (
                                    <div key={user.uid} className="p-4 border-gray-200 dark:border-gray-700 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow flex flex-col gap-4 xl:h-fit xl:w-fit">
                                        <div className="flex items-center gap-2 w-fit ">
                                            <Image
                                                src={"https://cravatar.eu/helmavatar/" + user.nickname + "/50.png"}
                                                alt={user.nickname}
                                                width={50}
                                                height={50}
                                                quality={100}
                                                className='rounded-lg'
                                            />
                                            <h1 className='text-2xl'>{user.nickname}</h1>
                                        </div>
                                        <div>
                                            <p>Уровень доступа: {user.permission}</p>
                                            <p>Участник с {new Date(user.member_since).toLocaleString("ru-RU")}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {user.permission == 0 && (
                                                <Button onClick={() => handleUpdateUser(user, 1)} disabled={isLoading} variant={"accent"} size={"sm"}>
                                                    {isLoading ? <><LucideLoader className="mr-2 animate-spin" /> Выполняю..</> : <><Pencil className="mr-2" />Повысить</>}
                                                </Button>
                                            )}
                                            {user.permission != 2 && (
                                                <Button onClick={()=> handleDeleteUser(user)} disabled={isLoading} variant={"destructive"} size={"sm"}>
                                                    {isLoading ? <><LucideLoader className="mr-2 animate-spin" /> Выполняю..</> : <><Trash className="mr-2" />Исключить</>}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                    : (
                        <div className='sm:w-fit w-full bg-neutral-100 rounded-sm p-4 dark:bg-neutral-800 flex flex-col h-fit justify-between gap-2'>
                            <div className=''>
                                <SearchX className='h-20 w-20'/>
                                <h1 className='text-3xl'>Участники не найдены</h1>
                                <p>Попробуйте активнее агитировать о существовании своей гильдии</p>
                            </div>
                        </div>
                    )
                }
                { guildApplications.length != 0
                    ? (
                        <div className="h-full w-full">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow">
                                <h2 className="text-xl font-semibold">Заявки</h2>
                            </div>
                            <div className="my-2 grid xl:grid-cols-3 gap-2">
                                {guildApplications.map((application: any) => (
                                    <div key={application.fk_profile} className="p-4 border-gray-200 dark:border-gray-700 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow flex flex-col gap-4 xl:h-fit xl:w-fit">
                                        <div className="flex items-center gap-2 w-fit ">
                                            <Image
                                                src={"https://cravatar.eu/helmavatar/" + application.nick + "/50.png"}
                                                alt={application.nick}
                                                width={50}
                                                height={50}
                                                quality={100}
                                                className='rounded-lg'
                                            />
                                            <h1 className='text-2xl'>{application.nick}</h1>
                                        </div>
                                        <div>
                                            <p>О игроке: {application.about_user}</p>
                                            <p>Почему решил вступить к вам: {application.why_this_guild}</p>
                                            <p>Заявка создана {new Date(application.create_data).toLocaleString("ru-RU")}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button onClick={() => handleApplication(application, true)} disabled={isLoading} variant={"accent"} size={"sm"}>
                                                {isLoading ? <><LucideLoader className="mr-2 animate-spin" /> Выполняю..</> : <><Pencil className="mr-2" />Принять</>}
                                            </Button>
                                            <Button onClick={()=> handleApplication(application, false)} disabled={isLoading} variant={"destructive"} size={"sm"}>
                                                {isLoading ? <><LucideLoader className="mr-2 animate-spin" /> Выполняю..</> : <><Trash className="mr-2" />Отклонить</>}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                    : (
                        <div className='sm:w-fit w-full bg-neutral-100 rounded-sm p-4 dark:bg-neutral-800 flex flex-col h-fit justify-between gap-2'>
                            <div className=''>
                                <SearchX className='h-20 w-20'/>
                                <h1 className='text-3xl'>Заявки не найдены</h1>
                                <p>Попробуйте активнее агитировать о существовании своей гильдии</p>
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="h-full w-full">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow">
                    <h2 className="text-xl font-semibold">Участники</h2>
                </div>
                <div className="my-2 grid sm:grid-cols-3 gap-2">
                    {
                      Array(3).fill(null).map((_, key) => (
                        <div key={key} className="w-full bg-neutral-100 rounded-sm p-4 dark:bg-neutral-800 h-fit flex flex-col gap-4 animate-pulse">
                          <div className="flex items-center gap-2 w-fit">
                            <div className="rounded-lg bg-gray-300 dark:bg-gray-700 w-12 h-12"></div>
                            <div className="bg-gray-300 dark:bg-gray-700 w-24 h-6 rounded"></div>
                          </div>
                          <div>
                            <div className="bg-gray-300 dark:bg-gray-700 w-32 h-4 rounded mb-2"></div>
                            <div className="bg-gray-300 dark:bg-gray-700 w-48 h-4 rounded"></div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="bg-gray-300 dark:bg-gray-700 w-20 h-8 rounded"></div>
                            <div className="bg-gray-300 dark:bg-gray-700 w-24 h-8 rounded"></div>
                          </div>
                        </div>
                      ))
                    }
                </div>
            </div>
            <div className="h-full w-full">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow">
                    <h2 className="text-xl font-semibold">Заявки</h2>
                </div>
                <div className="my-2 grid sm:grid-cols-3 gap-2">
                    {
                      Array(3).fill(null).map((_, key) => (
                        <div key={key} className="w-full bg-neutral-100 rounded-sm p-4 dark:bg-neutral-800 h-fit flex flex-col gap-4 animate-pulse">
                          <div className="flex items-center gap-2 w-fit">
                            <div className="rounded-lg bg-gray-300 dark:bg-gray-700 w-12 h-12"></div>
                            <div className="bg-gray-300 dark:bg-gray-700 w-24 h-6 rounded"></div>
                          </div>
                          <div>
                            <div className="bg-gray-300 dark:bg-gray-700 w-32 h-4 rounded mb-2"></div>
                            <div className="bg-gray-300 dark:bg-gray-700 w-48 h-4 rounded"></div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="bg-gray-300 dark:bg-gray-700 w-20 h-8 rounded"></div>
                            <div className="bg-gray-300 dark:bg-gray-700 w-24 h-8 rounded"></div>
                          </div>
                        </div>
                      ))
                    }
                </div>
            </div>
        </div>
    );
}