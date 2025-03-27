import SubAnchor from "@/components/subanchor";
import {Castle, House, Landmark, Library, PaintbrushVertical, Scale, Store, UserCheck} from "lucide-react";

export function NavMe() {
    return (
        <div className="bg-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg dark:bg-neutral-800 p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-semibold border-b border-neutral-200 dark:border-neutral-700 pb-3 pl-3">
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
                    key="/me/customization"
                    activeClassName="bg-orange-400 text-white hover:bg-orange-500"
                    absolute
                    className="flex items-center gap-2 w-full py-2 px-3 rounded-md sm:text-base hover:bg-orange-400 hover:text-white transition-all duration-200"
                    href="/me/customization"
                >
                    <PaintbrushVertical className="w-5 h-5" />
                    Кастомизация
                </SubAnchor>
                <SubAnchor
                    key="/me/donate"
                    activeClassName="bg-orange-400 text-white hover:bg-orange-500"
                    absolute
                    className="flex items-center gap-2 w-full py-2 px-3 rounded-md sm:text-base hover:bg-orange-400 hover:text-white transition-all duration-200"
                    href="/me/donate"
                >
                    <Store className="w-5 h-5" />
                    Управление покупками
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
                <SubAnchor
                    key="/me/jurisdiction"
                    activeClassName="bg-orange-400 text-white hover:bg-orange-500"
                    absolute
                    className="flex items-center gap-2 w-full py-2 px-3 rounded-md sm:text-base hover:bg-orange-400 hover:text-white transition-all duration-200"
                    href="/me/jurisdiction"
                >
                    <Scale className="w-5 h-5" />
                    Судебная система
                </SubAnchor>
                <SubAnchor
                    key="/me/bank"
                    activeClassName="bg-orange-400 text-white hover:bg-orange-500"
                    absolute
                    className="flex items-center gap-2 w-full py-2 px-3 rounded-md sm:text-base hover:bg-orange-400 hover:text-white transition-all duration-200"
                    href="/me/bank"
                >
                    <Landmark className="w-5 h-5" />
                    Банковская система
                </SubAnchor>
            </div>
        </div>
    );
}
export function NavAdmin() {
    return (
        <div className="bg-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg dark:bg-neutral-800 p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-semibold border-b border-neutral-200 dark:border-neutral-700 pb-3 pl-3">
                Меню навигации
            </h1>
            <div className="mt-4 space-y-2">
                <SubAnchor
                    key='/me'
                    activeClassName="bg-orange-400 text-white hover:bg-orange-500"
                    absolute
                    className="flex items-center gap-2 w-full py-2 px-3 rounded-md sm:text-base hover:bg-orange-400 hover:text-white transition-all duration-200"
                    href='/me'
                >
                    <House/>Главная страница
                </SubAnchor>
                <SubAnchor
                    key='/admin/wiki'
                    activeClassName="bg-orange-400 text-white hover:bg-orange-500"
                    absolute
                    className="flex items-center gap-2 w-full py-2 px-3 rounded-md sm:text-base hover:bg-orange-400 hover:text-white transition-all duration-200"
                    href='/admin/wiki'
                >
                    <Library/> База знаний
                </SubAnchor>
                <SubAnchor
                    key='/admin/applications'
                    activeClassName="bg-orange-400 text-white hover:bg-orange-500"
                    absolute
                    className="flex items-center gap-2 w-full py-2 px-3 rounded-md sm:text-base hover:bg-orange-400 hover:text-white transition-all duration-200"
                    href='/admin/applications'
                >
                    <UserCheck/> Управление заявками
                </SubAnchor>
            </div>
        </div>
    );
}