"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {getSession} from "@/app/actions/getInfo";
import MeSkelet from "@/components/skelets/me_skelet";
import InDev from "@/components/indev";

export default function Me() {
    const [userData, setUserData] = useState(Object)

    const [notifyMessage, setNotifyMessage] = useState('');
    const [notifyType, setNotifyType] = useState('');

    const [pageLoaded, setPageLoaded] = useState(false);

    const router = useRouter()

    useEffect(()=>{
        getSession().then(async r => {
            if ( !r.success ) {
                router.push("/login")
                return
            }
            setUserData(r.data)
        });
    },[router])

    const handleClose = () => {
        setNotifyMessage('')
    }

    if (!pageLoaded) {
        return (
            <MeSkelet/>
        )
    }else{
        return (
            <InDev/>
        )
    }
}
