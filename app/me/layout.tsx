"use client";
import { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NavMe } from "@/components/navbar";
import { getSession } from "@/app/actions/getDataHandlers";
import Loading from "@/components/loading";
import { SessionContext, SessionData } from "@/context/SessionContext";

export default function MeLayout({ children }: PropsWithChildren) {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [session, setSession] = useState<SessionData | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Функция для получения сессии
        const fetchSession = async () => {
            const r = await getSession();
            if (!r.success) {
                router.push("/login?to=me");
                return;
            }
            setSession(r.data);
            setIsAuthorized(true);
        };

        // Первоначальная загрузка
        fetchSession();

        // Установка интервала для обновления каждые 30 секунд
        const intervalId = setInterval(fetchSession, 30_000);

        // Очистка интервала при размонтировании компонента
        return () => clearInterval(intervalId);
    }, [router]);

    if (isAuthorized === null) {
        return (
            <Loading
                text={"Проверяем вашу сессию, пожалуйста, подождите.."}
                color={"orange"}
                className={"h-full w-full"}
            />
        );
    }

    return (
        <SessionContext.Provider value={{ session, isAuthorized }}>
            <div className="grid sm:grid-cols-[300px_1fr] gap-6 mt-4 mb-4 sm:px-4 lg:w-[95%] w-full mx-auto">
                <div className="h-fit">
                    <NavMe />
                </div>
                {children}
            </div>
        </SessionContext.Provider>
    );
}