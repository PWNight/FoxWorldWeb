import Link from "next/link";
import { buttonVariants } from "./ui/button";

export function Footer() {
  return (
    <footer className="border-t w-full p-5 container flex items-center sm:justify-between justify-center sm:gap-0 gap-4 text-muted-foreground text-sm flex-wrap sm:py-0 py-3 max-sm:px-4">
      <div className="flex flex-col">
          <p>
              FoxWorld © 2021 - 2025
          </p>
          <p>
              v1.0.0-beta1 (In DEV)
          </p>
      </div>
      <div className="items-center md:flex">
          <FooterButtons/>
      </div>
    </footer>
  );
}

export function FooterButtons() {
  return (
    <>
        <Link
          href={`https://discord.gg/2yyeWQ5unZ`}
          className={buttonVariants({ variant: "link", className: "", size: "sm" })}
        >
          Discord
        </Link>
        <Link
          href="https://t.me/foxworldteam"
          className={buttonVariants({ variant: "link", className: "", size: "sm",
          })}
        >
          Telegram
        </Link>
        <Link
          href="https://vk.com/foxworldserver"
          className={buttonVariants({ variant: "link", className: "", size: "sm",
          })}
        >
          VK
        </Link>
    </>
  );
}
