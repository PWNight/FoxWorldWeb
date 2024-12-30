"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SubAnchor from "@/components/subanchor";
import { Castle, House, Landmark, ShieldCheck, Store } from "lucide-react";
import {NavMe} from "@/components/navbar_me";

export default function MeDonate() {
    const [userData, setUserData] = useState(Object)
    const router = useRouter()

    useEffect(()=>{
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
                router.push('/login')
            }else{
                setUserData(json)
            }
        }
        getSession()
    },[router])
    if(Object.keys(userData).length != 0){
        return (
            <div className="grid sm:grid-cols-[300px,1fr] gap-6 mt-6">
                <NavMe/>
                <div className="">
                </div>
            </div>
        )
    }
}
