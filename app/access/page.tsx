"use client";
import {useActionState, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {Loader2} from "lucide-react";
import {getSession} from "@/app/actions/getDataHandlers";
import {verify_application} from "@/app/actions/actionHandlers";

export default function AccessApplications() {
    const [userData, setUserData] = useState(Object)
    const [state, action, pending] = useActionState(verify_application, undefined);
    const [pageLoaded, setPageLoaded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        getSession().then(async(user_r) => {
            if ( !user_r.success ){
                router.push('/login?to=access')
                return
            }
            if ( user_r.data.profile.hasAccess ){
                router.push('/me')
                return
            }

            setUserData(user_r.data);
            setPageLoaded(true);
        })
    }, [router]);

    if ( pageLoaded ) {
        return (
            <div className="flex items-center flex-col justify-center w-full h-full">
                <form className="text-sm w-auto mx-auto bg-neutral-100 dark:bg-neutral-800 rounded-xl p-10 text-gray-900 dark:text-gray-100" action={action}>
                    <h1 className="text-3xl sm:text-4xl mb-5 select-none">Верификация</h1>
                    <div className="mb-5 select-none">
                        <label htmlFor="nickname" className="block mb-2 font-medium">Ваш никнейм</label>
                        <input
                            type="text"
                            id="nickname"
                            name="nickname"
                            value={userData.profile.nick}
                            readOnly={true}
                            className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                        />
                        <p>Не ваш никнейм? Обратитесь в <Link href={'mailto:support@foxworld.ru'}>службу поддержки</Link></p>
                        {state?.errors?.nickname && <p className="text-red-400 mt-1 mb-5">{state.errors.nickname}</p>}
                    </div>
                    <div className="mb-5 select-none">
                        <label htmlFor="age" className="block mb-2 font-medium">Ваш возраст</label>
                        <input
                            id="age"
                            type="number"
                            name="age"
                            className="mb-1 bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                        />
                        {state?.errors?.age && <p className="text-red-400 mt-1 mb-5">{state.errors.age}</p>}
                    </div>
                    <div className="mb-5 select-none">
                        <label htmlFor="about" className="block mb-2 font-medium">Расскажите немного о вас</label>
                        <textarea
                            id="about"
                            name="about"
                            placeholder={'Чем увлекаетесь, что умеете'}
                            className="mb-1 bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                        />
                        {state?.errors?.about && <p className="text-red-400 mt-1 mb-5">{state.errors.about}</p>}
                    </div>
                    <div className="mb-5 select-none">
                        <label htmlFor="where_find" className="block mb-2 font-medium">Откуда узнали о проекте?</label>
                        <input
                            id="where_find"
                            type="text"
                            name="where_find"
                            placeholder={'На мониторинге, в ТГ и т.п.'}
                            className="mb-1 bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                        />
                        {state?.errors?.where_find && <p className="text-red-400 mt-1 mb-5">{state.errors.where_find}</p>}
                    </div>
                    <div className="mb-5 select-none">
                        <label htmlFor="plans" className="block mb-2 font-medium">Чем планируете заняться на сервере?</label>
                        <textarea
                            id="plans"
                            name="plans"
                            placeholder={'Вступлю в гильдию, стану президентом и т.п.'}
                            className="mb-1 bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                        />
                        {state?.errors?.plans && <p className="text-red-400 mt-1 mb-5">{state.errors.plans}</p>}
                    </div>
                    <div>
                        <button type="submit"
                                className="select-none text-white bg-[#F38F54] hover:bg-orange-500 focus:ring-4 focus:outline-hidden focus:ring-orange-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center flex items-center gap-1" disabled={pending}>{pending ? <><Loader2 className="mr-2 animate-spin"/><p>Выполняю..</p></> : 'Отправить заявку'}
                        </button>
                        {state?.message && <p className="text-red-400 mt-1 mb-5">{state.message}</p>}
                    </div>
                </form>
            </div>
        )
    }
}