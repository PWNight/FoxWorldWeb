"use client"
import { ROUTES } from "@/lib/wiki/routes-config";
import Anchor from "../anchor";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo, NavMenu } from "../navbar";
import { Button } from "../ui/button";
import { AlignLeftIcon, Menu as LucideMenu } from "lucide-react";
import { usePathname } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

export function Leftbar() {
  return (
    <aside className="md:flex hidden flex-[0.9] min-w-[230px] sticky top-16 flex-col h-[92.75vh] overflow-y-auto">
      <ScrollArea className="py-4">
        <Menu />
      </ScrollArea>
    </aside>
  );
}

export function SheetLeftbar() {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden flex">
          <AlignLeftIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 px-0" side="left">
        <SheetHeader>
          <SheetClose className="px-5" asChild>
            <Logo />
          </SheetClose>
        </SheetHeader>
        <ScrollArea className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 mt-3 mx-2 px-5 w-32 text-xl">
            <NavMenu isSheet />
          </div>
          <div className="mx-2 px-5 mt-10">
            {pathname.includes("wiki") && 
                <>
                  <div className="flex flex-row hover:text-orange-500 duration-150 text-lg gap-2">
                    <LucideMenu/>
                    <h1>Навигация по Вики</h1>
                  </div>
                  <Menu isSheet />
                </>}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function Menu({ isSheet = false }) {
  return (
    <>
      {ROUTES.map(({ href, items, title }) => {
        if(items.length === 0){
          const key = `/wiki`;
          const Comp = (
            <Anchor
              className="hover:text-orange-500 duration-150"
              activeClassName="text-orange-400"
              key={key}
              href={key}
            >
              {title}
            </Anchor>
          );
          const Link = isSheet ? (
            <SheetClose key={key} asChild>
              {Comp}
            </SheetClose>
          ) : (
            Comp
          );
          return (
            <div className="flex flex-col mt-3" key={href}>
              <div className="flex flex-col dark:text-neutral-300/85 text-neutral-800 select-none text-lg">
                {
                  Link
                }
              </div>
            </div>
          );
        }else{
          return (
            <div className="flex flex-col gap-2 mt-2" key={href}>
              <h4 className="font-medium select-none text-xl">{title}</h4>
              <div className="flex flex-col gap-2 dark:text-neutral-300/85 text-neutral-800 text-lg select-none">
                {items.map((subItem) => {
                  const key = `/wiki/${href}${subItem.href}`;
                  const Comp = (
                    <Anchor
                      className="hover:text-orange-500 duration-150"
                      activeClassName="text-orange-400"
                      key={key}
                      href={key}
                    >
                      {subItem.title}
                    </Anchor>
                  );
                  return isSheet ? (
                    <SheetClose key={key} asChild>
                      {Comp}
                    </SheetClose>
                  ) : (
                    Comp
                  );
                })}
              </div>
            </div>
          );
        }
      })}
    </>
  );
}
