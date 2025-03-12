"use client"
import { LucideLoader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession } from "@/app/actions/getInfo";

export default function CreateGuild() {
    const [userData, setUserData] = useState(Object);
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [info, setInfo] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();

    const LIMITS = {
        name: 255,
        description: 500,
        info: 500
    };

    const URL_REGEX = /^[a-z0-9-_]+$/;

    useEffect(() => {
        getSession().then(async r => {
            if (!r.success) {
                router.push("/login");
                return;
            }
            setUserData(r.data);
        });
    }, [router]);

    const handleSubmit = async(e:any) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        let hasError = false;

        if (!name) {
            setError('Введите название гильдии');
            hasError = true;
        } else if (name.length > LIMITS.name) {
            setError(`Название гильдии превышает лимит в ${LIMITS.name} символов`);
            hasError = true;
        }

        if (!url) {
            setError('Введите ссылку на гильдию');
            hasError = true;
        } else if (!URL_REGEX.test(url)) {
            setError('Ссылка может содержать только буквы, цифры, дефис (-) и подчеркивание (_)');
            hasError = true;
        }

        if (!info) {
            setError('Введите слоган гильдии');
            hasError = true;
        } else if (info.length > LIMITS.info) {
            setError(`Слоган превышает лимит в ${LIMITS.info} символов`);
            hasError = true;
        }

        if (!description) {
            setError('Введите описание гильдии');
            hasError = true;
        } else if (description.length > LIMITS.description) {
            setError(`Описание превышает лимит в ${LIMITS.description} символов`);
            hasError = true;
        }

        if (hasError) {
            setIsLoading(false);
            return;
        }

        const token = userData.token;
        const result = await fetch('/api/v1/guilds', {
            method: 'POST',
            headers: {"Authorization": `Bearer ${token}`},
            body: JSON.stringify({name, url, info, description}),
        });

        if (!result.ok) {
            const errorData = await result.json();
            setError(errorData.message);
            setIsLoading(false);
            return;
        }

        const response = await fetch('/api/v1/notifications', {
            method: 'POST',
            headers: {"Authorization": `Bearer ${token}`},
            body: JSON.stringify({
                userId: userData.profile.id,
                message: "Ваша гильдия успешно создана! Теперь вы можете приступить к приёму игроков."
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            setError(errorData.message);
            setIsLoading(false);
            return;
        }

        router.push('/me/guilds');
    };

    return (
        <div className="flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="bg-neutral-100 dark:bg-neutral-800 shadow-lg rounded-xl p-6 space-y-6 text-gray-900 dark:text-gray-100">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">
                            Создание гильдии
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Заполните форму для создания новой гильдии
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Название */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1">
                                Название гильдии
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#F38F54] focus:border-[#F38F54]"
                                maxLength={LIMITS.name}
                                placeholder="Введите название"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Осталось: {LIMITS.name - name.length}
                            </p>
                        </div>

                        {/* URL */}
                        <div>
                            <label htmlFor="url" className="block text-sm font-medium mb-1">
                                Ссылка на гильдию
                            </label>
                            <input
                                type="text"
                                id="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#F38F54] focus:border-[#F38F54]"
                                placeholder="например: foxcorp"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Только буквы, цифры, - и _
                            </p>
                        </div>

                        {/* Слоган */}
                        <div>
                            <label htmlFor="info" className="block text-sm font-medium mb-1">
                                Слоган гильдии
                            </label>
                            <input
                                type="text"
                                id="info"
                                value={info}
                                onChange={(e) => setInfo(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#F38F54] focus:border-[#F38F54]"
                                maxLength={LIMITS.info}
                                placeholder="Краткий слоган"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Осталось: {LIMITS.info - info.length}
                            </p>
                        </div>

                        {/* Описание */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium mb-1">
                                Описание гильдии
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#F38F54] focus:border-[#F38F54] min-h-[100px]"
                                maxLength={LIMITS.description}
                                placeholder="Подробное описание"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Осталось: {LIMITS.description - description.length}
                            </p>
                        </div>
                    </div>

                    {/* Кнопка и ошибка */}
                    <div className="space-y-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#F38F54] hover:bg-orange-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center disabled:bg-orange-300"
                        >
                            {isLoading ? (
                                <>
                                    <LucideLoader className="w-5 h-5 mr-2 animate-spin" />
                                    Создание...
                                </>
                            ) : (
                                'Создать гильдию'
                            )}
                        </button>
                        {error && (
                            <p className="text-sm text-red-400 text-center">{error}</p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}