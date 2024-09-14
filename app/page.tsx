import { buttonVariants } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";
import {MoveUpRightIcon,} from "lucide-react";
export default function Home() {
  return (
    <div className="flex sm:min-h-[91vh] min-h-[88vh] flex-col items-center justify-center text-center px-2 py-8">
      <img className='h-36 w-36 mb-10' src="http://localhost:3000/icon.png"/>
      <div className="flex flex-row gap-3 text-2xl font-bold mb-4 sm:text-7xl">
        <h1 className="text-[#F38F54]">
          FoxWorld
        </h1>
      </div>
      <h2 className="text-xl font-bold mb-4 sm:text-5xl">
        Наша работа - ваш комфорт
      </h2>
      <p className="mb-8 sm:text-xl max-w-[800px] text-muted-foreground">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consequuntur aliquam porro natus! Officia ex maxime saepe sit ad perferendis temporibus, perspiciatis obcaecati, dignissimos cupiditate quos eaque corporis aliquid neque cum.
      </p>
      <div className="flex flex-row items-center gap-5">
        <Link
          href={`https://discord.gg/2yyeWQ5unZ`}
          className={buttonVariants({ variant: "default", className: "px-6", size: "lg" })}
        >
          Наш Discord сервер
        </Link>
        <Link
          href="https://t.me/foxworldteam"
          className={buttonVariants({
            variant: "default",
            className: "px-6",
            size: "lg",
          })}
        >
          Наш Телеграмм канал
        </Link>
      </div>
      <span className="flex flex-row items-center gap-2 text-zinc-400 text-md mt-7 -mb-12 max-[800px]:mb-12">
        <Heart className="w-4 h-4 mr-1" /> С любовью к своему делу
      </span>
    </div>
  );
}
