"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
    const [userData,setUserData] = useState(Object)
    const router = useRouter()
    async function getSession(){
        const response = await fetch("http://localhost:3000/api/v1/users/me",{
            method: "GET"
        })
        if(!response.ok){
            router.push('http://localhost:3000/api/v1/auth/login')
            return
        }
        const data = await response.json()
        setUserData(data.data.userData)
    }
    useEffect(()=>{
        getSession()
    },[])
    console.log(userData)
    return (
        <>
        </>
    )
}
