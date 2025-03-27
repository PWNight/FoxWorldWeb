import SubAnchor from "@/components/subanchor";
import {House, Library, UserCheck} from "lucide-react";

export function NavAdmin() {
    return (
        <div className="bg-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg dark:bg-neutral-800 p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-semibold border-b border-neutral-200 dark:border-neutral-700 pb-3 pl-3">
                Меню навигации
            </h1>
            <div className="mt-4 space-y-2">
                <SubAnchor
                    key='/me'
                    activeClassName="bg-orange-400 text-muted hover:bg-orange-500"
                    absolute
                    className="flex items-center gap-1 hover:bg-orange-400 hover:text-muted transition-all w-full py-2 px-1 rounded-sm"
                    href='/me'
                >
                    <House/>Главная страница
                </SubAnchor>
                <SubAnchor
                    key='/admin/wiki'
                    activeClassName="bg-orange-400 text-muted hover:bg-orange-500"
                    absolute
                    className="flex items-center gap-1 hover:bg-orange-400 hover:text-muted transition-all w-full py-2 px-1 rounded-sm"
                    href='/admin/wiki'
                >
                    <Library/> База знаний
                </SubAnchor>
                <SubAnchor
                    key='/admin/applications'
                    activeClassName="bg-orange-400 text-muted hover:bg-orange-500"
                    absolute
                    className="flex items-center gap-1 hover:bg-orange-400 hover:text-muted transition-all w-full py-2 px-1 rounded-sm"
                    href='/admin/applications'
                >
                    <UserCheck/> Управление заявками
                </SubAnchor>
            </div>
        </div>
    );
}