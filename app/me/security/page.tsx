"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {LucideLoader, Pencil} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import InDev from "@/components/indev";
import {getSession} from "@/app/actions/getInfo";
import MeSettingsSkelet from "@/components/skelets/settings_skelet";

export default function MeSecurity() {
    // Объявление хранилищ данных
    const [pageLoaded, setPageLoaded] = useState(false);
    const [userData, setUserData] = useState(Object)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Объявление параметров валидации
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [usernameMessage, setUsernameMessage] = useState('')
    const [passwordMessage, setPasswordMessage] = useState('')

    const router = useRouter()

    useEffect(()=>{
        getSession().then(async r => {
            if ( !r.success ) {
                router.push("/login")
                return
            }
            setUserData(r.data)
            setPageLoaded(true)
        });
    },[router])

    // Обновление классов в зависимости от наличия ошибок
    const updateInputClass = (input: HTMLElement | null, error: boolean) => {
        if (error) {
            input?.classList.replace("border-gray-300", "border-red-400");
            input?.classList.replace("dark:border-gray-600", "dark:border-gray-400");
        } else {
            input?.classList.replace("border-red-400", "border-gray-300");
            input?.classList.replace("dark:border-gray-400", "dark:border-gray-600");
        }
    };

    const handleSubmitUsername = async(e: any) => {
        e.preventDefault();
        setIsLoading(true);
        setUsernameMessage('');
        setHasError(false);

        // Получение инпутов
        const usernameInput = document.getElementById('username');
        updateInputClass(usernameInput, false);

        // Валидация никнейма
        if ('' === username) {
            setHasError(true)
            setUsernameMessage('Введите никнейм');
            updateInputClass(usernameInput, true);
            setIsLoading(false);
            return
        }
        if(username.length < 4){
            setHasError(true)
            setUsernameMessage('Длина никнейма должна быть не менее 4 символов');
            updateInputClass(usernameInput, true);
            setIsLoading(false);
            return
        }

        const session_token = userData.token;
        const result = await fetch('/api/v1/users/me/change-username/',{
            method: 'POST',
            body: JSON.stringify({new_username : username, session_token})
        })
        const json : any = await result.json()
        if(result.ok){
            setUsernameMessage(json.message)
        }else{
            setHasError(true)
            setUsernameMessage(json.message)
        }
        updateInputClass(usernameInput, hasError);
        setIsLoading(false);
    };
    const handleSubmitPassword = async(e: any) => {
        e.preventDefault();
        setIsLoading(true);
        setPasswordMessage('');
        setHasError(false);

        // Получение инпутов
        const passwordInput = document.getElementById('password');
        updateInputClass(passwordInput, false);

        // Валидация пароля
        if ('' === password) {
            setHasError(true)
            setPasswordMessage('Введите никнейм');
            updateInputClass(passwordInput, true);
            setIsLoading(false);
            return
        }
        if(password.length < 8){
            setHasError(true)
            setPasswordMessage('Длина пароля должна быть не менее 8 символов');
            updateInputClass(passwordInput, true);
            setIsLoading(false);
            return
        }

        const session_token = userData.token;
        const result = await fetch('/api/v1/users/me/change-password/',{
            method: 'POST',
            body: JSON.stringify({new_password:password, session_token})
        })
        const json : any = await result.json()
        if(result.ok){
            setPasswordMessage(json.message)
        }else{
            setHasError(true)
            setPasswordMessage(json.message)
        }
        updateInputClass(passwordInput, hasError);
        setIsLoading(false);
    };

    if (!pageLoaded){
        return (
            <MeSettingsSkelet/>
        )
    }else {
        return (
            <div className="grid xl:grid-cols-[.7fr,1fr] lg:grid-cols-[1fr,1fr] gap-2">
                <div className="flex flex-col gap-2">
                    <div
                        className="bg-neutral-100 rounded-sm p-4 max-h-fit flex justify-center flex-col dark:bg-neutral-800">
                        <div className="border-b">
                            <h1 className="text-2xl">Изменение никнейма</h1>
                        </div>
                        <div className="flex flex-col my-2">
                            <Link href='/wiki/rules' className="text-orange-400 hover:text-orange-500 transition-all"><p className="text-muted-foreground">Устанавливаемый никнейм не должен нарушать</p>правила сервера</Link>
                            <form className="flex 2xl:flex-row flex-col gap-2 2xl:items-center" onSubmit={handleSubmitUsername}>
                                <input
                                    type="text"
                                    className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                                    placeholder="Введите никнейм"
                                    autoComplete="username"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <Button variant="accent" className="flex gap-1" disabled={isLoading}>{isLoading ? <><LucideLoader/><p>Подождите</p></> : <><Pencil/>Изменить</>}</Button>
                            </form>
                            {hasError ? (
                                <p className="text-red-400 mt-1">{usernameMessage}</p>
                            ) : (
                                <p className="text-green-500 mt-1">{usernameMessage}</p>
                            )}
                        </div>
                    </div>
                    <div className="bg-neutral-100 rounded-sm p-4 max-h-fit flex justify-center flex-col dark:bg-neutral-800">
                        <div className="border-b">
                            <h1 className="text-2xl">Изменение пароля</h1>
                        </div>
                        <div className="flex flex-col my-2">
                            <form className="flex 2xl:flex-row flex-col gap-2 2xl:items-center" onSubmit={handleSubmitPassword}>
                                <input
                                    type="text"
                                    className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                                    placeholder="Введите новый пароль"
                                    autoComplete="current-password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Button variant="accent" className="flex gap-1" disabled={isLoading}>{isLoading ? <><LucideLoader/><p>Подождите</p></> : <><Pencil/>Изменить</>}</Button>
                            </form>
                            {hasError ? (
                                <p className="text-red-400 mt-1">{passwordMessage}</p>
                            ) : (
                                <p className="text-green-500 mt-1">{passwordMessage}</p>
                            )}
                            <Link href='/'
                                  className="text-orange-400 hover:text-orange-500 transition-all 2xl:flex gap-2">
                                <p className="text-muted-foreground">Забыли пароль?</p>Перейти к восстановлению
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="">
                    <InDev/>
                </div>
            </div>
        )
    }
}
