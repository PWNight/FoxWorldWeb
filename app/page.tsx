import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {Metadata} from "next";
import {ArrowRightIcon} from "lucide-react";

export const metadata: Metadata = {
  title: "FW - Главная",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f39054] flex justify-center items-center">
        <div className="w-[80%] flex flex-col gap-6 px-3 mx-auto">
            <div className="max-w-4xl flex gap-2 items-center">
                <Image src={'/logo.png'} width={120} height={120} alt={'logo'} className={'object-contain'} />
                <h1 className={'text-8xl font-bold text-white'}>FoxWorld 2</h1>
            </div>
            <p className={'max-w-4xl text-3xl text-bold text-white'}>Ванилла+ проект с дружелюбным сообществом и акцентом на качество и свободу</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mt-4">
                <Link
                    href="/wiki/introduction/start-game"
                    className={buttonVariants({
                        variant: "outline",
                        className: "px-6 text-center",
                        size: "lg",
                    })}>
                    Начать игру
                </Link>
                <Link
                    href="/wiki/introduction/about"
                    className={buttonVariants({
                      variant: "link",
                      className: "px-6 !text-xl text-center flex gap-2 text-white",
                      size: "lg",
                })}>
                    О сервере
                    <ArrowRightIcon />
                </Link>
            </div>
            <p className={'text-white'}>Сервер поддерживает вход с версий Java Edition 1.21 - 1.21.5. Версия сервера 1.21.4.</p>
        </div>
    </div>
  );
}
