"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {NavMe} from "@/components/navbar_me";
import Image from "next/image";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {LucideLoader, SearchX} from "lucide-react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';

export default function MeGuilds() {
    const [pageLoaded, setPageLoaded] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const [userData, setUserData] = useState(Object)
    const [userGuilds, setUserGuilds] = useState(Object)

    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [info, setInfo] = useState('');
    const [description, setDescription] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('')

    const router = useRouter()

    useEffect(()=>{
        async function getSession(){
            const response = await fetch("/api/v1/users/me",{
                method: "GET"
            })
            if(!response.ok){
                // TODO: Implement error handler
                console.log(response)
                return
            }

            const json = await response.json()
            if (!json.success) {
                router.push('/login')
            }else{
                setUserData(json)
                await getGuilds(json)
            }
        }
        getSession()
    },[router])

    async function getGuilds(data:any){
        const session_token = data.token
        const response = await fetch("/api/v1/guilds/me",{
            method: "POST",
            body: JSON.stringify({session_token}),
        })
        if(!response.ok){
            // TODO: Implement error handler
            console.log(response)
            return
        }

        const json = await response.json()
        if (!json.success) {
            console.log(json.message)
        }else{
            setUserGuilds(json.data)
            console.log(json.data)
        }
        setPageLoaded(true)
    }

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
                setCreateModalOpen(false)
                alert("Гильдия успешно создана")
                getGuilds(userData)
                // return message
            }else{
                setIsLoading(false);
                setError(json.message)
            }
        }
    };

    const GuildsBlock = () => {
        if (pageLoaded) {
            if (userGuilds.length != 0) {
                return (
                    <div className='grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 sm:gap-8 gap-4'>
                        {userGuilds.map(function (guild:any) {
                            return (
                                <div key={guild.url} id={guild.url}
                                     className='flex flex-col justify-between gap-2 items-start border-2 rounded-md py-5 px-3 bg-accent hover:border-[#F38F54] transition-all'>
                                    <div className='flex flex-col gap-2'>
                                        <div className="flex flex-row gap-1 items-center">
                                            <Image
                                                src={"https://cravatar.eu/helmavatar/" + guild.owner_nickname + "/25.png"}
                                                alt={guild.owner_nickname}
                                                width={25}
                                                height={25}
                                                quality={100}
                                            />
                                            <h1>{guild.owner_nickname}</h1>
                                        </div>
                                        <h1 className='text-3xl'>{guild.name}</h1>
                                        <p>{guild.description}</p>
                                        <ul className="list-inside list-disc">
                                            {guild.is_recruit ? (
                                                <li>Принимает заявки</li>
                                            ) : (
                                                <li>Не принимает заявки</li>
                                            )}
                                            {guild.discord_code && (
                                                <li>Есть Discord сервер</li>
                                            )}
                                            <li>Создана {new Date(guild.create_date).toLocaleString("ru-RU")}</li>
                                            <li>Вы состоите в гильдии
                                                с {new Date(guild.member_since).toLocaleString("ru-RU")}</li>
                                        </ul>
                                    </div>
                                    <div className='flex flex-row gap-5'>
                                        <Link href={'/guilds/' + guild.url}
                                        className={buttonVariants({
                                            variant: "accent",
                                            className: "px-2",
                                            size: "sm",
                                        })}>Открыть страницу
                                        </Link>
                                        {guild.permission == 2 && (
                                            <button
                                              className={buttonVariants({
                                                variant: "accent",
                                                className: "px-2",
                                                size: "sm",
                                              })}>Редактировать
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
            }else{
                return (
                    <div className='bg-neutral-100 rounded-sm p-4 dark:bg-neutral-800 w-fit flex flex-col h-fit justify-between gap-2'>
                        <div>
                            <SearchX className='h-20 w-20'/>
                            <h1 className='text-3xl'>Гильдии не найдены</h1>
                            <p>Попробуйте вступить в одну из гильдий или создайте собственную</p>
                        </div>
                        <div className='flex flex-row gap-2 mt-6'>
                            <Link href='/guilds' className={buttonVariants({size: 'sm', variant: 'accent'})}>Найти гильдию</Link>
                            <div>
                                <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                                    <DialogContent>
                                        <DialogTitle className='px-5 text-2xl'>Создание гильдии</DialogTitle>
                                        <DialogDescription className='px-5'>Заполните форму и начните принимать новых игроков в свою гильдию</DialogDescription>
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
                                                        className="select-none text-white bg-orange-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center flex items-center gap-1">{isLoading ? <><LucideLoader/><p>Создаю гильдию</p></> : 'Создать гильдию'}</button>
                                                {error && <p className="text-red-400 mt-1 mb-5">{error}</p>}
                                            </div>
                                        </form>
                                    </DialogContent>
                                    <DialogTrigger className={buttonVariants({size: 'sm', variant: 'accent'})}>
                                        Создать гильдию
                                    </DialogTrigger>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                )
            }
        }else{
            return (
                <div className="animate-pulse flex flex-col justify-between gap-2 items-start border-2 rounded-md py-5 px-3 bg-neutral-100 w-fit">
                    <div className="flex flex-col gap-2 w-full"> {/* Добавил w-full для растягивания скелета */}
                        <div className="flex flex-row gap-1 items-center w-full">
                            <div className="rounded-full bg-gray-300 w-6 h-6"></div> {/* Скелет аватара */}
                            <div className="bg-gray-300 h-4 w-20 rounded"></div> {/* Скелет имени */}
                        </div>
                        <div className="bg-gray-300 h-8 w-56 rounded"></div> {/* Скелет названия гильдии */}
                        <div className="bg-gray-300 h-6 w-64 rounded"></div> {/* Скелет описания */}
                        <ul className="list-inside w-full list-none">
                            <li className="bg-gray-300 h-4 w-32 rounded my-1"></li> {/* Скелет пункта списка */}
                            <li className="bg-gray-300 h-4 w-24 rounded my-1"></li> {/* Скелет пункта списка */}
                            <li className="bg-gray-300 h-4 w-40 rounded my-1"></li> {/* Скелет пункта списка */}
                            <li className="bg-gray-300 h-4 w-48 rounded my-1"></li> {/* Скелет пункта списка */}
                        </ul>
                    </div>
                    <div className="flex flex-row gap-5 w-full justify-between"> {/* Расположение кнопок справа */}
                        <div className="bg-gray-300 h-8 w-24 rounded"></div> {/* Скелет кнопки */}
                        <div className="bg-gray-300 h-8 w-24 rounded"></div> {/* Скелет кнопки */}
                    </div>
                </div>
            )
        }
    }
    return (
        <div className="grid sm:grid-cols-[300px,1fr] gap-6 mt-6">
            <NavMe/>
            <GuildsBlock/>
        </div>
    )
}
