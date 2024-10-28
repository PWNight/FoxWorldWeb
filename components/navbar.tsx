import { ModeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import Anchor from "./anchor";
import { SheetLeftbar } from "./leftbar";
import { SheetClose } from "@/components/ui/sheet";
import { AccountButton } from "./account-button";
export const NAVLINKS = [
  {
    title: "Главная",
    href: "/",
  },
  {
    title: "Новости",
    href: `/news`,
  },
  {
    title: "Вики",
    href: `/wiki`,
  },
  {
    title: "Статистика",
    href: "/statistic",
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
      <div className="mx-auto h-full flex items-center justify-between gap-2">
        <div className="flex items-center gap-5 h-full">
          <div className="flex items-center h-full">
            <div className="sm:flex sm:text-2xl text-lg">
              <Logo/>
            </div>
            <SheetLeftbar/>
            <div className="lg:flex hidden items-center gap-5 text-muted-foreground h-full select-none">
              <NavMenu/>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <ModeToggle/>
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
      <img src="logo.png" className="w-9 h-9 text-muted-foreground fill-current" />
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
            activeClassName="text-orange-400 font-semibold"
            absolute
            className="flex items-center gap-1 hover:text-[#F38F54] transition-all"
            href={item.href}
          >
            {item.title}{" "}
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
