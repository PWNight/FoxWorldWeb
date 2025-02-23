"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CloudUpload, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {getSession, getStats} from "@/app/actions/getInfo";
import MeSkelet, {MeStatisticSkelet} from "@/components/skelets/me_skelet";
import ErrorMessage from "@/components/ui/notify-alert";
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
