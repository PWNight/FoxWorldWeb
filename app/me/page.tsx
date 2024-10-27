"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Me() {
    const [userData, setUserData] = useState(Object)
    const router = useRouter()
    async function getSession(){
        const response = await fetch("/api/v1/users/me",{
            method: "GET"
        })
        if(!response.ok){
            router.push('/login')
            return
        }
        const json = await response.json()
        setUserData(json.data.data)
    }
    useEffect(()=>{
        getSession()
    },[])
    return (
        <>
        </>
    )
}
