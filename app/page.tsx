import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "FW - Главная",
};

export default function Home() {
  return (
    <div className="relative w-full h-full flex justify-center items-center"> {/* Контейнер центрируется по горизонтали и вертикали */}
      <Image
        src='/background.png'
        alt='background'
        fill
        quality={100}
        className="brightness-40 object-cover"
      />
      <div className="absolute flex flex-col sm:items-start justify-center gap-3 px-3"> {/* Текст выравнивается по левому краю */}
        <div className="flex text-4xl sm:text-5xl font-bold gap-2 sm:items-center sm:flex-row flex-col text-white">
          <h1 className="text-[#F38F54]">FoxWorld</h1>
          <h1 className="sm:flex hidden">:</h1>
          <h1>Новое начало</h1>
        </div>
        <h2 className="font-bold mb-4 sm:text-2xl text-white">
          Minecraft проект с акцентом на качество и разнообразие
        </h2>
        <p className="mb-8 max-w-[300px] sm:max-w-[800px] text-white">
          Наш проект предлагает вам дружелюбное пространство, где вы можете раскрыть свой творческий потенциал в ванильной среде Minecraft.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <Link
            href={`/access`}
            className={buttonVariants({ variant: "accent", className: "px-6 text-center", size: "lg" })}
          >
            Заполнить заявку
          </Link>
          <Link
            href="/wiki/introduction/about"
            className={buttonVariants({
              variant: "accent",
              className: "px-6 text-center",
              size: "lg",
            })}
          >
            О сервере
          </Link>
        </div>
      </div>
    </div>
  );
}
