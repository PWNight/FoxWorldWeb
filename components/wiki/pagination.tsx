import { getPreviousNext } from "@/lib/wiki/markdown";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

export default function Pagination({ pathname }: { pathname: string }) {
  const res = getPreviousNext(pathname);

  return (
    <div className="flex items-center justify-between sm:py-5 py-3">
      <div>
        {res.prev && (
          <Link
            className="flex items-center gap-2 no-underline text-xl px-1 duration-150 hover:text-[#F38F54]"
            href={`/wiki/${res.prev.href}`}
          >
            <ChevronLeftIcon className="w-[1.1rem] h-[1.1rem]" />
            <p>{res.prev.title}</p>
          </Link>
        )}
      </div>
      <div>
        {res.next && (
            <Link
              className="flex items-center gap-2 no-underline text-xl px-1 duration-150 hover:text-[#F38F54]"
              href={`/wiki/${res.next.href}`}
            >
              <p>{res.next.title}</p>
              <ChevronRightIcon className="w-[1.1rem] h-[1.1rem]" />
            </Link>
        )}
      </div>
    </div>
  );
}
