"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {Pencil} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {NavMe} from "@/components/navbar_me";

export default function MeSecurity() {
    const [userData, setUserData] = useState(Object)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    //const [isLoading, setIsLoading] = useState(false);

    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')

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
                console.log(json)
            }
        }
        getSession()
    },[router])
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

    const handleSubmitNickname = async(e: any) => {
        e.preventDefault();

        //setIsLoading(true);

        // Получение инпутов
        const usernameInput = document.getElementById('username');

        // Сброс ошибок
        setUsernameError('');
        let hasError = false;

        // Валидация никнейма и пароля
        if ('' === username) {
            setUsernameError('Введите никнейм');
            hasError = true;
        }

        updateInputClass(usernameInput, usernameError);

        if (!hasError) {
            const oldNickName = userData.profile.nick;
            const result = await fetch('/api/v1/auth/update-data',{
                method: 'POST',
                body: JSON.stringify({action:'change_nickname',old_value:oldNickName,new_value:username})
            })

            const json : any = await result.json()
            console.log(json)

            if(result.ok){
            }else{
                if(!json.success){
                    setUsernameError(json.message)
                }else{
                    setUsernameError('Произошла неизвестная ошибка')
                }
            }
        }
    };
    const handleSubmitPassword = async(e: any) => {
        e.preventDefault();

        //setIsLoading(true);

        // Получение инпутов
        const usernameInput = document.getElementById('username');

        // Сброс ошибок
        setUsernameError('');
        let hasError = false;

        // Валидация никнейма и пароля
        if ('' === username) {
            setUsernameError('Введите никнейм');
            hasError = true;
        }

        updateInputClass(usernameInput, usernameError);

        if (!hasError) {
            const oldNickName = userData.profile.nick;
            const result = await fetch('/api/v1/auth/update-data',{
                method: 'POST',
                body: JSON.stringify({action:'change_nickname',old_value:oldNickName,new_value:username})
            })
            const json : any = await result.json()
            console.log(json)
            if(result.ok){

            }else{
                setUsernameError('Возникла проблема при смене никнейма')
            }
        }
    };

    if(Object.keys(userData).length != 0){
        return (
            <div className="grid sm:grid-cols-[300px,1fr] gap-6 mt-6">
                <NavMe/>
                <div className="grid lg:grid-cols-[.8fr,1fr] gap-2 ">
                    <div className="flex flex-col gap-2">
                        <div
                            className="bg-neutral-100 rounded-sm p-4 max-h-fit flex justify-center flex-col dark:bg-neutral-800">
                            <div className="border-b">
                                <h1 className="text-2xl">Изменение никнейма</h1>
                            </div>
                            <div className="flex flex-col gap-4 my-2">
                                <Link href='/docs/rules'
                                      className="text-orange-400 hover:text-orange-500 transition-all 2xl:flex gap-2">
                                    <p className="text-muted-foreground">Никнейм не должен нарушать</p>правила сервера
                                </Link>
                                <form className="flex 2xl:flex-row flex-col gap-2 2xl:items-center" onSubmit={handleSubmitNickname}>
                                    <input
                                        type="text"
                                        className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-300 focus:border-orange-400 block w-full p-2.5 dark:bg-neutral-800 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-orange-300 dark:focus:border-orange-400"
                                        placeholder="Введите никнейм"
                                        autoComplete="username"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                    {usernameError && <p className="text-red-400 mt-1 mb-5">{usernameError}</p>}
                                    <Button variant="accent" className="flex gap-1"><Pencil/>Изменить</Button>
                                </form>
                            </div>
                        </div>
                        <div
                            className="bg-neutral-100 rounded-sm p-4 max-h-fit flex justify-center flex-col dark:bg-neutral-800">
                            <div className="border-b">
                                <h1 className="text-2xl">Изменение пароля</h1>
                            </div>
                            <div className="flex flex-col gap-4 my-2">
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
                                    {passwordError && <p className="text-red-400 mt-1 mb-5">{passwordError}</p>}
                                    <Button variant="accent" className="flex gap-1"><Pencil/>Изменить</Button>
                                </form>
                                <Link href='/recover'
                                      className="text-orange-400 hover:text-orange-500 transition-all 2xl:flex gap-2">
                                    <p className="text-muted-foreground">Забыли пароль?</p>Перейти к восстановлению
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="bg-neutral-100 rounded-sm p-4 dark:bg-neutral-800 h-full">
                    </div>
                </div>
            </div>
        )
    }
}
