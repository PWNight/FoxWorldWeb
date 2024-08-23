import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] px-2 py-8 flex flex-col gap-8 items-center justify-center text-center select-none">
      <div>
        <h2 className="text-9xl font-bold">404</h2>
        <p className="text-muted-foreground text-xl">Мы не смогли найти указанную страницу :(</p>
      </div>

      <Link href="/" className={buttonVariants({})}>
        На главную
      </Link>
    </div>
  );
}
