"use client"
import { useRouter } from "next/navigation";
import {useEffect, useState} from "react";
import Image from "next/image";
import {Button, buttonVariants} from "@/components/ui/button";
import { checkGuildAccess, getGuildUsers, getSession } from "@/app/actions/getInfo";
import {LucideLoader, Pencil, Trash} from "lucide-react";

type PageProps = {
    params: Promise<{ url: string }>;
};

export default function MyGuildMembers(props: PageProps) {
    const [pageLoaded, setPageLoaded] = useState(false);
    const [guildUsers, setGuildUsers] = useState([]);
    const [guildUrl, setGuildUrl] = useState("");
    const [userData, setUserData] = useState(Object);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        getSession().then(async r => {
            if (!r.success) {
                router.push("/login");
                return;
            }
            setUserData(r.data);

            const params = await props.params;
            const { url } = params;
            setGuildUrl(url);

            const accessResult = await checkGuildAccess(url, r.data);
            if (!accessResult.success) {
                router.push("/me/guilds");
                return;
            }

            getGuildUsers(url).then((r)=>{
                if (!r.success) {
                    router.push("/me/guilds");
                    return;
                }
                setGuildUsers(r.data);
                setPageLoaded(true);
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
            console.error("Error updating user:", errorData);
            // TODO: Implement more robust error handling, show message to the user
            return;
        }
        getGuildUsers(guildUrl).then((r)=>{
            if (!r.success) {
                router.push("/me/guilds");
                return;
            }
            setGuildUsers(r.data);
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
            console.error("Error deleting user:", errorData);
            // TODO: Implement error handler
            return;
        }
        getGuildUsers(guildUrl).then((r)=>{
            if (!r.success) {
                router.push("/me/guilds");
                return;
            }
            setGuildUsers(r.data);
            setIsLoading(false);
        })
        // TODO: Implement success handler
    };

    if (pageLoaded) {
        return (
            <div className="flex flex-col gap-2">
                <div className="h-fit w-fit">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow">
                        <h2 className="text-xl font-semibold">Участники гильдии</h2>
                    </div>
                    <div className="my-2 grid sm:grid-cols-3">
                        {guildUsers.map((user: any) => (
                            <div key={user.uid} className="p-4 border-gray-200 dark:border-gray-700 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow flex flex-col gap-4">
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
                                {user.permission !== 2 && (
                                    <div className="flex items-center gap-2">
                                        <Button onClick={() => handleUpdateUser(user, 2)} disabled={isLoading} variant={"accent"} size={"sm"}>
                                            {isLoading ? <><LucideLoader className="mr-2 animate-spin" /> Выполняю..</> : <><Pencil className="mr-2" />Повысить</>}
                                        </Button>
                                        <Button onClick={()=> handleDeleteUser(user)} disabled={isLoading} variant={"accent"} size={"sm"}>
                                            {isLoading ? <><LucideLoader className="mr-2 animate-spin" /> Выполняю..</> : <><Trash className="mr-2" />Исключить</>}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="h-fit w-fit">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow">
                        <h2 className="text-xl font-semibold">Заявки на вступление</h2>
                    </div>
                    <div className="my-2 grid sm:grid-cols-3">
                        {guildUsers.map((user: any) => (
                            <div key={user.uid} className="p-4 border-gray-200 dark:border-gray-700 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow flex flex-col gap-4">
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
                                {user.permission == 2 && (
                                    <div className="flex items-center gap-2">
                                        <Button onClick={() => handleUpdateUser(user, 2)} disabled={isLoading} variant={"accent"} size={"sm"}>
                                            {isLoading ? <><LucideLoader className="mr-2 animate-spin" /> Выполняю..</> : <><Pencil className="mr-2" />Принять</>}
                                        </Button>
                                        <Button onClick={()=> handleDeleteUser(user)} disabled={isLoading} variant={"destructive"} size={"sm"}>
                                            {isLoading ? <><LucideLoader className="mr-2 animate-spin" /> Выполняю..</> : <><Trash className="mr-2" />Отклонить</>}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid sm:grid-cols-4 grid-cols-2 gap-2 sm:w-fit w-full">
          {Array(5).fill(null).map((_, key) => ( // Render 5 skeleton items
            <div key={key} className="w-full bg-neutral-100 rounded-sm p-4 dark:bg-neutral-800 h-fit flex flex-col gap-4 animate-pulse">
              <div className="flex items-center gap-2 w-fit">
                <div className="rounded-lg bg-gray-300 dark:bg-gray-700 w-12 h-12"></div> {/* Avatar placeholder */}
                <div className="bg-gray-300 dark:bg-gray-700 w-24 h-6 rounded"></div> {/* Nickname placeholder */}
              </div>
              <div>
                <div className="bg-gray-300 dark:bg-gray-700 w-32 h-4 rounded mb-2"></div> {/* Permission placeholder */}
                <div className="bg-gray-300 dark:bg-gray-700 w-48 h-4 rounded"></div> {/* Member since placeholder */}
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-gray-300 dark:bg-gray-700 w-20 h-8 rounded"></div> {/* Button placeholder */}
                <div className="bg-gray-300 dark:bg-gray-700 w-24 h-8 rounded"></div> {/* Button placeholder */}
              </div>
            </div>
          ))}
        </div>
    )
}