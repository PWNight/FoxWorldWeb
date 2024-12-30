"use client"
import { Button, buttonVariants } from "./ui/button";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import Anchor from "./anchor";
import { usePathname, useRouter } from "next/navigation";

export function AccountButton() {
    const [userData, setUserData] = useState(Object);
    const pathname = usePathname();
    const router = useRouter();

    async function logOut(){
        if(Object.keys(userData).length != 0){
            const response = await fetch("/api/v1/auth/logout",{
                method: "GET"
            })
            if(response.ok){
                Object.keys(userData).length = 0
                router.push('/')
            }
        }
    }

    useEffect(() => {
        async function getSession(){
            const response = await fetch("/api/v1/users/me",{
                method: "GET"
            })
            if(!response.ok){
                // TODO: Implement error handler
                console.log(response)
                return
            }

            const json = await response.json()
            if (!json.success) {
                setUserData({})
            }else{
                setUserData(json)
            }
        }
        getSession(); // Обновляем данные пользователя при монтировании компонента и изменении маршрута
    }, [pathname, router]);
    if (Object.keys(userData).length != 0) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <img className='rounded-lg' src={"https://mineskin.eu/helm/" + userData.profile.nick}></img>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="p-4 mt-2 py-10 flex flex-col gap-10 rounded-lg">
                    <DropdownMenuItem className="text-xl" onClick={() => router.push('/me')}>
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14">
                                <img className='rounded-lg' src={"https://mineskin.eu/helm/" + userData.profile.nick}></img>
                            </div>
                            <div className="flex flex-col text-lg">
                                <h1 className="text-2xl">{userData.profile.nick}</h1>
                                <p>Без доступа</p>
                            </div>
                        </div>
                    </DropdownMenuItem>
                    <div>
                        <DropdownMenuItem onClick={() => router.push('/me')} className="text-xl">
                            <p>Личный кабинет</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => logOut()} className="text-xl">
                            <p>Выйти</p>
                        </DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    } else {
        return (
            <Anchor href={'/login'} className={buttonVariants({ variant: "accent", className: "px-6", size: "lg", })}>Войти</Anchor>
        );
    }
}