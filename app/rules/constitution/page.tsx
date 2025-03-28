import { notFound } from "next/navigation";
import {getOtherForSlug} from "@/lib/markdown";
import { Typography } from "@/components/typography";
import { Info } from "lucide-react";
import Link from "next/link";

export default async function RulesPage() {
    const res = await getOtherForSlug('rules/constitution');

    if (!res) notFound();

    return (
        <div className="flex items-start gap-8 lg:gap-12 px-4 sm:px-6 lg:px-8">
            <div className="flex-[12] py-6">
                <Link href="/rules">Правила</Link>
                <Typography>
                    <h1 className="sm:text-3xl text-2xl font-bold text-foreground mb-2">
                        {res.frontmatter.title}
                        <Link
                            href="/rules"
                            className="text-primary no-underline hover:underline ml-2"
                        >
                            (См. Правила)
                        </Link>
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
                </Typography>
            </div>
        </div>
    );
}

export async function generateMetadata() {
    const res = await getOtherForSlug('rules/constitution');
    if (!res) return {};
    const { frontmatter } = res;
    return {
        title: frontmatter.title,
        description: frontmatter.description,
    };
}