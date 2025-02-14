import Link from "next/link";
import { buttonVariants } from "./ui/button";
import React from "react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full mx-auto border-t max-h-16 p-2 lg:px-14 px-2 bg-opacity-5 text-muted-foreground text-sm">
        <div className="flex items-center sm:justify-between justify-start sm:gap-0 gap-4 flex-wrap sm:py-0 py-3 sm:px-4">
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <Image
                      src='/logo.png'
                      alt='logo'
                      width={35}
                      height={35}
                      quality={100}
                      className=""
                    />
                    <div className='flex flex-col'>
                        <p>FoxWorld © 2021 - 2025</p>
                        <p>v1.0.0-beta2</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <div className='flex gap-2'>
                  <FooterButtons/>
                </div>
                <div className="flex items-center sm:justify-start gap-2 flex-wrap">
                    <Link href="/" className={buttonVariants({variant: "link", className: "px-0! py-0!", size: "xs"})}>Контакты</Link>
                    <Link href="/" className={buttonVariants({variant: "link", className: "px-0! py-0!", size: "xs"})}>Пользовательское соглашение</Link>
                    <Link href="/" className={buttonVariants({variant: "link", className: "px-0! py-0!", size: "xs"})}>Политика конфиденциальности</Link>
                </div>
            </div>
        </div>
    </footer>
  );
}

export function FooterButtons() {
  return (
    <>
        <Link
          href={`https://discord.gg/2yyeWQ5unZ`}
          className={buttonVariants({ variant: "link", className: "px-0!", size: "xs" })}
        >
          Discord
        </Link>
        <Link
          href="https://t.me/foxworldteam"
          className={buttonVariants({ variant: "link", className: "px-0!", size: "xs",
          })}
        >
          Telegram
        </Link>
        <Link
          href="https://vk.com/foxworldserver"
          className={buttonVariants({ variant: "link", className: "px-0!", size: "xs",
          })}
        >
          VK
        </Link>
    </>
  );
}
