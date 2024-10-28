"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
    const router = useRouter()
    useEffect(() => {
        async function getSession() {
            const response = await fetch("/api/v1/users/me", {
                method:"GET"
            });
            if (response.ok) {
                const json = await response.json()
                if(json.data != null){
                    logOut()
                }else{
                    router.push('/')
                }
            }
        }

        async function logOut(){
            const response = await fetch("/api/v1/auth/logout",{
                method: "GET"
            })
    
            if(response.ok){
                router.push('/')
                return
            }
        }

        getSession();
    }, [router]);
    return (
        <>
        </>
    )
}
