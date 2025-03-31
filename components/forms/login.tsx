"use client";

import { Loader2, UserPlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { signup } from "@/app/actions/actionHandlers";
import { getSession } from "@/app/actions/getDataHandlers";

export function LoginForm() {
    const [state, action, pending] = useActionState(signup, undefined);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("to") || "/me";

    useEffect(() => {
        getSession().then(async (response) => {
            if (response.success) {
                router.push(`/me`);
                return;
            }
        });
        if (state?.success) {
            const target = state.redirectTo || redirectTo;
            router.push(target);
        }
    }, [state, router, redirectTo]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex items-center justify-center w-full h-full">
            <form
                className="w-full max-w-md mx-auto bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg text-gray-900 dark:text-gray-100"
                action={action}
            >
                <h1 className="text-3xl font-bold mb-8 select-none">Авторизация</h1>

                <div className="mb-6">
                    <label htmlFor="username" className="block mb-2 font-medium text-sm">
                        Никнейм
                    </label>
                    <input
                        type="text"
                        autoComplete="username"
                        id="username"
                        name="username"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="OlegMongol4566"
                    />
                    {state?.errors?.username && (
                        <p className="text-red-400 text-sm mt-2">{state.errors.username}</p>
                    )}
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block mb-2 font-medium text-sm">
                        Пароль
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            id="password"
                            name="password"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder="SuperSecret4566"
                        />
                    </div>
                    {state?.errors?.password && (
                        <p className="text-red-400 text-sm mt-2">{state.errors.password}</p>
                    )}
                    <div className="flex justify-between items-center mt-2 text-sm">
                        <label className="flex items-center gap-2 select-none">
                            <input
                                id="show-password"
                                type="checkbox"
                                className="h-4 w-4 text-orange-400 focus:ring-orange-400 border-gray-300 dark:border-neutral-600 rounded"
                                onChange={togglePasswordVisibility}
                            />
                            Показать пароль
                        </label>
                        <Link
                            href="https://t.me/pwnight"
                            className="text-orange-400 hover:text-orange-500 transition-colors"
                        >
                            Забыли пароль?
                        </Link>
                    </div>
                </div>

                <input type="hidden" name="redirectTo" value={redirectTo} />

                <button
                    type="submit"
                    className="w-full bg-[#F38F54] hover:bg-orange-500 text-white font-medium py-3 px-5 rounded-lg focus:ring-4 focus:ring-orange-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg select-none"
                    disabled={pending}
                >
                    {pending ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Вход...
                        </>
                    ) : (
                        "Войти"
                    )}
                </button>

                {state?.message && (
                    <p className="text-red-400 text-sm mt-4">{state.message}</p>
                )}

                <div className="mt-6 text-sm">
                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        Впервые здесь?
                        <Link
                            href="/wiki/introduction/start-game"
                            className="text-orange-400 hover:text-orange-500 flex items-center gap-2 transition-colors"
                        >
                            Создать аккаунт
                            <UserPlusIcon className="h-4 w-4" />
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}