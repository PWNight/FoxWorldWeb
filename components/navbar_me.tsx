import SubAnchor from "@/components/subanchor";
import { Castle, House, Landmark, ShieldCheck, Store } from "lucide-react";

export function NavMe() {
    return (
        <div>
            <div className="bg-neutral-100 rounded-lg shadow-sm dark:bg-neutral-800 p-4 sm:p-6">
                <h1 className="text-xl sm:text-2xl font-semibold border-b border-neutral-200 dark:border-neutral-700 pb-3">
                    Меню навигации
                </h1>
                <div className="mt-4 space-y-2">
                    <SubAnchor
                        key="/me"
                        activeClassName="bg-orange-400 text-white hover:bg-orange-500"
                        absolute
                        className="flex items-center gap-2 w-full py-2 px-3 rounded-md sm:text-base hover:bg-orange-400 hover:text-white transition-all duration-200"
                        href="/me"
                    >
                        <House className="w-5 h-5" />
                        Главная страница
                    </SubAnchor>
                    <SubAnchor
                        key="/me/donate"
                        activeClassName="bg-orange-400 text-white hover:bg-orange-500"
                        absolute
                        className="flex items-center gap-2 w-full py-2 px-3 rounded-md sm:text-base hover:bg-orange-400 hover:text-white transition-all duration-200"
                        href="/me/donate"
                    >
                        <Store className="w-5 h-5" />
                        Магазин сервера
                    </SubAnchor>
                    <SubAnchor
                        key="/me/security"
                        activeClassName="bg-orange-400 text-white hover:bg-orange-500"
                        absolute
                        className="flex items-center gap-2 w-full py-2 px-3 rounded-md sm:text-base hover:bg-orange-400 hover:text-white transition-all duration-200"
                        href="/me/security"
                    >
                        <ShieldCheck className="w-5 h-5" />
                        Управление безопасностью
                    </SubAnchor>
                    <SubAnchor
                        key="/me/bank"
                        activeClassName="bg-orange-400 text-white hover:bg-orange-500"
                        absolute
                        className="flex items-center gap-2 w-full py-2 px-3 rounded-md sm:text-base hover:bg-orange-400 hover:text-white transition-all duration-200"
                        href="/me/bank"
                    >
                        <Landmark className="w-5 h-5" />
                        Управление средствами
                    </SubAnchor>
                    <SubAnchor
                        key="/me/guilds"
                        activeClassName="bg-orange-400 text-white hover:bg-orange-500"
                        absolute
                        className="flex items-center gap-2 w-full py-2 px-3 rounded-md sm:text-base hover:bg-orange-400 hover:text-white transition-all duration-200"
                        href="/me/guilds"
                    >
                        <Castle className="w-5 h-5" />
                        Управление гильдиями
                    </SubAnchor>
                </div>
            </div>
        </div>
    );
}