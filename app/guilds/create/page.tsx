"use client"
import {LucideLoader, UserPlusIcon} from "lucide-react";
import Link from "next/link";
import { useRouter } from"next/navigation";
import { useEffect, useState } from"react";

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
        async function getSession() {
            const response = await fetch("/api/v1/users/me", {
                method:"GET"
            });
            if (response.ok) {
                const json = await response.json();
                if (!json.success) {
                    router.push('/login');
                }else{
                    setUserData(json);
                    await getGuilds(json);
                }
            }
        }
        async function getGuilds(json : any){
            const session_token = json.token
            const response = await fetch("/api/v1/guilds/me", {
                method: "POST",
                body: JSON.stringify({session_token})
            });
            if (response.ok) {
                const json = await response.json();
                if (!json.success) {
                    console.log(json.message)
                }else{
                    json.data.map((item:any) => {
                        if(item.permission == 2){
                            router.push('/guilds')
                            return
                        }
                    })
                }
            }
        }
        getSession();
    }, [router]);

    const handleCreateSubmit = async(e: any) => {
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
                alert("Гильдия успешно создана")
                // return message
            }else{
                setIsLoading(false);
                setError(json.message)
            }
        }
    };

    return (
        <div className="flex sm:min-h-[91vh] min-h-[88vh] flex-col justify-center items-start sm:px-2 py-8 gap-10 w-full">
            <form className="text-sm p-5 bg-background rounded-xl text-gray-900 dark:text-gray-100" onSubmit={handleCreateSubmit}>
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
                    <label htmlFor="info" className="block mb-2 font-medium">Введите краткое описание гильдии (отображается вместо полного описания в списке гильдий)</label>
                    <input
                        type="text"
                        id="info"
                        value={info}
                        onChange={(e) => setInfo(e.target.value)}
                        className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                    />
                </div>
                <div className="mb-5 select-none">
                    <label htmlFor="description" className="block mb-2 font-medium">Введите полное описание гильдии</label>
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
                            disabled={isLoading} className="select-none text-white bg-orange-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center flex items-center gap-1">{isLoading ? <><LucideLoader/><p>Создаю гильдию</p></> : 'Создать гильдию'}</button>
                    {error && <p className="text-red-400 mt-1 mb-5">{error}</p>}
                </div>
            </form>
        </div>
    );
}