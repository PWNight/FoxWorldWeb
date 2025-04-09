"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {Button, buttonVariants} from "@/components/ui/button";
import {
    getGuildApplications,
    getGuildUser,
    getGuildUsers,
    getSession
} from "@/app/actions/getDataHandlers";
import {ArrowLeft, Loader2, Pencil, SearchX, Trash, ArrowDown, ArrowUp} from "lucide-react";
import ErrorMessage from "@/components/ui/notify-alert";
import Link from "next/link";
import {sendNotification} from "@/app/actions/actionHandlers";

type PageProps = {
    params: Promise<{ url: string }>;
};

export default function MyGuildMembers(props: PageProps) {
    const [userData, setUserData] = useState(Object);
    const [guildUsers, setGuildUsers] = useState([]);
    const [guildApplications, setGuildApplications] = useState([]);
    const [currentUserPermission, setCurrentUserPermission] = useState(0);

    const [guildUrl, setGuildUrl] = useState("");

    const [pageLoaded, setPageLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [notifyMessage, setNotifyMessage] = useState('');
    const [notifyType, setNotifyType] = useState('');

    const router = useRouter();

    const fetchGuildData = async (url: string, token: string) => {
        const usersResult = await getGuildUsers(url);
        if (!usersResult.success) {
            setGuildUsers([]);
            setNotifyType('error');
            setNotifyMessage('Не удалось получить участников гильдии');
        }

        setGuildUsers(usersResult.data);

        const appsResult = await getGuildApplications(url, token);
        if (!appsResult.success) {
            setGuildApplications([]);
            setNotifyType('error');
            setNotifyMessage('Не удалось получить заявки в гильдию');
        }

        setGuildApplications(appsResult.data);
    };

    useEffect(() => {
        let intervalId : any;

        const initializeData = async () => {
            const params = await props.params;
            const { url } = params;
            setGuildUrl(url);

            const sessionResult = await getSession();
            if (!sessionResult.success) {
                router.push(`/login?to=me/guilds/${url}/users`);
                return;
            }

            setUserData(sessionResult.data);

            const guildUserResult = await getGuildUser(url, sessionResult.data.profile.id);
            if (!guildUserResult.success) {
                router.push("/me/guilds");
                return;
            }
            if (guildUserResult.data.permission < 1) {
                router.push("/me/guilds");
                return;
            }

            setCurrentUserPermission(guildUserResult.data.permission);
            await fetchGuildData(url, sessionResult.data.token);

            setPageLoaded(true);

            intervalId = setInterval(async () => {
                await fetchGuildData(url, sessionResult.data.token);
            }, 15000);
        };

        initializeData();

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [props.params, router]);

    const handleUpdateUser = async (user : any, newPermission : any) => {
        setIsLoading(true);

        // Подтверждение для повышения до уровня 2
        if (newPermission === 2) {
            const confirmTransfer = confirm(`Вы уверены, что хотите передать гильдию ${guildUrl} пользователю ${user.nickname}? Это сделает его новым главой, а вы потеряете права владельца.`);
            if (!confirmTransfer) {
                setIsLoading(false);
                return;
            }
        }

        const updateResult = await fetch(`/api/v1/guilds/${guildUrl}/users/${user.uid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${userData.token}`,
            },
            body: JSON.stringify({ permission: newPermission }),
        });

        if (!updateResult.ok) {
            const errorData = await updateResult.json();
            console.log(errorData)

            setNotifyType('error');
            setNotifyMessage(`Произошла ошибка ${updateResult.status} при изменении уровня пользователя`);
            setIsLoading(false);
            return;
        }

        const notifyResult = await sendNotification(
            user.uid,
            userData.token,
            newPermission === 2
                ? `Вы стали новым главой гильдии /${guildUrl}!`
                : `Ваш уровень в гильдии /${guildUrl} изменён на ${newPermission}`
        );
        if (!notifyResult.success) {
            setNotifyMessage(`Произошла ошибка ${notifyResult.code} при отправке уведомления`);
            setNotifyType("error");
            return;
        }

        await fetchGuildData(guildUrl, userData.token);

        setNotifyType('success');
        setNotifyMessage(
            newPermission === 2
                ? `Гильдия передана ${user.nickname}`
                : `Уровень пользователя изменён на ${newPermission}`
        );

        // Если передали права владельца, перенаправляем на страницу гильдий
        if (newPermission === 2) {
            router.push('/me/guilds');
        }

        setIsLoading(false);
    };

    const handleDeleteUser = async (user : any) => {
        const confirmDelete = confirm(`Вы уверены, что хотите исключить ${user.nickname} из гильдии ${guildUrl}?`);
        if (!confirmDelete) {
            return;
        }

        setIsLoading(true);

        const deleteResult = await fetch(`/api/v1/guilds/${guildUrl}/users/${user.uid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${userData.token}`,
            }
        });

        if (!deleteResult.ok) {
            const errorData = await deleteResult.json();
            console.log(errorData)

            setNotifyType('error');
            setNotifyMessage(`Произошла ошибка ${deleteResult.status} при удалении пользователя`);
            setIsLoading(false);
            return;
        }

        const notifyResult = await sendNotification(user.uid, userData.token, `Вы были исключены из гильдии /${guildUrl}`)
        if (!notifyResult.success) {
            setNotifyMessage(`Произошла ошибка ${notifyResult.code} при отправке уведомления`);
            setNotifyType("error");
            return;
        }

        await fetchGuildData(guildUrl, userData.token);

        setNotifyType('success');
        setNotifyMessage(`Пользователь ${user.nickname} исключён`);

        setIsLoading(false);
    };

    const handleClose = () => setNotifyMessage('');

    const handleApplication = async (application : any, is_accepted : any) => {
        setIsLoading(true);

        const uId = application.fk_profile;
        const status = is_accepted ? 'Принята' : 'Отклонена';

        const updateResult = await fetch(`/api/v1/guilds/${guildUrl}/applications`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${userData.token}` },
            body: JSON.stringify({ uId, status }),
        });

        if (!updateResult.ok) {
            const errorData = await updateResult.json();
            console.log(errorData)

            setNotifyType('error');
            setNotifyMessage(`Произошла ошибка ${updateResult.status} при обработке заявки`);
            setIsLoading(false);
            return;
        }

        const notifyResult = await sendNotification(uId, userData.token, `Ваша заявка в гильдию /${guildUrl} была ${is_accepted ? 'принята' : 'отклонена'}.`)
        if (!notifyResult.success) {
            setNotifyMessage(`Произошла ошибка ${notifyResult.code} при отправке уведомления`);
            setNotifyType("error");
            return;
        }

        await fetchGuildData(guildUrl, userData.token);

        setNotifyType('success');
        setNotifyMessage(`Заявка изменена на "${status}"`);

        setIsLoading(false);
    };

    if (!pageLoaded) {
        return (
            <div className='px-4'>
                <div className="max-w-9xl space-y-8">
                    {['Участники', 'Заявки'].map((title, index) => (
                        <div key={index} className="space-y-4">
                            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow p-4">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {Array(6).fill(null).map((_, key) => (
                                    <div key={key} className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 shadow animate-pulse">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-gray-300 dark:bg-neutral-700 rounded-lg"></div>
                                            <div className="h-6 w-32 bg-gray-300 dark:bg-neutral-700 rounded"></div>
                                        </div>
                                        <div className="space-y-2 mb-4">
                                            <div className="h-4 w-3/4 bg-gray-300 dark:bg-neutral-700 rounded"></div>
                                            <div className="h-4 w-1/2 bg-gray-300 dark:bg-neutral-700 rounded"></div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="h-8 w-20 bg-gray-300 dark:bg-neutral-700 rounded"></div>
                                            <div className="h-8 w-20 bg-gray-300 dark:bg-neutral-700 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className='px-4'>
            <div className="max-w-9xl space-y-8">
                {notifyMessage && <ErrorMessage message={notifyMessage} onClose={handleClose} type={notifyType} />}
                <Link href={'/me/guilds'} className={buttonVariants({variant: "accent"})+"flex flex-row gap-2 !mb-4"}>
                    <ArrowLeft/>
                    Обратно к гильдиям
                </Link>
                {/* Участники */}
                <div className="space-y-4">
                    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow p-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Участники</h2>
                    </div>
                    {guildUsers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {guildUsers.map((user: any) => (
                                <div key={user.uid} className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 shadow hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Image
                                            src={`https://minotar.net/helm/${user.nickname}/150.png`}
                                            alt={user.nickname}
                                            width={48}
                                            height={48}
                                            quality={100}
                                            className="rounded-lg"
                                        />
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{user.nickname}</h3>
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        <p>Уровень доступа: {user.permission}</p>
                                        <p>Участник с: {new Date(user.member_since).toLocaleString("ru-RU")}</p>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        {currentUserPermission === 2 && (
                                            <>
                                                {user.permission === 0 && (
                                                    <Button
                                                        onClick={() => handleUpdateUser(user, 2)}
                                                        disabled={isLoading}
                                                        variant="accent"
                                                        size="sm"
                                                        className="flex-1 min-w-[100px]"
                                                    >
                                                        {isLoading ? (
                                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Выполняю...</>
                                                        ) : (
                                                            <><ArrowUp className="w-4 h-4 mr-2" />Сделать главой</>
                                                        )}
                                                    </Button>
                                                )}
                                                {user.permission === 1 && (
                                                    <Button
                                                        onClick={() => handleUpdateUser(user, 2)}
                                                        disabled={isLoading}
                                                        variant="accent"
                                                        size="sm"
                                                        className="flex-1 min-w-[100px]"
                                                    >
                                                        {isLoading ? (
                                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Выполняю...</>
                                                        ) : (
                                                            <><ArrowUp className="w-4 h-4 mr-2" />Сделать главой</>
                                                        )}
                                                    </Button>
                                                )}
                                                {user.permission === 1 && (
                                                    <Button
                                                        onClick={() => handleUpdateUser(user, 0)}
                                                        disabled={isLoading}
                                                        variant="destructive"
                                                        size="sm"
                                                        className="flex-1 min-w-[100px]"
                                                    >
                                                        {isLoading ? (
                                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Выполняю...</>
                                                        ) : (
                                                            <><ArrowDown className="w-4 h-4 mr-2" />Понизить</>
                                                        )}
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                        {(currentUserPermission === 2 || (currentUserPermission === 1 && user.permission === 0)) && (
                                            <>
                                                {user.permission === 0 && currentUserPermission !== 2 && (
                                                    <Button
                                                        onClick={() => handleUpdateUser(user, 1)}
                                                        disabled={isLoading}
                                                        variant="accent"
                                                        size="sm"
                                                        className="flex-1 min-w-[100px]"
                                                    >
                                                        {isLoading ? (
                                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Выполняю...</>
                                                        ) : (
                                                            <><Pencil className="w-4 h-4 mr-2" />Повысить</>
                                                        )}
                                                    </Button>
                                                )}
                                                {user.permission !== 2 && (
                                                    <Button
                                                        onClick={() => handleDeleteUser(user)}
                                                        disabled={isLoading}
                                                        variant="destructive"
                                                        size="sm"
                                                        className="flex-1 min-w-[100px]"
                                                    >
                                                        {isLoading ? (
                                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Выполняю...</>
                                                        ) : (
                                                            <><Trash className="w-4 h-4 mr-2" />Исключить</>
                                                        )}
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-6 shadow text-center">
                            <SearchX className="w-16 h-16 mx-auto text-gray-500 dark:text-gray-400 mb-4" />
                            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">Участники не найдены</h3>
                            <p className="text-gray-600 dark:text-gray-400">Активнее продвигайте свою гильдию!</p>
                        </div>
                    )}
                </div>

                {/* Заявки */}
                {currentUserPermission >= 1 && (
                    <div className="space-y-4">
                        <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow p-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Заявки</h2>
                        </div>
                        {guildApplications.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {guildApplications.map((application:any) => (
                                    <div key={application.fk_profile} className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 shadow hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Image
                                                src={`https://minotar.net/helm/${application.nick}/150.png`}
                                                alt={application.nick}
                                                width={48}
                                                height={48}
                                                quality={100}
                                                className="rounded-lg"
                                            />
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{application.nick}</h3>
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                            <p><span className="font-medium">О себе:</span> {application.about_user}</p>
                                            <p><span className="font-medium">Почему выбрал:</span> {application.why_this_guild}</p>
                                            <p><span className="font-medium">Дата заявки:</span> {new Date(application.create_data).toLocaleString("ru-RU")}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handleApplication(application, true)}
                                                disabled={isLoading}
                                                variant="accent"
                                                size="sm"
                                                className="flex-1"
                                            >
                                                {isLoading ? (
                                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Выполняю...</>
                                                ) : (
                                                    <><Pencil className="w-4 h-4 mr-2" />Принять</>
                                                )}
                                            </Button>
                                            <Button
                                                onClick={() => handleApplication(application, false)}
                                                disabled={isLoading}
                                                variant="destructive"
                                                size="sm"
                                                className="flex-1"
                                            >
                                                {isLoading ? (
                                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Выполняю...</>
                                                ) : (
                                                    <><Trash className="w-4 h-4 mr-2" />Отклонить</>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-6 shadow text-center">
                                <SearchX className="w-16 h-16 mx-auto text-gray-500 dark:text-gray-400 mb-4" />
                                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">Заявки не найдены</h3>
                                <p className="text-gray-600 dark:text-gray-400">Активнее продвигайте свою гильдию!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}