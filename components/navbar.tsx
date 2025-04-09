import { ModeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import Anchor from "./anchor";
import { SheetLeftbar } from "./leftbar";
import { SheetClose } from "@/components/ui/sheet";
import { AccountButton } from "./account-button";
import Image from "next/image";
import {
    Home,
    Map,
    BookMarked,
    Library,
    Castle,
    House,
    PaintbrushVertical,
    Store,
    Scale,
    Landmark,
    UserCheck
} from "lucide-react";
import SubAnchor from "@/components/subanchor";

export const NAVLINKS = [
    {
        title: "Главная",
        href: "/",
        icon: <Home className="w-4 h-4" />,
    },
    {
        title: "Правила",
        href: "/rules",
        icon: <BookMarked className="w-4 h-4" />,
    },
    {
        title: "Вики",
        href: "/wiki",
        icon: <Library className="w-4 h-4" />,
    },
    {
        title: "Гильдии",
        href: "/guilds",
        icon: <Castle className="w-4 h-4" />,
    },
    {
        title: "Карта",
        href: "/map",
        icon: <Map className="w-4 h-4" />,
    },
];

export function Navbar() {
    return (
        <nav className="w-full p-2 px-6 flex items-center shadow-md text-gray-900 dark:text-white">
            <div className="w-full h-full flex items-center justify-between gap-2">
                <div className="flex items-center h-full gap-8">
                    <div className="sm:text-2xl text-lg">
                        <Logo />
                    </div>
                    <SheetLeftbar />
                    <div className="lg:flex hidden items-center gap-6 h-full select-none">
                        <NavMenu />
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <ModeToggle />
                        <AccountButton />
                    </div>
                </div>
            </div>
        </nav>
    );
}

export function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Image
                src="/logo.png"
                alt="logo"
                width={50}
                height={50}
                quality={100}
                className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow-md"
            />
            <h2 className="font-bold text-[#F38F54]">FoxWorld</h2>
        </Link>
    );
}

export function NavMenu({ isSheet = false }) {
    return (
        <>
            {NAVLINKS.map((item) => {
                const Comp = (
                    <Anchor
                        key={item.title + item.href}
                        activeClassName="text-orange-400 font-semibold rounded-md"
                        absolute
                        className="flex items-center gap-2 py-1.5 hover:text-[#F38F54] transition-all duration-200 group"
                        href={item.href}
                    >
            <span className="group-[.active]:text-orange-400 transition-colors duration-200">
              {item.icon}
            </span>
                        {item.title}
                    </Anchor>
                );
                return isSheet ? (
                    <SheetClose key={item.title + item.href} asChild>
                        {Comp}
                    </SheetClose>
                ) : (
                    Comp
                );
            })}
        </>
    );
}

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
            </div>
        </div>
    );
}