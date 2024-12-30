import { Typography } from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import { Author, getAllNewsStaticPaths, getNewsForSlug } from "@/lib/markdown";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

type PageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: PageProps) {
    const params = await props.params;
    const {slug} = params;

    const res = await getNewsForSlug(slug);
    if (!res) { // @ts-ignore
        return null;
    }
    const { frontmatter } = res;
    return {
        title: frontmatter.title,
        description: frontmatter.description,
        cover: frontmatter.cover
    };
}

export async function generateStaticParams() {
  const val = await getAllNewsStaticPaths();
  if (!val) return [];
  return val.map((it) => ({ slug: it }));
}

export default async function NewsPage(props: PageProps) {
    const params = await props.params;
    const {slug} = params;

    const res = await getNewsForSlug(slug);
    if (!res) notFound();
    return (
        <div className="lg:w-[60%] sm:[95%] md:[75%] mx-auto px-4">
          <Link
            className={buttonVariants({
              variant: "link",
              className: "!mx-0 !px-0 mb-7 !-ml-1 ",
            })}
            href="/news"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1.5" /> Обратно к новостям
          </Link>
          <div className="flex flex-col gap-3 pb-7 w-full border-b mb-4">
            <div>
              <Image
                src={res.frontmatter.cover}
                alt={res.frontmatter.title}
                width={400}
                height={250}
                quality={100}
                className="rounded-md object-cover border"
              />
            </div>
            <p className="text-muted-foreground text-sm">
              {formatDate(res.frontmatter.date)}
            </p>
            <h1 className="sm:text-4xl text-3xl font-extrabold">
              {res.frontmatter.title}
            </h1>
            <div className="mt-6 flex flex-col gap-3">
              <Authors authors={res.frontmatter.authors} />
            </div>
          </div>
          <div className="!w-full">
            <Typography>{res.content}</Typography>
          </div>
        </div>
    );
}

function Authors({ authors }: { authors: Author[] }) {
  return (
    <div className="flex items-center gap-8 flex-wrap">
      {authors.map((author) => {
        return (
          <Link
            href={author.handleUrl}
            className="flex items-center gap-2"
            key={author.username}
          >
            <Avatar className="w-10 h-12">
              <AvatarImage src={author.avatar} />
              <AvatarFallback>
                {author.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="">
              <p className="text-sm font-medium">{author.username}</p>
              <p className="font-code text-[13px] text-muted-foreground">
                @{author.handle}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
