"use client";
import { useEffect, useState } from "react";
import InDev from "@/components/indev";
import { useSession } from "@/context/SessionContext";
import Loading from "@/components/loading";

export default function MeDonate() {
    const { session, isAuthorized } = useSession();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isAuthorized !== null) {
            setIsLoading(false);
        }
    }, [isAuthorized]);

    if (isLoading || !session) {
        return (
            <Loading
                text={"Проверяем вашу сессию, пожалуйста, подождите.."}
                color={"orange"}
                className={"h-full w-full"}
            />
        );
    }

    return (
        <div>
            <InDev />
        </div>
    );
}