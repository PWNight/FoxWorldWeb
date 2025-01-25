"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {NavMe} from "@/components/navbar_me";
import InDev from "@/components/indev";
import {getSession} from "@/app/actions/getInfo";

export default function MeDonate() {
    const [userData, setUserData] = useState(Object)
    const router = useRouter()

    useEffect(()=>{
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
