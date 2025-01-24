"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {NavMe} from "@/components/navbar_me";
import InDev from "@/components/indev";

export default function MeBank() {
    const [userData, setUserData] = useState(Object)
    const router = useRouter()

    useEffect(()=>{
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
                return {success: false}
            }
        }
        getSession().then(async r => {
            if (r.success) {
                setUserData(r.data)
            } else {
                router.push("/login")
            }
        });
        //TODO: Page loaded state update (in last async function)
    },[router])

    if(Object.keys(userData).length != 0){
        return (
            <div className="grid sm:grid-cols-[300px,1fr] gap-6 mt-6">
                <NavMe/>
                <div className="">
                    <InDev/>
                </div>
            </div>
        )
    }
}
