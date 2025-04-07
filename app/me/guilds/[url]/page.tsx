"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {ArrowLeft, Loader2, Pencil, Trash2} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getGuild, getSession } from "@/app/actions/getDataHandlers";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import ErrorMessage from "@/components/ui/notify-alert";
import {GuildEditSkelet} from "@/components/skelets/guilds";

type PageProps = {
    params: Promise<{ url: string }>;
};

export default function MyGuild(props: PageProps) {
    const [userData, setUserData] = useState(Object);
    const [userGuild, setUserGuild] = useState(Object);
    const [guildImages, setGuildImages] = useState([]);

    const [updateFormData, setUpdateFormData] = useState(Object);

    const [notifyMessage, setNotifyMessage] = useState("");

    const [notifyType, setNotifyType] = useState("");
    const [pageLoaded, setPageLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        // TODO: Сделать вывод ошибок в консоль
        getSession().then(async (r) => {
            const params = await props.params;
            const { url } = params;

            if ( !r.success ) {
                router.push(`/login?to=me/guilds/${url}`);
                return;
            }
            setUserData(r.data);

            // TODO: Переписать получение гильдии, сделав проверку на наличие доступа на редактирование
            getGuild(url).then((r) => {
                if ( !r.success ) {
                    router.push("/me/guilds");
                    return;
                }
                setUserGuild(r.data);
                setUpdateFormData({ ...r.data });
                setPageLoaded(true);
            });

            // TODO: Вынести получение альбома гильдии в функцию getDataHandlers.tsx
            const imagesResponse = await fetch(`/api/v1/guilds/${url}/album`, {
                headers: { Authorization: `Bearer ${r.data.token}` },
            });

            if ( !imagesResponse.ok ) {
                const imagesData = await imagesResponse.json();
                setGuildImages(imagesData.data || []);
            } else {
                console.error("Failed to fetch guild images");
            }
        });
    }, [router, props]);

    const handleAddScreenshot = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);

        const session_token = userData.token;
        const params = await props.params;
        const { url } = params;
        const imageUrl = e.target.image_url.value;

        const response = await fetch(`/api/v1/guilds/${url}/album`, {
            method: "POST",
            headers: { Authorization: `Bearer ${session_token}` },
            body: JSON.stringify({ url: imageUrl }),
        });

        if (!response.ok) {
            setNotifyMessage(`Ошибка ${response.status} при добавлении скриншота`);
            setNotifyType("error");
            setIsLoading(false);
            return;
        }

        const newImage = await response.json();
        // TODO: Исправить типизацию
        // @ts-ignore
        setGuildImages([...guildImages, newImage.data]);

        setNotifyMessage("Скриншот успешно добавлен");
        setNotifyType("success");
        setIsLoading(false);
        e.target.reset();
    };

    const handleDeleteScreenshot = async (imageId: number) => {
        setIsLoading(true);
        const session_token = userData.token;
        const params = await props.params;
        const { url } = params;

        const response = await fetch(`/api/v1/guilds/${url}/album?imageId=${imageId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${session_token}` },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData)

            setNotifyMessage(`Ошибка ${response.status} при удалении скриншота`);
            setNotifyType("error");
            setIsLoading(false);
            return;
        }

        setGuildImages(guildImages.filter((img:any) => img.id !== imageId));

        setNotifyMessage("Скриншот успешно удален");
        setNotifyType("success");
        setIsLoading(false);
    };

    const handleUpdate = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);

        const session_token = userData.token;
        const params = await props.params;
        const { url } = params;

        const changedFormData = Object.keys(updateFormData).reduce((acc: any, key) => {
            if (updateFormData[key] !== userGuild[key]) {
                acc[key] = updateFormData[key];
            }
            return acc;
        }, {});

        if (Object.keys(changedFormData).length === 0) {
            setNotifyMessage("Внесите изменения, чтобы сохранить");
            setNotifyType("warning");
            setIsLoading(false);
            return;
        }

        const response = await fetch(`/api/v1/guilds/${url}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${session_token}` },
            body: JSON.stringify({ formData: changedFormData }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData);

            setNotifyMessage(`Произошла ошибка ${response.status} при обновлении гильдии`);
            setNotifyType("error");
            setIsLoading(false);
            return;
        }

        setUserGuild({ ...userGuild, ...changedFormData });

        setNotifyMessage("Информация о гильдии успешно обновлена");
        setNotifyType("success");
        setIsLoading(false);
    };

    const handleInputChange = (e: any) => {
        const { id, value } = e.target;
        setUpdateFormData({ ...updateFormData, [id]: value });
    };

    const GuildDeleteDialog = ({ guildName, onDelete }: { guildName: string; onDelete: () => void }) => {
        const [open, setOpen] = useState(false);

        const handleDeleteConfirm = () => {
            onDelete();
            setOpen(false);
        };

        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <button
                        className={buttonVariants({
                            variant: "destructive",
                            className: "w-full flex items-center gap-2 text-white dark:text-white",
                        })}
                    >
                        <Trash2 className="w-4 h-4" /> Удалить гильдию
                    </button>
                </DialogTrigger>
                <DialogContent className="bg-white dark:bg-neutral-800 sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900 dark:text-gray-100">Подтверждение удаления</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                            Вы уверены, что хотите удалить гильдию{" "}
                            <span className="font-semibold text-gray-900 dark:text-gray-200">{guildName}</span>? Это действие нельзя отменить.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:justify-end">
                        <button
                            className={buttonVariants({
                                variant: "outline",
                                className: "text-gray-700 dark:text-gray-300 border-gray-300 dark:border-zinc-700",
                            })}
                            onClick={() => setOpen(false)}
                        >
                            Отмена
                        </button>
                        <button
                            className={buttonVariants({
                                variant: "destructive",
                                className: "text-white dark:text-white",
                            })}
                            onClick={handleDeleteConfirm}
                        >
                            Удалить
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

    const handleDelete = async () => {
        // TODO: Придумать как оптимизировать создание fetch переменных
        const session_token = userData.token;
        let response = await fetch(`/api/v1/guilds/${userGuild.url}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${session_token}` },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData);

            setNotifyMessage(`Произошла ошибка ${response.status} при удалении гильдии`);
            setNotifyType("error");
            return;
        }

        response = await fetch("/api/v1/notifications", {
            method: "POST",
            headers: { Authorization: `Bearer ${session_token}` },
            body: JSON.stringify({
                userId: userData.profile.id,
                message: "Ваша гильдия успешно удалена.",
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData);
            setNotifyMessage(`Произошла ошибка ${response.status} при отправке уведомления`);
            setNotifyType("error");
            return;
        }

        router.push("/me/guilds");
    };

    const handleClose = () => setNotifyMessage("");

    // TODO: Обновить скелет под новый дизайн
    if (!pageLoaded) {
        return <GuildEditSkelet/>;
    }

    return (
        <div>
            {notifyMessage && <ErrorMessage message={notifyMessage} onClose={handleClose} type={notifyType} />}
            <Link href={'/me/guilds'} className={buttonVariants({variant: "accent"}) + "flex flex-row gap-2 mb-4"}>
                <ArrowLeft/>
                Обратно к гильдиям
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Редактирование гильдии</h1>
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Основная информация */}
                <div className="h-fit lg:min-w-[40%] space-y-4">
                    <form onSubmit={handleUpdate} className="space-y-4 bg-white dark:bg-neutral-800 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl p-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Название гильдии
                            </label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Введите новое название"
                                defaultValue={userGuild.name}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Краткая ссылка
                            </label>
                            <input
                                type="text"
                                id="url"
                                placeholder="Введите новую ссылку"
                                defaultValue={userGuild.url}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="info" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Слоган
                            </label>
                            <input
                                type="text"
                                id="info"
                                placeholder="Введите новый слоган"
                                defaultValue={userGuild.info}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Полное описание
                            </label>
                            <textarea
                                id="description"
                                placeholder="Введите новое описание"
                                defaultValue={userGuild.description}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 resize-y"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={buttonVariants({
                                variant: "accent",
                                className: "w-full flex items-center justify-center gap-2 text-white dark:text-white",
                            })}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Выполняю...
                                </>
                            ) : (
                                <>
                                    <Pencil className="w-4 h-4" /> Сохранить изменения
                                </>
                            )}
                        </button>
                    </form>
                    <div className='bg-white dark:bg-neutral-800 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl p-6 space-y-2'>
                        <Link
                            href={`/me/guilds/${userGuild.url}/users`}
                            className={buttonVariants({
                                variant: "accent",
                                className: "w-full flex items-center justify-center gap-2 text-white dark:text-white",
                            })}
                        >
                            Управление участниками
                        </Link>
                        <GuildDeleteDialog guildName={userGuild.url} onDelete={handleDelete} />
                    </div>
                </div>

                {/* Дополнительные настройки */}
                <div className="grid 3xl:grid-cols-2 grid-cols-1 gap-2 h-fit">
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl p-6">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Эмблема гильдии</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Эмблема не должна нарушать{" "}
                            <Link href="/rules" className="text-orange-500 hover:underline">
                                правила сервера
                            </Link>
                            . См.{" "}
                            <Link href="/wiki/guides/emblems" className="text-orange-500 hover:underline">
                                гайд
                            </Link>
                            .
                        </p>
                        <form onSubmit={handleUpdate} className="space-y-3">
                            <input
                                type="text"
                                id="badge_url"
                                placeholder="Ссылка на эмблему (planetminecraft)"
                                defaultValue={userGuild.badge_url}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                            />
                            <button
                                disabled={isLoading}
                                className={buttonVariants({
                                    variant: "accent",
                                    className: "w-full flex items-center justify-center gap-2 text-white dark:text-white",
                                })}
                                type="submit"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Выполняю...
                                    </>
                                ) : (
                                    <>
                                        <Pencil className="w-4 h-4" /> Сохранить
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                    <div className={'bg-white dark:bg-neutral-800 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl p-6'}>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Discord сервер</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Здесь вы можете установить ссылку на ваш Discord сервер
                        </p>
                        <form onSubmit={handleUpdate} className="space-y-3">
                            <input
                                type="text"
                                id="discord_code"
                                placeholder="Ссылка на Discord (например, https://discord.gg/2yyeWQ5unZ)"
                                defaultValue={userGuild.discord_code}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                            />
                            <button
                                disabled={isLoading}
                                className={buttonVariants({
                                    variant: "accent",
                                    className: "w-full flex items-center justify-center gap-2 text-white dark:text-white",
                                })}
                                type="submit"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Выполняю...
                                    </>
                                ) : (
                                    <>
                                        <Pencil className="w-4 h-4" /> Сохранить
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                    <div className={'bg-white dark:bg-neutral-800 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl p-6'}>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Статус набора</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Здесь вы можете управлять статусом набора в вашу гильдию.
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            При закрытии набора игроки не смогут отправлять заявки в вашу гильдию.
                        </p>
                        <form onSubmit={handleUpdate} className="space-y-3">
                            <div className="bg-neutral-100 dark:bg-neutral-700 rounded-lg p-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium dark:text-white p-1">
                                        Текущий статус:
                                    </span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            updateFormData.is_recruit === 1
                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                        }`}
                                    >
                                        {updateFormData.is_recruit === 1 ? "Набор открыт" : "Набор закрыт"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setUpdateFormData({ ...updateFormData, is_recruit: 1 })}
                                    disabled={updateFormData.is_recruit === 1}
                                    className={buttonVariants({
                                        variant: "accent",
                                        className: `flex-1 ${
                                            updateFormData.is_recruit === 1
                                                && "opacity-50 cursor-not-allowed dark:bg-neutral-700"
                                        }`
                                    })}
                                >
                                    Открыть набор
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUpdateFormData({ ...updateFormData, is_recruit: 0 })}
                                    disabled={updateFormData.is_recruit === 0}
                                    className={buttonVariants({
                                        variant: "accent",
                                        className: `flex-1 ${
                                            updateFormData.is_recruit === 0
                                                && "opacity-50 cursor-not-allowed dark:bg-neutral-700"
                                        }`
                                    })}
                                >
                                    Закрыть набор
                                </button>
                            </div>
                            <button
                                disabled={isLoading}
                                className={buttonVariants({
                                    variant: "accent",
                                    className: "w-full flex items-center justify-center gap-2 text-white dark:text-white",
                                })}
                                type="submit"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Выполняю...
                                    </>
                                ) : (
                                    <>
                                        <Pencil className="w-4 h-4" /> Сохранить
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl p-6">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Альбом скриншотов</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Добавляйте скриншоты вашей гильдии. Они будут отображаться на странице гильдии.
                        </p>

                        {/* Display current screenshots */}
                        {guildImages.length > 0 ? (
                            <div className="space-y-2 mb-4">
                                {guildImages.map((image: any) => (
                                    <div key={image.id} className="flex items-center justify-between p-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
                                        <a href={image.url} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline truncate flex-1">
                                            {image.url}
                                        </a>
                                        <button
                                            onClick={() => handleDeleteScreenshot(image.id)}
                                            className={buttonVariants({
                                                variant: "destructive",
                                                className: "ml-2 flex items-center gap-1 text-white dark:text-white",
                                            })}
                                            disabled={isLoading}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Скриншоты отсутствуют</p>
                        )}

                        {/* Form to add a new screenshot */}
                        <form onSubmit={handleAddScreenshot} className="space-y-3">
                            <input
                                type="text"
                                id="image_url"
                                placeholder="Введите ссылку на изображение"
                                className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={buttonVariants({
                                    variant: "accent",
                                    className: "w-full flex items-center justify-center gap-2 text-white dark:text-white",
                                })}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Добавляю...
                                    </>
                                ) : (
                                    <>
                                        <Pencil className="w-4 h-4" /> Добавить скриншот
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}