"use client"
import { LucideArrowDownLeftFromSquare, UserPlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from"next/navigation";
import { useEffect, useState } from"react";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        async function getSession() {
            const response = await fetch("http://localhost:3000/api/v1/users/me", {
                method:"GET"
            });
            if (response.ok) {
                const json = await response.json();
                if (json.data != null) {
                    router.push('/');
                }
            }
        }
        getSession();
    }, [router]);

    const handleSubmit = (e:any) => {
        e.preventDefault();
        // Handle form submission
    };

    return (
        <div className="flex sm:min-h-[91vh] min-h-[88vh] flex-col justify-center items-start sm:px-2 py-8 gap-10 w-full">
            <form className="w-auto sm:w-1/2 lg:w-1/3 mx-auto bg-neutral-100 dark:bg-neutral-300 rounded-sm px-5 py-32 text-gray-900" onSubmit={handleSubmit}>
                <h1 className="text-3xl sm:text-4xl mb-5">Авторизация</h1>
                <div className="mb-5">
                    <label htmlFor="username" className="block mb-2 text-sm font-mediu,">Ваш никнейм</label>
                    <input
                        type="text"
                        autoComplete="username"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                        placeholder="PWNight"
                        required
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium">Ваш пароль</label>
                    <input
                        type="password"
                        autoComplete="current-password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                        required
                    />
                    <Link href='https://t.me/rodiongoshev' className="text-orange-400 hover:text-orange-500 dark:text-orange-900 dark:hover:text-orange-800">Забыли пароль?</Link>
                </div>
                <button type="submit" className="text-white bg-orange-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm w-full sm:w-full px-5 py-2.5 text-center">Войти</button>
                <div className="flex items-center gap-2 mt-4">
                    <p>Впервые здесь?</p>
                    <Link href='/registration' className="text-orange-400 hover:text-orange-500 dark:text-orange-900 dark:hover:text-orange-800 flex gap-2 items-center">Зарегистрируйтесь<UserPlusIcon/></Link>
                </div>
            </form>
        </div>
    );
}