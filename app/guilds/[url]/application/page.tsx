"use client";
import {useActionState, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {checkGuildAccess, getGuild, getMyGuildsApplications, getSession} from "@/app/actions/getInfo";
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
            const params = await props.params;
            const guildUrl = params.url;

            if ( !user_r.success ){
                router.push(`/login?to=guilds/${guildUrl}/application`);
                return
            }

            getGuild(guildUrl).then((r) => {
                if ( !r.success ){
                    router.push('/guilds')
                    return
                }
                setGuild(r.data);

                checkGuildAccess(guildUrl, user_r.data).then((r) => {
                    if ( r.success ){
                        router.push("/me/guilds/");
                        return
                    }
                    getMyGuildsApplications(user_r.data).then((r)=>{
                        if ( r.data.length > 0 ) {
                            router.push('/me/guilds/');
                            return
                        }
                        setPageLoaded(true);
                    })
                })
            })

        })
    }, [props.params, router]);

    if ( pageLoaded ) {
        return (
            <div className="flex items-center justify-center w-full min-h-screen p-4 sm:p-6">
                <form
                    className="w-full max-w-md mx-auto bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6 sm:p-8 shadow-lg space-y-6 text-gray-900 dark:text-gray-100"
                    action={action}
                >
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 select-none">
                        Заявка в гильдию &#34;{guild.name}&#34;
                    </h1>

                    <div className="space-y-5">
                        {/* О себе */}
                        <div className="space-y-2">
                            <label
                                htmlFor="about_user"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Расскажите немного о себе
                            </label>
                            <input
                                type="text"
                                id="about_user"
                                name="about_user"
                                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-300 dark:border-gray-700 rounded-lg
                        focus:ring-2 focus:ring-orange-300 focus:border-orange-400
                        transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500
                        text-sm sm:text-base"
                                placeholder="Кто вы и чем занимаетесь?"
                            />
                            {state?.errors?.about_user && (
                                <p className="text-red-400 text-xs">{state.errors.about_user}</p>
                            )}
                        </div>

                        {/* Почему эта гильдия */}
                        <div className="space-y-2">
                            <label
                                htmlFor="why_this_guild"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Почему вы решили вступить в эту гильдию?
                            </label>
                            <input
                                id="why_this_guild"
                                name="why_this_guild"
                                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-300 dark:border-gray-700 rounded-lg
                        focus:ring-2 focus:ring-orange-300 focus:border-orange-400
                        transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500
                        text-sm sm:text-base"
                                placeholder="Что вас привлекло?"
                            />
                            <input type="hidden" name="guildUrl" value={guild.url} />
                            {state?.errors?.why_this_guild && (
                                <p className="text-red-400 text-xs">{state.errors.why_this_guild}</p>
                            )}
                        </div>

                        {/* Кнопка отправки */}
                        <button
                            type="submit"
                            disabled={pending}
                            className="w-full bg-[#F38F54] hover:bg-orange-500 text-white font-medium py-2 sm:py-3 px-4 sm:px-5 rounded-lg
                    focus:ring-4 focus:ring-orange-200 dark:focus:ring-orange-800
                    transition-all duration-200 flex items-center justify-center gap-2
                    disabled:bg-orange-300 disabled:cursor-not-allowed text-sm sm:text-base"
                        >
                            {pending ? (
                                <>
                                    <LucideLoader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                    Выполняю...
                                </>
                            ) : (
                                'Отправить заявку'
                            )}
                        </button>

                        {/* Сообщение об ошибке */}
                        {state?.message && (
                            <p className="text-red-400 text-xs sm:text-sm text-center">{state.message}</p>
                        )}
                    </div>

                    {/* Ссылка назад */}
                    <div className="flex flex-col sm:flex-row gap-2 text-xs sm:text-sm">
                        <p className="text-gray-600 dark:text-gray-400">Передумали вступать?</p>
                        <Link
                            href="/guilds"
                            className="text-orange-400 hover:text-orange-500 flex items-center gap-1 transition-colors duration-200"
                        >
                            К списку гильдий
                            <Castle className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Link>
                    </div>
                </form>
            </div>
        )
    }
}