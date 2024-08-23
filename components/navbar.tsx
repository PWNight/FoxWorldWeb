"use client"
import { ModeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import Anchor from "./anchor";
import { SheetLeftbar } from "./wiki/leftbar";
import { SheetClose } from "@/components/ui/sheet";
import { AccountButton } from "./account-button";

export const NAVLINKS = [
  {
    title: "Главная",
    href: "/",
  },
  {
    title: "Правила",
    href: "/rules",
  },
  {
    title: "Вики",
    href: `/wiki`,
  },
  {
    title: "Игроки",
    href: "/players",
  },
  {
    title: "Гильдии",
    href: "/guilds",
  },
  {
    title: "Карта",
    href: "/map",
  },
];
export function Navbar() {
  return (
    <nav className="w-full border-b h-16 sticky top-0 z-50 lg:px-4 px-2 backdrop-filter backdrop-blur-xl bg-opacity-5">
      <div className=" mx-auto h-full flex items-center justify-between gap-2">
        <div className="flex items-center gap-5 h-full">
          <div className="flex items-center gap-8 h-full">
            <div className="sm:flex hidden">
              <Logo />
            </div>
            <SheetLeftbar />
            <div className="lg:flex hidden items-center gap-5 text-lg text-muted-foreground h-full select-none">
              <NavMenu />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex">
              <ModeToggle />
            </div>
            <div className='flex'>
              <AccountButton/>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 px-6">
      <img src="http://localhost:3000/icon.png" className="w-9 h-9 text-muted-foreground fill-current" />
      <h2 className="text-2xl font-bold text-[#F38F54]">FoxWorld</h2>
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
            className="h-full flex items-center duration-150 hover:text-[#F38F54]"
            activeClassName = {isSheet ? 'text-[#F38F54]' : 'border-b-2 border-orange-400'}
            absolute
            href={item.href}
          >
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
