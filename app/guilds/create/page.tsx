"use client"
import {LucideLoader} from "lucide-react";
import { useRouter } from"next/navigation";
import { useEffect, useState } from "react";
import {getSession} from "@/app/actions/getInfo";

export default function CreateGuild() {
    const [userData, setUserData] = useState(Object)

    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [info, setInfo] = useState('');
    const [description, setDescription] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('')

    const router = useRouter();

    useEffect(() => {
        getSession().then(async r => {
            if ( !r.success ) {
                router.push("/login")
                return
            }

            if ( r.data.profile.in_guild ) {
                router.push("/me/guilds")
                return
            }

            setUserData(r.data)

        });
    }, [router]);

    const handleSubmit = async(e: any) => {
        e.preventDefault();

        setIsLoading(true);

        // Сброс ошибок
        setError('')
        let hasError = false;

        // Валидация элементов формы
        if ('' === name) {
            setError('Введите название гильдии');
            setIsLoading(false);
            hasError = true;
        }
        if ('' === url) {
            setError('Введите ссылку на гильдию');
            setIsLoading(false);
            hasError = true;
        }
        if ('' === info) {
            setError('Введите краткую информацию о гильдии');
            setIsLoading(false);
            hasError = true;
        }
        if ('' === description) {
            setError('Введите полную информацию о гильдии');
            setIsLoading(false);
            hasError = true;
        }

        if (!hasError) {
            const session_token = userData.token;
            const result = await fetch('/api/v1/guilds',{
                method: 'POST',
                body: JSON.stringify({name,url,info,description,session_token}),
            })
            const json : any = await result.json()
            console.log(json)
            if(json.success){
                router.push('/me/guilds')
            }else{
                setIsLoading(false);
                setError(json.message)
            }
        }
    };

    return (
        <div className="flex sm:min-h-[91vh] min-h-[88vh] flex-col justify-center items-start sm:px-2 py-8 gap-10 w-full">
            <form className="text-sm w-auto mx-auto bg-neutral-100 dark:bg-neutral-800 rounded-xl p-5 text-gray-900 dark:text-gray-100" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2 mb-5">
                    <h1 className='text-3xl'>Создание гильдии</h1>
                    <p>Заполните форму и начните принимать новых игроков в свою гильдию</p>
                </div>
                <div className="mb-5 select-none">
                    <label htmlFor="name" className="block mb-2 font-medium">Название гильдии</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                    />
                </div>
                <div className="mb-5 select-none">
                    <label htmlFor="url" className="block mb-2 font-medium">Введите краткую ссылку на гильдию</label>
                    <input
                        type="text"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                    />
                </div>
                <div className="mb-5 select-none">
                    <label htmlFor="info" className="block mb-2 font-medium">Введите слоган вашей гильдии</label>
                    <input
                        type="text"
                        id="info"
                        value={info}
                        onChange={(e) => setInfo(e.target.value)}
                        className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                    />
                </div>
                <div className="mb-5 select-none">
                    <label htmlFor="description" className="block mb-2 font-medium">Введите полное описание
                        гильдии</label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                    />
                </div>
                <div>
                    <button type="submit"
                            disabled={isLoading}
                            className="select-none text-white bg-[#F38F54] hover:bg-orange-400 focus:ring-4 focus:outline-hidden focus:ring-orange-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center flex items-center gap-1">{isLoading ? <>
                        <LucideLoader className="mr-2 animate-spin"/><p>Создаю гильдию</p></> : 'Создать гильдию'}</button>
                    {error && <p className="text-red-400 mt-1 mb-5">{error}</p>}
                </div>
            </form>
        </div>
    );
}