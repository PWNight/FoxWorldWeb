"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {NavMe} from "@/components/navbar_me";
import InDev from "@/components/indev";

export default function MeDonate() {
    const [userData, setUserData] = useState(Object)
    const router = useRouter()

    useEffect(()=>{
        async function getSession() {
            const response = await fetch("/api/v1/users/me", {
                method: "GET"
            });
            if ( !response.ok ) {
                return { success: false}
            }
            const json = await response.json();
            if ( !json.success ) {
                return { success: false }
            }
            return {success: true, data: json}
        }
        getSession().then(async r => {
            if ( !r.success ) {
                router.push("/login")
                return
            }
            setUserData(r.data)
        });
        //TODO: Page loaded state update (in last async function)
    },[router])

    if(Object.keys(userData).length != 0){
        return (
            <div className="">
                <InDev/>
            </div>
        )
    }
}
