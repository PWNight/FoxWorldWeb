"use client"
import { useRouter } from"next/navigation";
import { useEffect, useState } from"react";
import {CloudUpload, LucideLoader, Trash2} from "lucide-react";
import Link from "next/link";
import {Button, buttonVariants} from "@/components/ui/button";
import {checkGuildAccess, getSession} from "@/app/actions/getInfo";

type PageProps = {
    params: Promise<{ url: string }>;
};

export default function MyGuild(props: PageProps) {
    const [userData, setUserData] = useState(Object)
    const [userGuild, setuserGuild] = useState(Object)

    const [updateFormData, setUpdateFormData] = useState({
        name: '',
        value: '',
    });

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
            checkGuildAccess(url, r.data).then((r) => {
                if ( !r.success ) {
                    router.push("/me/guilds")
                    return
                }
                setuserGuild(r.data)
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

        const result = await fetch(`/api/v1/guilds/${url}`,{
            method: 'POST',
            body: JSON.stringify({session_token:session_token, formData:updateFormData}),
        })
        const json : any = await result.json()
        if(json.success){
            setIsLoading(false)
            router.push('/me/guilds')
        }else{
            setIsLoading(false);
            setError(json.message)
        }
    };
    if( pageLoaded ) {
        return (
            <div className="grid sm:grid-flow-col gap-2 w-fit">
                <div className="bg-neutral-100 rounded-sm p-4 flex flex-col dark:bg-neutral-800 h-full w-fit">
                    <div className="text-sm w-fit bg-neutral-100 dark:bg-neutral-800 rounded-xl p-5 text-gray-900 dark:text-gray-100">
                        <div className="flex flex-col gap-2 mb-5">
                            <h1 className='text-3xl'>Информация о гильдии</h1>
                        </div>
                        <form className="mb-5 select-none gap-2 flex flex-col" onSubmit={handleUpdate}>
                            <label htmlFor="name" className="block mb-2 font-medium">Название гильдии: <b>{userGuild.name}</b></label>
                            <input
                                type="text"
                                id="name"
                                placeholder='Введите новое название'
                                onChange={(e) => setUpdateFormData({name: e.target.id, value: e.target.value})}
                                className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                            />
                            <button type="submit"
                                    disabled={isLoading}
                                    className="select-none text-white bg-orange-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center flex items-center gap-1">{isLoading ? <>
                                <LucideLoader/><p>Выполняю..</p></> : 'Изменить данные'}</button>
                            {error && <p className="text-red-400 mt-1 mb-5">{error}</p>}
                        </form>
                        <form className="mb-5 select-none gap-2 flex flex-col" onSubmit={handleUpdate}>
                            <label htmlFor="url" className="block mb-2 font-medium">Краткая ссылка на гильдию: <b>/{userGuild.url}</b></label>
                            <input
                                type="text"
                                id="url"
                                placeholder='Введите новую ссылку'
                                onChange={(e) => setUpdateFormData({name: e.target.id, value: e.target.value})}
                                className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                            />
                            <button type="submit"
                                    disabled={isLoading}
                                    className="select-none text-white bg-orange-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center flex items-center gap-1">{isLoading ? <>
                                <LucideLoader/><p>Выполняю..</p></> : 'Изменить данные'}</button>
                            {error && <p className="text-red-400 mt-1 mb-5">{error}</p>}
                        </form>
                        <form className="mb-5 select-none gap-2 flex flex-col" onSubmit={handleUpdate}>
                            <label htmlFor="info" className="block mb-2 font-medium">Слоган вашей гильдии: <b>{userGuild.info}</b></label>
                            <input
                                type="text"
                                id="info"
                                placeholder='Введите новый слоган'
                                onChange={(e) => setUpdateFormData({name: e.target.id, value: e.target.value})}
                                className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                            />
                            <button type="submit"
                                    disabled={isLoading}
                                    className="select-none text-white bg-orange-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center flex items-center gap-1">{isLoading ? <>
                                <LucideLoader/><p>Выполняю..</p></> : 'Изменить данные'}</button>
                            {error && <p className="text-red-400 mt-1 mb-5">{error}</p>}
                        </form>
                        <form className="mb-5 select-none gap-2 flex flex-col" onSubmit={handleUpdate}>
                            <label htmlFor="description" className="block mb-2 font-medium">Полное описание вашей гильдии: <b>{userGuild.description}</b></label>
                            <input
                                type="text"
                                id="description"
                                placeholder='Введите новое описание'
                                onChange={(e) => setUpdateFormData({name: e.target.id, value: e.target.value})}
                                className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                            />
                            <button type="submit"
                                    disabled={isLoading}
                                    className="select-none text-white bg-orange-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center flex items-center gap-1">{isLoading ? <>
                                <LucideLoader/><p>Выполняю..</p></> : 'Изменить данные'}</button>
                            {error && <p className="text-red-400 mt-1 mb-5">{error}</p>}
                        </form>
                    </div>
                </div>
                <div className="flex flex-col gap-2 ">
                    <div
                        className="bg-neutral-100 rounded-sm p-4 max-h-fit flex justify-center flex-col dark:bg-neutral-800">
                        <div className="border-b">
                            <h1 className="text-2xl">Эмблема гильдии (В разработке)</h1>
                            <p className="text-muted-foreground">Здесь вы можете изменить эмблему гильдии</p>
                        </div>
                        <div className="flex flex-col gap-4 my-2">
                            <Link href='/wiki/rules' className="text-orange-400 hover:text-orange-500 transition-all"><p
                                className="text-muted-foreground">Устанавливаемая эмблема не должен нарушать</p>правила
                                сервера</Link>
                            <div className="flex 2xl:flex-row flex-col gap-2">
                                <Button variant='accent' className="flex gap-1"><CloudUpload/>Выбрать файл</Button>
                                <Button variant='destructive' className="flex gap-1"><Trash2/>Удалить эмблему</Button>
                            </div>
                        </div>
                    </div>
                    <div
                        className="bg-neutral-100 rounded-sm p-4 max-h-fit flex justify-center flex-col dark:bg-neutral-800">
                        <div className="border-b">
                            <h1 className="text-2xl">Дискорд сервер гильдии (В разработке)</h1>
                            <p className="text-muted-foreground">Здесь вы можете указать ссылку на дискрод сервер вашей
                                гильдии</p>
                        </div>
                        <div className="flex flex-col my-4">
                            <form className="mb-5 select-none gap-2 flex flex-col" onSubmit={handleUpdate}>
                                <input
                                    type="text"
                                    id="description"
                                    placeholder='Введите ссылку на сервер'
                                    onChange={(e) => setUpdateFormData({name: e.target.id, value: e.target.value})}
                                    className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                                />
                                <div className="flex flex-row gap-2">
                                    <button type="submit"
                                        disabled={isLoading}
                                        className="select-none text-white bg-orange-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center flex items-center gap-1">{isLoading ? <>
                                    <LucideLoader/><p>Выполняю..</p></> : 'Изменить данные'}</button>
                                    {error && <p className="text-red-400 mt-1 mb-5">{error}</p>}
                                    <Button variant='destructive' className="flex gap-1"><Trash2/>Удалить сервер</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div
                        className="bg-neutral-100 rounded-sm p-4 max-h-fit flex justify-center flex-col dark:bg-neutral-800">
                        <div className="border-b">
                            <h1 className="text-2xl">Статус входа в гильдию (В разработке)</h1>
                            <p className="text-muted-foreground">Здесь вы можете временно отключить возможность <br/>подавать заявку в гильдию и наоборот</p>
                        </div>
                        <div className="flex xl:flex-row flex-col my-4 gap-2">
                            <Button variant='accent' className="flex gap-1">Разрешить заявки</Button>
                            <Button variant='destructive' className="flex gap-1">Запретить заявки</Button>
                        </div>
                    </div>
                    <div className="flex xl:flex-row flex-col gap-4">
                        <Link href={'/me/guilds/' + userGuild.url + '/users'} className={buttonVariants({variant: "accent"})}>Управление участниками</Link>
                        <Button variant='destructive'>Удалить гильдию</Button>
                    </div>
                </div>
            </div>
        )
    }
}