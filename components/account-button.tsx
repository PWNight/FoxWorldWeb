"use client"
import { Button, buttonVariants } from "./ui/button";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import Anchor from "./anchor";
import { useRouter } from "next/navigation";

export function AccountButton() {
    const [userData,setUserData] = useState(Object)
    const router = useRouter()

    async function getSession(){
        const response = await fetch("http://localhost:3000/api/v1/users/me",{
            method: "GET"
        })
        if(response.ok){
            const json = await response.json()
            if(json.data != null){
                setUserData(json.data.data)
            }
        }
    }

    useEffect(()=>{
        getSession()
    },[])

    if(Object.keys(userData).length != 0){
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                    <img src={"https://mineskin.eu/helm/"+userData.last_nickname}></img>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="p-4 mt-2 py-10 flex flex-col gap-10 rounded-lg">
                    <DropdownMenuItem className="text-xl">
                        <h1>{userData.last_nickname}</h1>
                    </DropdownMenuItem>
                    <div>
                        <DropdownMenuItem onClick={() => router.push('/me')} className="text-xl">
                            <p>Личный кабинет</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/logout')} className="text-xl">
                            <p>Выйти</p>
                        </DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }else{
        return (
            <Anchor href={'/login'} className={buttonVariants({ variant: "accent", className: "px-6", size: "lg",})}>Войти</Anchor>
        )
    }
}
