import WikiBreadcrumb from "@/components/wiki-breadcrumb";
import Pagination from "@/components/pagination";
import Toc from "@/components/toc";
import { page_routes } from "@/lib/routes-config";
import { notFound } from "next/navigation";
import { getWikiForSlug } from "@/lib/markdown";
import { Typography } from "@/components/typography";
import { Info } from "lucide-react";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function WikiPage(props: PageProps) {
  const params = await props.params;
  const { slug = [] } = params;

  const pathName = slug.join("/");
  const res = await getWikiForSlug(pathName);

  if (!res) notFound();

  return (
      <div className="flex items-start gap-8 lg:gap-12 px-4 sm:px-6 lg:px-8">
        <div className="flex-[12] py-6">
          <WikiBreadcrumb paths={slug} />
          <Typography>
            <h1 className="sm:text-3xl text-2xl font-bold text-foreground mb-2">
              {res.frontmatter.title}
            </h1>
            <p className="text-muted-foreground sm:text-base text-sm mb-6 italic">
              {res.frontmatter.description}
            </p>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              {res.content}
            </div>
            <p className="text-xs sm:text-sm flex items-center gap-1.5 mt-8 text-muted-foreground">
              <Info className="w-4 h-4" />
              Последнее обновление: {res.frontmatter.update_date}
            </p>
            <div className="mt-8">
              <Pagination pathname={pathName} />
            </div>
          </Typography>
        </div>
        <Toc path={pathName} />
      </div>
  );
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const { slug = [] } = params;

  const pathName = slug.join("/");
  const res = await getWikiForSlug(pathName);
  if (!res) return {};
  const { frontmatter } = res;
  return {
    title: frontmatter.title,
    description: frontmatter.description,
  };
}

export function generateStaticParams() {
  return page_routes.map((item) => ({
    slug: item.href.split("/").slice(1),
  }));
}