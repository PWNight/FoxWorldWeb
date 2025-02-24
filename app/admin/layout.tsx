"use client"
import {PropsWithChildren, useEffect, useState} from "react";
import {NavAdmin} from "@/components/navbar_admin";
import {getSession} from "@/app/actions/getInfo";
import {useRouter} from "next/navigation";

export default function MeLayout({ children }: PropsWithChildren) {
    const router = useRouter()
    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(()=>{
        getSession().then(async r => {
            if ( !r.success ) {
                router.push("/login")
                return
            }

            if ( !['dev','staff'].includes(r.data.group) ){
                router.push("/")
                return
            }
            setPageLoaded(true)
        });
    },[router])
    if ( pageLoaded ) {
        return (
            <div className="grid sm:grid-cols-[300px_1fr] gap-6 mt-4 mb-4 sm:px-4 sm:w-[90%] w-full mx-auto">
                <NavAdmin/>
                {children}
            </div>
        );
    }
}
