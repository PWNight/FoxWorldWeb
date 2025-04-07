"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/notify-alert";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Handshake } from "lucide-react";
import { Crown } from "lucide-react";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Typography } from "@/components/typography";

type PageProps = {
    params: Promise<{ url: string }>;
};

const components = {
    h1: (props: any) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
    h2: (props: any) => <h2 className="text-xl font-semibold mt-3 mb-2" {...props} />,
    p: (props: any) => <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed" {...props} />,
    a: (props: any) => <a className="text-[#F38F54] hover:underline" {...props} />,
    ul: (props: any) => <ul className="list-disc pl-5 mb-4" {...props} />,
    ol: (props: any) => <ol className="list-decimal pl-5 mb-4" {...props} />,
    li: (props: any) => <li className="mb-1" {...props} />,
};

export default function Guild(props: PageProps) {
    const [guild, setGuildData] = useState(Object);
    const [guildUsers, setGuildUsers] = useState([]);
    const [guildImages, setGuildImages] = useState([]); // State for images from DB
    const [notifyMessage, setNotifyMessage] = useState("");
    const [notifyType, setNotifyType] = useState("");
    const [pageLoaded, setPageLoaded] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleUsers, setVisibleUsers] = useState(5);
    const [showAll, setShowAll] = useState(false);
    const [descriptionContent, setDescriptionContent] = useState<React.ReactNode | null>(null);

    useEffect(() => {
        const fetchGuild = async () => {
            try {
                const params = await props.params;
                const guildUrl = params.url;

                // Fetch guild data
                const guildResponse = await fetch(`/api/v1/guilds/${guildUrl}`, { method: "GET" });
                if (!guildResponse.ok) {
                    const errorData = await guildResponse.json();
                    console.log(errorData);
                    setNotifyMessage(`Произошла ошибка при загрузке гильдии`);
                    setNotifyType("error");
                    setPageLoaded(true);
                    return;
                }

                const guild = await guildResponse.json();
                setGuildData(guild.data);

                // Преобразование Markdown в HTML
                const { content } = await compileMDX({
                    source: guild.data.description || "",
                    options: {
                        mdxOptions: {
                            remarkPlugins: [remarkGfm],
                            rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
                        },
                    },
                    components,
                });
                setDescriptionContent(content);

                // Fetch guild users
                const usersResult = await fetch(`/api/v1/guilds/${guildUrl}/users`, { method: "GET" });
                if (!usersResult.ok) {
                    const errorData = await usersResult.json();
                    console.log(errorData);
                    setNotifyMessage(`Произошла ошибка при загрузке участников гильдии`);
                    setNotifyType("error");
                    setPageLoaded(true);
                    return;
                }

                const guildUsers = await usersResult.json();
                setGuildUsers(guildUsers.data);

                // Fetch guild images
                const imagesResponse = await fetch(`/api/v1/guilds/${guildUrl}/images`, { method: "GET" });
                if (!imagesResponse.ok) {
                    const errorData = await imagesResponse.json();
                    console.log(errorData);
                    setNotifyMessage(`Произошла ошибка при загрузке изображений гильдии`);
                    setNotifyType("error");
                    setGuildImages([]); // Set empty array on failure
                } else {
                    const imagesData = await imagesResponse.json();
                    setGuildImages(imagesData.data || []); // Ensure it's an array
                }

                setPageLoaded(true);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
                setNotifyMessage(`Произошла ошибка при загрузке данных`);
                setNotifyType("error");
                setPageLoaded(true);
            }
        };

        fetchGuild();
    }, [props.params]);

    const handleClose = () => setNotifyMessage("");

    const handlePrevImage = () =>
        setCurrentImageIndex((prev) => (prev === 0 ? guildImages.length - 1 : prev - 1));
    const handleNextImage = () =>
        setCurrentImageIndex((prev) => (prev === guildImages.length - 1 ? 0 : prev + 1));
    const goToImage = (index: number) => setCurrentImageIndex(index);

    const filteredUsers = guildUsers
        .filter((user: any) => user.nickname?.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a: any, b: any) => {
            if (a.permission > 0 && b.permission === 0) return -1;
            if (a.permission === 0 && b.permission > 0) return 1;
            return b.permission - a.permission;
        });

    const handleShowMore = () => {
        setVisibleUsers(filteredUsers.length);
        setShowAll(true);
    };

    const handleHide = () => {
        setVisibleUsers(5);
        setShowAll(false);
    };

    if (Object.keys(guild).length === 0 || !pageLoaded) {
        return (
            <div className="flex flex-col px-4 w-full mx-auto sm:w-[90%] items-center justify-center">
                {notifyMessage && (
                    <ErrorMessage message={notifyMessage} onClose={handleClose} type={notifyType} />
                )}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] sm:w-[90%] mx-auto p-6 gap-6">
            {/* Левая колонка */}
            <div className="space-y-6">
                {notifyMessage && (
                    <ErrorMessage message={notifyMessage} onClose={handleClose} type={notifyType} />
                )}
                {/* Информация о гильдии */}
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6 shadow-md flex flex-col sm:flex-row gap-6">
                    {guild.badge_url && (
                        <Image
                            src={guild.badge_url}
                            alt={`Эмблема ${guild.url}`}
                            width={96}
                            height={96}
                            quality={100}
                            className="rounded-lg object-cover"
                        />
                    )}
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">{guild.name}</h1>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-4">{guild.info}</p>
                        <ul className="text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                            {guild.is_openProfile ? (
                                <li className="text-green-400">Открытый профиль</li>
                            ) : (
                                <li className="text-red-400">Закрытый профиль</li>
                            )}
                            {guild.is_recruit ? (
                                <li className="text-green-400">Принимает заявки</li>
                            ) : (
                                <li className="text-red-400">Не принимает заявки</li>
                            )}
                            {guild.discord_code && (
                                <li className="text-blue-400">Есть Discord сервер ({
                                    guild.is_openDiscord ? "открытый" : "закрытый"
                                })</li>
                            )}
                            <li>Создана {new Date(guild.create_date).toLocaleString("ru-RU")}</li>
                            <li>{guild.member_count} участников</li>
                        </ul>
                    </div>
                </div>

                {/* Описание */}
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6 shadow-md">
                    <Typography>
                        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
                            {descriptionContent}
                        </div>
                    </Typography>
                </div>

                {/* Карусель */}
                {guildImages.length > 0 ? (
                    <div className="relative bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6 shadow-md">
                        <div className="overflow-hidden rounded-lg">
                            <div
                                className="flex transition-transform duration-300 ease-in-out"
                                style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                            >
                                {guildImages.map((image: any, index: number) => (
                                    <div
                                        key={image.id}
                                        className="shrink-0 w-full aspect-video max-h-[400px] rounded-lg"
                                    >
                                        <Image
                                            alt={`slide-${index + 1}`}
                                            draggable={false}
                                            loading="lazy"
                                            width={1200}
                                            height={675}
                                            quality={100}
                                            className="w-full h-full object-cover rounded-lg"
                                            src={image.url}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={handlePrevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-neutral-200 dark:bg-neutral-700 rounded-full text-black dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-600 transition"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={handleNextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-neutral-200 dark:bg-neutral-700 rounded-full text-black dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-600 transition"
                        >
                            <ChevronRight size={24} />
                        </button>
                        <div className="flex justify-center gap-2 mt-4">
                            {guildImages.map((_: any, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => goToImage(index)}
                                    className={`w-3 h-3 rounded-full transition ${
                                        currentImageIndex === index
                                            ? "bg-[#F38F54]"
                                            : "bg-neutral-400 dark:bg-neutral-600 hover:bg-neutral-500"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6 shadow-md text-center">
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">
                            Изображения для этой гильдии отсутствуют.
                        </p>
                    </div>
                )}
            </div>

            {/* Правая колонка */}
            <div className="space-y-6">
                {/* Ссылки */}
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6 shadow-md">
                    <h2 className="text-2xl font-semibold text-black dark:text-white mb-4 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                        Ссылки
                    </h2>
                    <div className="flex flex-col gap-3">
                        {guild.is_recruit ? (
                            <Link
                                href={`/guilds/${guild.url}/application`}
                                className={buttonVariants({
                                    variant: "accent",
                                    className: "w-full bg-[#F38F54] hover:bg-[#e07b39] text-white",
                                    size: "lg",
                                })}
                            >
                                Подать заявку
                            </Link>
                        ) : null}
                        {guild.badge_url && (
                            <Link
                                href={guild.badge_url}
                                className={buttonVariants({
                                    variant: "link",
                                    className: "text-[#F38F54] hover:text-[#e07b39]",
                                    size: "sm",
                                })}
                            >
                                Ссылка на баннер
                            </Link>
                        )}
                    </div>
                </div>

                {/* Участники */}
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6 shadow-md">
                    <h2 className="text-2xl font-semibold text-black dark:text-white mb-4 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                        Участники
                    </h2>
                    <input
                        type="text"
                        placeholder="Поиск участников..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#F38F54] mb-4 transition"
                    />
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {filteredUsers.slice(0, visibleUsers).map((user: any, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                            >
                                <Image
                                    src={`https://minotar.net/helm/${user.nickname}/150.png`}
                                    alt={user.nickname || "Без имени"}
                                    width={40}
                                    height={40}
                                    quality={100}
                                    className="rounded-md"
                                />
                                <p className="text-sm text-zinc-700 dark:text-zinc-300 flex-1 truncate">
                                    {user.nickname || "Без имени"}
                                </p>
                                {user.permission === 2 && <Crown size={20} className="text-orange-500" />}
                                {user.permission === 1 && (
                                    <Handshake size={20} className="text-orange-500" />
                                )}
                            </div>
                        ))}
                    </div>
                    {!showAll && filteredUsers.length > 5 && (
                        <button
                            onClick={handleShowMore}
                            className={buttonVariants({
                                variant: "outline",
                                className: "w-full mt-4 border-[#F38F54] text-[#F38F54] hover:bg-[#F38F54] dark:hover:text-white ",
                                size: "sm",
                            })}
                        >
                            Показать больше
                        </button>
                    )}
                    {showAll && (
                        <button
                            onClick={handleHide}
                            className={buttonVariants({
                                variant: "outline",
                                className: "w-full mt-4 border-[#F38F54] text-[#F38F54] hover:bg-[#F38F54] dark:hover:text-white",
                                size: "sm",
                            })}
                        >
                            Скрыть
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}