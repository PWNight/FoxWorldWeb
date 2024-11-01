"use client"
import { LogIn, LucideArrowDownLeftFromSquare, UserPlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from"next/navigation";
import { useEffect, useState } from"react";

export default function Registration() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const router = useRouter();

    useEffect(() => {
        async function getSession() {
            const response = await fetch("/api/v1/users/me", {
                method:"GET"
            });
            if (response.ok) {
                const json = await response.json();
                if (json != null) {
                    router.push('/');
                }
            }
        }
        getSession();
    }, [router]);

    const handleSubmit = (e: any) => {
        e.preventDefault();

        // Получение инпутов
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
    
        // Сброс ошибок
        setUsernameError('');
        setPasswordError('');
        let hasError = false;
    
        // Валидация никнейма и пароля
        if ('' === username) {
            setUsernameError('Введите логин');
            hasError = true;
        }
        if ('' === password) {
            setPasswordError('Введите пароль');
            hasError = true;
        }else{
            if (password.length < 8) {
                setPasswordError('Пароль должен быть не менее 8 символов');
                hasError = true;
            }
            if (!/[a-zA-Z]/.test(password)) {
                setPasswordError('Пароль должен содержать хотя бы одну букву');
                hasError = true;
            }
            if (!/\d/.test(password)) {
                setPasswordError('Пароль должен содержать хотя бы одну цифру');
                hasError = true;
            }
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                setPasswordError('Пароль должен содержать хотя бы один специальный символ');
                hasError = true;
            }
        }
    
        // Обновление классов в зависимости от наличия ошибок
        const updateInputClass = (input: HTMLElement | null, error: string) => {
            if (error) {
                input?.classList.replace("border-gray-300", "border-red-400");
                input?.classList.replace("dark:border-gray-600", "dark:border-gray-400");
            } else {
                input?.classList.replace("border-red-400", "border-gray-300");
                input?.classList.replace("dark:border-gray-400", "dark:border-gray-600");
            }
        };
    
        updateInputClass(usernameInput, usernameError);
        updateInputClass(passwordInput, passwordError);
    
        if (!hasError) {
            // Обращение к API
        }
    };

    return (
        <div className="flex sm:min-h-[91vh] min-h-[88vh] flex-col justify-center items-start sm:px-2 py-8 gap-10 w-full">
            <form className="text-sm w-auto sm:w-1/2 lg:w-1/3 mx-auto bg-neutral-100 dark:bg-gray-700 rounded-xl px-5 py-20 text-gray-900 dark:text-gray-100" onSubmit={handleSubmit}>
                <h1 className="text-3xl sm:text-4xl mb-5 select-none">Регистрация</h1>
                <div className="mb-5 select-none">
                    <label htmlFor="username" className="block mb-2 font-medium">Ваш никнейм</label>
                    <input
                        type="text"
                        autoComplete="username"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                        placeholder="PWNight"
                    />
                    {usernameError && <p className="text-red-400 mt-1 mb-5">{usernameError}</p>}
                </div>
                <div className="mb-5 select-none">
                    <label htmlFor="password" className="block mb-2 font-medium">Ваш пароль</label>
                    <input
                        type="password"
                        autoComplete="current-password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-1 bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                    />
                    {passwordError && <p className="text-red-400 mt-1 mb-5">{passwordError}</p>}
                    <Link href='https://t.me/rodiongoshev' className="text-orange-400 hover:text-orange-500">Забыли пароль?</Link>
                </div>
                <button type="submit" className="select-none text-white bg-orange-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm w-full sm:w-full px-5 py-2.5 text-center">Зарегистрироваться</button>
                <div className="flex items-center gap-2 mt-4">
                    <p>Уже есть аккаунт?</p>
                    <Link href='/login' className="text-orange-400 hover:text-orange-500 flex gap-2 items-center">Войдите<LogIn/></Link>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <p>Утеряли доступ к аккаунту?</p>
                    <Link href='/recover-account' className="text-orange-400 hover:text-orange-500 flex gap-2 items-center">Восстановить аккаунт<LucideArrowDownLeftFromSquare/></Link>
                </div>
            </form>
        </div>
    );
}