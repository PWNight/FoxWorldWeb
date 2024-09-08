"use client"
import { Button, buttonVariants } from "./ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger,} from "./ui/dropdown-menu";

export function AccountButton() {
    const [userData,setUserData] = useState(Object)
    const router = useRouter()

    async function getSession(){
        const response = await fetch("http://localhost:3000/api/v1/users/me",{
            method: "GET"
        })
        if(response.ok){
            const data = await response.json()
            setUserData(data.data.userData)
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
                    <img src={"https://mineskin.eu/helm/"+userData.username}></img>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="p-4 mt-2 py-10 flex flex-col gap-10 rounded-lg">
                    <DropdownMenuItem className="text-xl">
                        <h1>{userData.global_name}</h1>
                    </DropdownMenuItem>
                    <div>
                        <DropdownMenuItem onClick={() => console.log(1)} className="text-xl">
                            <p>Личный кабинет</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log(1)} className="text-xl">
                            <p>Выйти</p>
                        </DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }else{
        return (
            //TODO: Переписать обращение с API на страницу localhost:3000/login и написать интерфейс для этой страницы
            <Button className={buttonVariants({ variant: "accent", className: "px-6", size: "lg",})}
                onClick={e => router.push('http://localhost:3000/api/v1/auth/login')}
            >Войти</Button>
        )
    }
}
