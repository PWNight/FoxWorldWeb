import { buttonVariants } from "@/components/ui/button";
import { NewsMdxFrontmatter, getAllNews } from "@/lib/markdown";
import { formatDate2, stringToDate } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FoxWorld - Новости",
};

export default async function NewsIndexPage() {
  const news = (await getAllNews()).sort(
    (a, b) =>
      stringToDate(b.frontmatter.date).getTime() -
      stringToDate(a.frontmatter.date).getTime()
  );
  return (
    <div className="w-full flex flex-col gap-1 sm:min-h-[91vh] min-h-[88vh] md:pt-6 pt-2">
      <div className="mb-6 flex flex-col gap-2 ">
        <h1 className="text-3xl font-extrabold">
          The latest News of this product
        </h1>
        <p className="text-muted-foreground">
          All the latest News and news, straight from the team.
        </p>
      </div>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        {news.map((news) => (
          <NewsCard {...news.frontmatter} slug={news.slug} key={news.slug} />
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
}: NewsMdxFrontmatter & { slug: string }) {
  return (
    <div className="flex flex-col gap-2 items-start border rounded-md p-5 pt-7">
      <Link
        href={`/news/${slug}`}
        className="sm:text-lg text-lg font-semibold -mt-1"
      >
        {title}
      </Link>
      <p className="text-sm text-muted-foreground">{description}</p>
      <p className="text-[13px] text-muted-foreground mb-1">
        Published on {formatDate2(date)}
      </p>
      <Link
        href={`/news/${slug}`}
        className={buttonVariants({
          className: "w-full mt-auto",
          variant: "secondary",
          size: "sm",
        })}
      >
        Read More
      </Link>
    </div>
  );
}
