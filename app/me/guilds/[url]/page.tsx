"use client"
import { useRouter } from"next/navigation";
import { useEffect, useState } from"react";
import {CloudUpload, LucideLoader, Pencil, Trash2} from "lucide-react";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import { getGuild, getSession} from "@/app/actions/getInfo";

type PageProps = {
    params: Promise<{ url: string }>;
};

export default function MyGuild(props: PageProps) {
    const [userData, setUserData] = useState(Object)
    const [userGuild, setUserGuild] = useState(Object)

    const [updateFormData, setUpdateFormData] = useState(Object)

    const [pageLoaded, setPageLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('')

    const router = useRouter();

    useEffect(()=>{
        getSession().then(async r => {
            if ( !r.success ) {
                router.push("/login")
                return
            }
            setUserData(r.data)

            const params = await props.params;
            const {url} = params;
            getGuild(url).then((r) => {
                if ( !r.success ) {
                    router.push("/me/guilds")
                    return
                }
                setUserGuild(r.data)
                setUpdateFormData({...r.data})
                setPageLoaded(true)
            })
        });
        //TODO: Page loaded state update (in last async function)
    },[router, props])

    const handleUpdate = async(e: any) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const session_token = userData.token;
        const params = await props.params
        const {url} = params;

        const changedFormData = Object.keys(updateFormData).reduce((acc: any, key) => {
            if (updateFormData[key] !== userGuild[key]) {
                acc[key] = updateFormData[key];
            }
            return acc;
        }, {});

        if (Object.keys(changedFormData).length === 0) {
            setError("Внесите изменения, чтобы сохранить");
            setIsLoading(false);
            return;
        }

        const result = await fetch(`/api/v1/guilds/${url}`,{
            method: 'POST',
            body: JSON.stringify({session_token:session_token, formData: changedFormData}),
        })

        const json : any = await result.json()

        if (!json.success) {
            setIsLoading(false);
            setError(json.message);
            return
        }
        setIsLoading(false)
        router.push('/me/guilds')
    };

    const handleInputChange = (e: any) => {
        const { id, value } = e.target;
        setUpdateFormData({ ...updateFormData, [id]: value }); // Update specific field
    };

    if( pageLoaded ) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">Редактирование гильдии</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow h-fit">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-semibold">Основная информация</h2>
                        </div>
                        <div className="p-4">
                            <form onSubmit={handleUpdate}>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block font-medium mb-2">Название гильдии</label>
                                    <input
                                        type="text"
                                        id="name"
                                        placeholder="Введите новое название"
                                        defaultValue={userGuild.name}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-neutral-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="url" className="block font-medium mb-2">Краткая ссылка</label>
                                    <input
                                        type="text"
                                        id="url"
                                        placeholder="Введите новую ссылку"
                                        defaultValue={userGuild.url}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-neutral-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="info" className="block font-medium mb-2">Слоган</label>
                                    <input
                                        type="text"
                                        id="info"
                                        placeholder="Введите новый слоган"
                                        defaultValue={userGuild.info}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-neutral-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="description" className="block font-medium mb-2">Полное описание</label>
                                    <textarea
                                        id="description"
                                        placeholder="Введите новое описание"
                                        defaultValue={userGuild.description}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-neutral-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                                <button type="submit" disabled={isLoading} className={buttonVariants({ className: "w-full", variant: 'accent' })}>
                                    {isLoading ? <><LucideLoader className="mr-2 animate-spin" /> Выполняю..</> : <><Pencil className="mr-2" />Сохранить изменения</>}
                                </button>
                                {error && <p className="text-red-400 mt-2">{error}</p>}
                            </form>
                        </div>
                    </div>

                    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-semibold">Дополнительные настройки</h2>
                        </div>
                        <div className="p-4">
                            <div className="mb-4">
                                <h3 className="text-lg font-medium mb-2">Эмблема гильдии (В разработке)</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    Устанавливаемая эмблема не должна нарушать <Link href="/wiki/rules" className="text-orange-500">правила сервера</Link>
                                </p>
                                <div className="flex gap-2">
                                    <button className={buttonVariants({ variant: "accent" })}>
                                        <CloudUpload className="mr-2" /> Выбрать файл
                                    </button>
                                    <button className={buttonVariants({ variant: "destructive" })}>
                                        <Trash2 className="mr-2" /> Удалить
                                    </button>
                                </div>
                            </div>
                            <div className="mb-4">
                                <h3 className="text-lg font-medium mb-2">Discord сервер</h3>
                                <input
                                    type="text"
                                    id="discord"
                                    placeholder="Введите ссылку на сервер"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-neutral-700 dark:border-gray-600 dark:text-white"
                                />
                                <div className="flex gap-2 mt-2">
                                    <button className={buttonVariants({ variant: "accent" })}>
                                         Сохранить ссылку
                                    </button>
                                    <button className={buttonVariants({ variant: "destructive" })}>
                                        <Trash2 className="mr-2" /> Удалить
                                    </button>
                                </div>
                            </div>
                            <div className="mb-4">
                                <h3 className="text-lg font-medium mb-2">Статус вступления</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    Здесь вы можете временно отключить возможность подавать заявку в гильдию.
                                </p>
                                <div className="flex gap-2">
                                    <button className={buttonVariants({ variant: "accent" })}>
                                        Разрешить заявки
                                    </button>
                                    <button className={buttonVariants({ variant: "destructive" })}>
                                        Запретить заявки
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 flex flex-col gap-2">
                                <Link href={'/me/guilds/' + userGuild.url + '/users'} className={buttonVariants({ variant: "accent", className: "w-full" })}>Управление участниками</Link>
                                <button className={buttonVariants({ variant: "destructive", className: "w-full" })}>Удалить гильдию</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}