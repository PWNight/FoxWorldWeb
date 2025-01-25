"use client"
import { Button, buttonVariants } from "./ui/button";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import Anchor from "./anchor";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {Ban, CircleUser, Gavel, HandHeart, LogOut} from "lucide-react";

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
        async function getSession() {
            const response = await fetch("/api/v1/users/me", {
                method: "GET"
            });
            if(response.ok){
                const json = await response.json();
                if(json.success){
                    return {success: true, data: json}
                }else{
                    return {success: false}
                }
            }else{
                return {success: false};
            }
        }
        getSession().then(r =>{
            if(r.success){
                setUserData(r.data)
            }
        });
    }, [pathname, router]);
    if (Object.keys(userData).length != 0) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Image
                            src={"https://cravatar.eu/helmavatar/" + userData.profile.nick + "/50.png"}
                            alt={userData.profile.nick}
                            width={50}
                            height={50}
                            quality={100}
                            className='rounded-lg'
                        />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="mt-2 py-10 flex flex-col gap-10 rounded-lg">
                    <DropdownMenuItem className="text-xl" onClick={() => router.push('/me')}>
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 flex items-center flex-col justify-center">
                                <Image
                                    src={"https://cravatar.eu/helmavatar/" + userData.profile.nick + "/50.png"}
                                    alt={userData.profile.nick}
                                    width={50}
                                    height={50}
                                    quality={100}
                                    className='rounded-lg'
                                />
                            </div>
                            <div className="flex flex-col text-lg">
                                <h1 className="text-2xl">{userData.profile.nick}</h1>
                                {userData.profile.have_fplus ?
                                    <p className='flex flex-row gap-1'><HandHeart/>Подписка активна</p>
                                    : null
                                }
                                {!userData.profile.has_access ?
                                    <Link href='/access'
                                      className = 'inline-flex gap-1 items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary underline-offset-4 hover:underline'
                                    ><Ban/>Заполните анкету</Link>
                                    : null
                                }
                                {userData.profile.is_banned ?
                                    <p className='flex flex-row gap-1'><Gavel/>Заблокирован</p>
                                    : null
                                }
                            </div>
                        </div>
                    </DropdownMenuItem>
                    <div>
                        <DropdownMenuItem onClick={() => router.push('/me')} className="text-xl">
                            <p className='flex flex-row gap-1'><CircleUser/>Личный кабинет</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => logOut()} className="text-xl">
                            <p className='flex flex-row gap-1'><LogOut/>Выйти</p>
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