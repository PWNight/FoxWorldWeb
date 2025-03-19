import { ModeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import Anchor from "./anchor";
import { SheetLeftbar } from "./leftbar";
import { SheetClose } from "@/components/ui/sheet";
import { AccountButton } from "./account-button";
import Image from "next/image";
import { Home, BookOpen, Users, Map } from "lucide-react";

export const NAVLINKS = [
  {
    title: "Главная",
    href: "/",
    icon: <Home className="w-4 h-4" />,
  },
  {
    title: "Вики",
    href: "/wiki",
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    title: "Гильдии",
    href: "/guilds",
    icon: <Users className="w-4 h-4" />,
  },
  {
    title: "Карта",
    href: "/map",
    icon: <Map className="w-4 h-4" />,
  },
];

export function Navbar() {
  return (
      <nav className="w-full mx-auto border-b max-h-16 p-2 sticky top-0 z-50 lg:px-14 backdrop-filter backdrop-blur-xl bg-opacity-5 flex items-center shadow-sm">
        <div className="w-full h-full flex items-center justify-between gap-2">
          <div className="flex items-center gap-4 sm:gap-5 h-full">
            <div className="flex items-center h-full gap-2">
              <div className="sm:text-2xl text-lg">
                <Logo />
              </div>
              <SheetLeftbar />
              <div className="lg:flex hidden items-center gap-6 text-muted-foreground h-full select-none">
                <NavMenu />
              </div>
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
      <Link href="/" className="flex items-center gap-2 sm:gap-2.5 sm:px-5 hover:opacity-90 transition-opacity">
        <Image
            src="/logo.png"
            alt="logo"
            width={50}
            height={50}
            quality={100}
            className="w-8 h-8 sm:w-9 sm:h-9 text-muted-foreground fill-current drop-shadow-md"
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