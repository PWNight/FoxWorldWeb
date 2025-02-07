"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { checkGuildAccess, getGuildUsers, getSession } from "@/app/actions/getInfo";

type PageProps = {
    params: Promise<{ url: string }>;
};

export default function MyGuildMembers(props: PageProps) {
    const [pageLoaded, setPageLoaded] = useState(false);
    const [guildUsers, setGuildUsers] = useState([]);
    const [guildUrl, setGuildUrl] = useState("");
    const [userData, setUserData] = useState(Object);
    const router = useRouter();

    const fetchGuildUsers = (url: string) => {
        getGuildUsers(url).then((r) => {
            if (!r.success) {
                router.push("/me/guilds");
                return;
            }
            setGuildUsers(r.data);
            setPageLoaded(true);
        });
    };

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

            checkGuildAccess(url, r.data).then((r) => {
                if (!r.success) {
                    router.push("/me/guilds");
                    return;
                }
                fetchGuildUsers(url);
            });
        });
    }, [router, props, fetchGuildUsers]);

    const handleUpdateUser = async (user: any, newPermission: number) => {
        try {
            const session_token = user.token;
            const response = await fetch(`/api/v1/guilds/${guildUrl}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: user.uid, permission: newPermission, session_token }),
            });

            if (!response.ok) {
                // TODO: Implement error handler
                return
            }

            fetchGuildUsers(guildUrl); // Refresh user list after update
            // TODO: Implement success handler
        } catch (error) {
            // TODO: Implement error handler
        }
    };


    const handleDeleteUser = async (user: any) => {
        try {
            const session_token = userData.token
            const response = await fetch(`/api/v1/guilds/${guildUrl}/users`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: user.uid, session_token}),
            });
            const json = await response.json();
            console.log(json);
            console.log(user)
            if (!response.ok) {
                // TODO: Implement error handler
                return
            }
            fetchGuildUsers(guildUrl);
            // TODO: Implement success handler
        } catch (error) {
            // TODO: Implement error handler
        }
    };

    if (pageLoaded) {
        return (
            <div className="flex flex-col gap-2 w-fit">
                {guildUsers.map((user: any, key: any) => (
                    <div key={key} className="bg-neutral-100 rounded-sm p-4 dark:bg-neutral-800 h-fit w-fit flex flex-col gap-4">
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
                                <Button onClick={() => handleUpdateUser(user, 2)}>
                                    Передать гильдию
                                </Button>
                                <Button onClick={() => handleDeleteUser(user)}>
                                    Исключить игрока
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
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