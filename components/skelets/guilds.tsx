export function GuildEditSkelet() {
    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Редактирование гильдии</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg">
                    <div className="h-6 w-1/2 bg-gray-200 dark:bg-neutral-700 rounded mb-4"></div>
                    <div className="space-y-4">
                        <div className="h-10 w-full bg-gray-200 dark:bg-neutral-700 rounded"></div>
                        <div className="h-10 w-full bg-gray-200 dark:bg-neutral-700 rounded"></div>
                        <div className="h-10 w-full bg-gray-200 dark:bg-neutral-700 rounded"></div>
                        <div className="h-20 w-full bg-gray-200 dark:bg-neutral-700 rounded"></div>
                        <div className="h-10 w-1/3 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                    </div>
                </div>
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg">
                    <div className="h-6 w-1/2 bg-gray-200 dark:bg-neutral-700 rounded mb-4"></div>
                    <div className="space-y-4">
                        <div className="h-10 w-full bg-gray-200 dark:bg-neutral-700 rounded"></div>
                        <div className="h-10 w-full bg-gray-200 dark:bg-neutral-700 rounded"></div>
                        <div className="h-10 w-1/3 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function GuildSkeleton() {
    return (
        <div
            className="flex flex-col justify-between gap-4 items-start border-2 rounded-lg py-6 px-4
       dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 bg-white w-full animate-pulse"
        >
            <div className="flex flex-col gap-3 w-full">
                {/* Аватар и ник владельца */}
                <div className="flex flex-row gap-2 items-center">
                    <div className="flex gap-1 items-center">
                        <div className="w-10 h-10 bg-gray-300 dark:bg-neutral-700 rounded"></div>
                        <div className="w-24 h-5 bg-gray-300 dark:bg-neutral-700 rounded"></div>
                    </div>
                </div>

                {/* Название, описание и информация */}
                <div className="grid grid-cols-[1fr_.3fr] gap-3">
                    <div className="space-y-2">
                        <div className="w-3/4 h-7 bg-gray-300 dark:bg-neutral-700 rounded"></div>
                        <div className="w-full h-4 bg-gray-300 dark:bg-neutral-700 rounded"></div>
                        <div className="w-5/6 h-4 bg-gray-300 dark:bg-neutral-700 rounded"></div>
                        <ul className="text-sm space-y-1">
                            <li>
                                <div className="w-32 h-4 bg-gray-300 dark:bg-neutral-700 rounded"></div>
                            </li>
                            <li>
                                <div className="w-28 h-4 bg-gray-300 dark:bg-neutral-700 rounded"></div>
                            </li>
                            <li>
                                <div className="w-36 h-4 bg-gray-300 dark:bg-neutral-700 rounded"></div>
                            </li>
                            <li>
                                <div className="w-24 h-4 bg-gray-300 dark:bg-neutral-700 rounded"></div>
                            </li>
                        </ul>
                    </div>
                    {/* Эмблема */}
                    <div className="w-[100px] h-[100px] bg-gray-300 dark:bg-neutral-700 rounded-lg"></div>
                </div>
            </div>

            {/* Кнопка */}
            <div className="flex sm:flex-row flex-col w-full gap-3 mt-4">
                <div className="w-full sm:w-32 h-9 bg-gray-300 dark:bg-neutral-700 rounded-lg"></div>
            </div>
        </div>
    );
}