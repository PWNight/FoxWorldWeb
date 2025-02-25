import SubAnchor from "@/components/subanchor";
import {House, Library, UserCheck} from "lucide-react";

export function NavAdmin() {
    return (
        <div className="sm:flex items-start">
            <div className="bg-neutral-100 rounded-sm dark:bg-neutral-800 flex flex-col gap-5 px-6 py-4">
                <h1 className="border-b text-xl my-2 w-full text-center">Меню навигации</h1>
                <div className="w-full flex flex-col gap-2 items-center">
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
        </div>
    );
}