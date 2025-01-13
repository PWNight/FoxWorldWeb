import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "FoxWorld",
};

export default function NotFound() {
  return (
    <div className="px-2 py-8 flex flex-col gap-8 justify-center items-start m-auto h-full sm:w-1/2 select-none">
        <h2 className="text-9xl font-bold">404</h2>
        <p className="text-muted-foreground text-xl">Мы не смогли найти указанную страницу :(
          <br/>Возможно данная страница временно недоступна или ещё не существует.
        </p>
        <Link href="/" className={buttonVariants({variant: "accent"})}>
        На главную
      </Link>
    </div>
  );
}
