import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Author, NewsMdxFrontmatter, getAllNews } from "@/lib/markdown";
import { formatDate2, stringToDate } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FW - Новости",
};

export default async function NewsIndexPage() {
  const news = (await getAllNews()).sort(
    (a, b) => stringToDate(b.date).getTime() - stringToDate(a.date).getTime()
  );
  return (
    <div className="w-full mx-auto flex flex-col gap-1">
      <div className="mb-2 flex flex-col gap-2 sm:px-2 px-4">
        <h1 className="text-3xl font-extrabold">
          Последние новости
        </h1>
        <p className="text-muted-foreground">
          Все новости от команды разработки
        </p>
      </div>
      <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 sm:gap-8 gap-4 mb-2">
        {news.map((news) => (
          <NewsCard {...news} slug={news.slug} key={news.slug} />
        ))}
      </div>
    </div>
  );
}

function NewsCard({
  date,
  title,
  description,
  slug,
  cover,
  authors,
}: NewsMdxFrontmatter & { slug: string }) {
  return (
    <Link
      href={`/news/${slug}`}
      className="flex flex-col gap-2 items-start border-2 rounded-md py-5 px-3 bg-accent hover:border-[#F38F54] transition-all"
    >
      <h3 className="text-xl font-semibold -mt-1 pr-7">{title}</h3>
      <div className="w-full">
        <Image
          src={cover}
          alt={title}
          width={1000}
          height={1000}
          quality={100}
          className="w-full rounded-md object-cover border h-auto max-h-[300px]"
        />
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="flex items-center justify-between w-full mt-auto">
        <p className="text-[13px] text-muted-foreground">
          Опубликовано {formatDate2(date)}
        </p>
        <AvatarGroup users={authors} />
      </div>
    </Link>
  );
}

function AvatarGroup({ users, max = 4 }: { users: Author[]; max?: number }) {
  const displayUsers = users.slice(0, max);
  const remainingUsers = Math.max(users.length - max, 0);

  return (
    <div className="flex items-center">
      {displayUsers.map((user, index) => (
        <Avatar
          key={user.username}
          className={`inline-block w-10 h-14 ${
            index !== 0 ? "-ml-1" : ""
          } `}
        >
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback>
            {user.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}
      {remainingUsers > 0 && (
        <Avatar className="-ml-3 inline-block border-2 border-background hover:translate-y-1 transition-transform">
          <AvatarFallback>+{remainingUsers}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
