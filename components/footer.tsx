import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { Copyright, DiscIcon, HeartIcon, HexagonIcon, TriangleIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t w-full h-16">
      <div className="container flex items-center sm:justify-between justify-center sm:gap-0 gap-4 h-full text-muted-foreground text-sm flex-wrap sm:py-0 py-3 max-sm:px-4">
        <div className="flex items-center gap-3">
          <p className="text-center flex flex-row items-center">
            FoxWorld © 2022 - 2024
          </p>
        </div>

        <div className="gap-4 items-center hidden md:flex">
          <FooterButtons />
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
          className={buttonVariants({ variant: "accent", className: "", size: "lg" })}
        >
          <DiscIcon/>
        </Link>
        <Link
          href="https://t.me/foxworldteam"
          className={buttonVariants({
            variant: "accent",
            className: "",
            size: "lg",
          })}
        >
          <DiscIcon/>
        </Link>
    </>
  );
}
