import { buttonVariants } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";
export default function Home() {
  return (
    <div className="flex sm:min-h-[91vh] min-h-[88vh] flex-col justify-center px-2 py-8">
      <div className="flex flex-col m-auto gap-3">
        <img className='h-36 w-36 mb-10' src="http://localhost:3000/icon.png"/>
        <h1 className="text-[#F38F54] text-5xl sm:text-6xl font-bold">
          FoxWorld
        </h1>
        <h2 className="font-bold mb-4 sm:text-3xl">
        Наша работа - ваш комфорт
        </h2>
        <p className="mb-8 max-w-[300px] sm:max-w-[800px]">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consectetur velit id nobis facere voluptatem, nulla quas quae veniam. Aliquam officia est, explicabo fugit quod animi ullam tenetur officiis! Cumque, repudiandae!
        </p>
        <span className="flex flex-row items-center gap-2 text-muted-foreground text-sm mb-7 max-[800px]:mb-12">
        <Heart className="w-4 h-4 mr-1" /> С любовью к своему делу
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        <Link
          href={`https://discord.gg/2yyeWQ5unZ`}
          className={buttonVariants({ variant: "accent", className: "px-6", size: "lg" })}
        >
          Наш Discord сервер
        </Link>
        <Link
          href="https://t.me/foxworldteam"
          className={buttonVariants({
            variant: "accent",
            className: "px-6",
            size: "lg",
          })}
        >
          Наш Телеграмм канал
        </Link>
      </div>
      </div>
    </div>
  );
}
