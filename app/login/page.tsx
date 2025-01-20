"use client"
import {LucideLoader, UserPlusIcon} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from"react";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('')

    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const [showPassword, setShowPassword] = useState(false); // Состояние для видимости пароля

    const router = useRouter();

    useEffect(() => {
        async function getSession() {
            const response = await fetch("/api/v1/users/me", {
                method:"GET"
            });
            if (response.ok) {
                const json = await response.json();
                if (json.success) {
                    router.push('/me');
                }
            }
        }
        getSession();
    }, [router]);

    const handleSubmit = async(e: any) => {
        e.preventDefault();

        setIsLoading(true);

        // Получение инпутов
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
    
        // Сброс ошибок
        setUsernameError('');
        setPasswordError('');
        setError('')
        let hasError = false;
    
        // Валидация никнейма и пароля
        if ('' === username) {
            setUsernameError('Введите логин');
            setIsLoading(false);
            hasError = true;
        }
        if ('' === password) {
            setPasswordError('Введите пароль');
            setIsLoading(false);
            hasError = true;
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
            const result = await fetch('/api/v1/auth/login',{
                method: 'POST',
                body: JSON.stringify({username,password})
            })
            if(result.ok){
                const json : any = await result.json()
                const uuid = json.data.uuid
                const last_nickname = json.data.last_nickname
                const response = await fetch('/api/v1/auth/create-session',{
                    method: 'POST',
                    body: JSON.stringify({uuid,last_nickname})
                })
                if(response.ok){
                    router.push('/me')
                }
            }else{
                setIsLoading(false);
                setError('Неверный никнейм или пароль')
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex sm:min-h-[91vh] min-h-[88vh] flex-col justify-center items-start sm:px-2 py-8 gap-10 w-full">
            <form className="text-sm w-auto mx-auto bg-neutral-100 dark:bg-neutral-800 rounded-xl px-5 py-20 text-gray-900 dark:text-gray-100" onSubmit={handleSubmit}>
                <h1 className="text-3xl sm:text-4xl mb-5 select-none">Авторизация</h1>
                <div className="mb-5 select-none">
                    <label htmlFor="username" className="block mb-2 font-medium">Ваш никнейм</label>
                    <input
                        type="text"
                        autoComplete="username"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                        placeholder="OlegMongol4566"
                    />
                    {usernameError && <p className="text-red-400 mt-1 mb-5">{usernameError}</p>}
                </div>
                <div className="mb-5 select-none">
                    <label htmlFor="password" className="block mb-2 font-medium">Ваш пароль</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-1 bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                        placeholder="SuperSecret4566"
                    />
                    {passwordError && <p className="text-red-400 mt-1 mb-5">{passwordError}</p>}
                    <label><input id="show-password" type="checkbox" className="password-checkbox" onChange={()=>togglePasswordVisibility()}/> Показать пароль</label><br/>
                    <Link href='https://t.me/rodiongoshev' className="text-orange-400 hover:text-orange-500">Забыли
                        пароль?</Link>
                </div>
                <div>
                    <button type="submit"
                            className="select-none text-white bg-orange-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center flex items-center gap-1">{isLoading ? <><LucideLoader/><p>Выполняю вход</p></> : 'Войти'}</button>
                    {error && <p className="text-red-400 mt-1 mb-5">{error}</p>}
                </div>
                <div className="flex items-center gap-2 mt-4">
                    <p>Впервые здесь?</p>
                    <Link href='/wiki/introduction/start-game' className="text-orange-400 hover:text-orange-500 flex gap-2 items-center">Создайте аккаунт на сервере<UserPlusIcon/></Link>
                </div>
            </form>
        </div>
    );
}