"use client";
import {useActionState, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {checkGuildAccess, getGuild, getSession} from "@/app/actions/getInfo";
import Link from "next/link";
import {Castle, LucideLoader} from "lucide-react";
import {guild_application} from "@/app/actions/applications";

type PageProps = {
    params: Promise<{ url: string }>;
};

export default function GuildApplication(props: PageProps) {
    const [guild, setGuild] = useState(Object);
    const [state, action, pending] = useActionState(guild_application, undefined);
    const [pageLoaded, setPageLoaded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        getSession().then(async(user_r) => {
            if ( !user_r.success ){
                router.push('/login')
                return
            }

            const params = await props.params;
            const guildUrl = params.url;

            getGuild(guildUrl).then((r) => {
                if ( !r.success ){
                    router.push('/guilds')
                    return
                }
                setGuild(r.data);

                checkGuildAccess(guildUrl, user_r.data).then((r) => {
                    if ( r.success ){
                        router.push("/guilds/" + guildUrl);
                        return
                    }
                    setPageLoaded(true);
                })
            })

        })
    }, [props.params, router]);

    if ( pageLoaded ) {
        return (
            <div className="flex items-center flex-col justify-center w-full h-full">
                <form className="text-sm w-auto mx-auto bg-neutral-100 dark:bg-neutral-800 rounded-xl p-10 text-gray-900 dark:text-gray-100" action={action}>
                    <h1 className="text-3xl sm:text-4xl mb-5 select-none">Заявка в гильдию {guild.name}</h1>
                    <div className="mb-5 select-none">
                        <label htmlFor="about_user" className="block mb-2 font-medium">Расскажите немного о себе</label>
                        <input
                            type="text"
                            id="about_user"
                            name="about_user"
                            className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                        />
                        {state?.errors?.about_user && <p className="text-red-400 mt-1 mb-5">{state.errors.about_user}</p>}
                    </div>
                    <div className="mb-5 select-none">
                        <label htmlFor="why_this_guild" className="block mb-2 font-medium">Почему вы решили вступить в эту гильдию?</label>
                        <input
                            id="why_this_guild"
                            name="why_this_guild"
                            className="mb-1 bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                        />
                        <input type="hidden" name="guildUrl" value={guild.url}/>
                        {state?.errors?.why_this_guild && <p className="text-red-400 mt-1 mb-5">{state.errors.why_this_guild}</p>}
                    </div>
                    <div>
                        <button type="submit"
                                className="select-none text-white bg-[#F38F54] hover:bg-orange-500 focus:ring-4 focus:outline-hidden focus:ring-orange-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center flex items-center gap-1" disabled={pending}>{pending ? <><LucideLoader className="mr-2 animate-spin"/><p>Выполняю..</p></> : 'Отправить заявку'}
                        </button>
                        {state?.message && <p className="text-red-400 mt-1 mb-5">{state.message}</p>}
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <p>Передумали вступать?</p>
                        <Link href='/guilds' className="text-orange-400 hover:text-orange-500 flex gap-2 items-center">Вернитесь к списку гильдий<Castle className='w-4 h-4'/></Link>
                    </div>
                </form>
            </div>
        )
    }
    return (
        <>
            <p>Loading</p>
        </>
    );
}