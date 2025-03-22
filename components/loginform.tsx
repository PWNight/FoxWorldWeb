"use client";

import { Loader2, UserPlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { signup } from "@/app/actions/applications";

export function LoginForm() {
    const [state, action, pending] = useActionState(signup, undefined);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("to") || "/me";

    useEffect(() => {
        if (state?.success) {
            const target = state.redirectTo || redirectTo;
            router.push(target);
        }
    }, [state, router, redirectTo]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex items-center flex-col justify-center w-full h-full">
            <form
                className="text-sm w-auto mx-auto bg-neutral-100 dark:bg-neutral-800 rounded-xl p-10 text-gray-900 dark:text-gray-100"
                action={action}
            >
                <h1 className="text-3xl sm:text-4xl mb-5 select-none">Авторизация</h1>
                <div className="mb-5 select-none">
                    <label htmlFor="username" className="block mb-2 font-medium">
                        Ваш никнейм
                    </label>
                    <input
                        type="text"
                        autoComplete="username"
                        id="username"
                        name="username"
                        className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-orange-300 dark:focus:border-orange-400"
                        placeholder="OlegMongol4566"
                    />
                    {state?.errors?.username && (
                        <p className="text-red-400 mt-1 mb-5">{state.errors.username}</p>
                    )}
                </div>
                <div className="mb-5 select-none">
                    <label htmlFor="password" className="block mb-2 font-medium">
                        Ваш пароль
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        id="password"
                        name="password"
                        className="mb-1 bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-orange-300 dark:focus:border-orange-400"
                        placeholder="SuperSecret4566"
                    />
                    {state?.errors?.password && (
                        <p className="text-red-400 mt-1 mb-5">{state.errors.password}</p>
                    )}
                    <label>
                        <input
                            id="show-password"
                            type="checkbox"
                            className="password-checkbox"
                            onChange={() => togglePasswordVisibility()}
                        />{" "}
                        Показать пароль
                    </label>
                    <br />
                    <Link
                        href="https://t.me/pwnight"
                        className="text-orange-400 hover:text-orange-500"
                    >
                        Забыли пароль?
                    </Link>
                </div>
                <input type="hidden" name="redirectTo" value={redirectTo} />
                <div>
                    <button
                        type="submit"
                        className="select-none text-white bg-[#F38F54] hover:bg-orange-500 focus:ring-4 focus:outline-hidden focus:ring-orange-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center flex items-center gap-1"
                        disabled={pending}
                    >
                        {pending ? (
                            <>
                                <Loader2 className="mr-2 animate-spin" />
                                <p>Выполняю вход</p>
                            </>
                        ) : (
                            "Войти"
                        )}
                    </button>
                    {state?.message && (
                        <p className="text-red-400 mt-1 mb-5">{state.message}</p>
                    )}
                </div>
                <div className="flex items-center gap-2 mt-4">
                    <p>Впервые здесь?</p>
                    <Link
                        href="/wiki/introduction/start-game"
                        className="text-orange-400 hover:text-orange-500 flex gap-2 items-center"
                    >
                        Создайте аккаунт на сервере
                        <UserPlusIcon />
                    </Link>
                </div>
            </form>
        </div>
    );
}