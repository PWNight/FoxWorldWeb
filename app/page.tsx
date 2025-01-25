import { buttonVariants } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "FW - Главная",
};

export default function Home() {
  return (
    <div className="flex flex-col justify-center px-4 py-8 my-auto h-full">
      <div className="flex flex-col m-auto gap-3">
        <Image
          src='/logo.png'
          alt='logo'
          width={1000}
          height={1000}
          quality={100}
          className="h-28 w-28 mb-10"
        />
        <div className="flex text-4xl sm:text-6xl font-bold gap-2 sm:items-center sm:flex-row flex-col items-start">
          <h1 className="text-[#F38F54]">FoxWorld</h1>
          <h1 className="sm:flex hidden">:</h1>
          <h1>Новое начало</h1>
        </div>
        <h2 className="font-bold mb-4 sm:text-2xl">
        Ванильный сервер, основанный на строительстве и роле-плее.
        </h2>
        <p className="mb-8 max-w-[300px] sm:max-w-[800px]">
        Сервер находится на этапе разработки. Отслеживать прогресс и в числе первых узнать дату запуска сервера можно в наших социальных сетях.
        </p>
        <span className="flex flex-row items-center gap-2 text-muted-foreground text-sm mb-7 max-[800px]:mb-12">
        <Heart className="w-4 h-4 mr-1" /> С любовью к своему делу, команда разработки FoxWorld
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
