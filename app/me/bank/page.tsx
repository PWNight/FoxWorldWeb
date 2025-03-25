"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InDev from "@/components/indev";
import {getSession} from "@/app/actions/getDataHandlers";

export default function MeBank() {
    const [userData, setUserData] = useState(Object)
    const router = useRouter()

    useEffect(()=>{
        getSession().then(async r => {
            if ( !r.success ) {
                router.push("/login?to=me/bank")
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
