import Link from "next/link";
import { buttonVariants } from "./ui/button";

export function Footer() {
  return (
    <footer className="w-full h-fit border-t container text-muted-foreground text-sm max-sm:px-4 py-2">
        <div className="flex items-center sm:justify-between justify-start sm:gap-0 gap-4 flex-wrap sm:py-0 py-3">
            <div className="flex flex-col">
              <p>FoxWorld © 2021 - 2025</p>
              <p>v1.0.0-beta2 (IN DEV)</p>
            </div>
            <div className="items-center flex gap-2">
              <FooterButtons/>
            </div>
        </div>
        <div className="flex items-center sm:justify-start sm:gap-6 gap-2 flex-wrap">
            <Link href="/" className={buttonVariants({variant: "link", className: "!px-0"})}>Контакты</Link>
            <Link href="/" className={buttonVariants({variant: "link", className: "!px-0"})}>Пользовательское соглашение</Link>
            <Link href="/" className={buttonVariants({variant: "link", className: "!px-0"})}>Политика конфиденциальности</Link>
        </div>
    </footer>
  );
}

export function FooterButtons() {
  return (
    <>
        <Link
          href={`https://discord.gg/2yyeWQ5unZ`}
          className={buttonVariants({ variant: "link", className: "!px-0", size: "sm" })}
        >
          Discord
        </Link>
        <Link
          href="https://t.me/foxworldteam"
          className={buttonVariants({ variant: "link", className: "!px-0", size: "sm",
          })}
        >
          Telegram
        </Link>
        <Link
          href="https://vk.com/foxworldserver"
          className={buttonVariants({ variant: "link", className: "!px-0", size: "sm",
          })}
        >
          VK
        </Link>
    </>
  );
}
