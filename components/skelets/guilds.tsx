export default function GuildSkeleton() {
    return (
        <div
            className="flex flex-col justify-between gap-4 items-start border-2 rounded-lg py-6 px-4
      dark:bg-zinc-800 dark:border-zinc-700 bg-white border-zinc-200 w-full animate-pulse"
        >
            <div className="flex flex-col gap-3 w-full">
                {/* Аватар и ник владельца */}
                <div className="flex flex-row gap-2 items-center">
                    <div className="flex gap-1 items-center">
                        <div className="w-10 h-10 bg-gray-300 dark:bg-zinc-600 rounded"></div>
                        <div className="w-24 h-5 bg-gray-300 dark:bg-zinc-600 rounded"></div>
                    </div>
                </div>

                {/* Название, описание и информация */}
                <div className="grid grid-cols-[1fr_.3fr] gap-3">
                    <div className="space-y-2">
                        <div className="w-3/4 h-7 bg-gray-300 dark:bg-zinc-600 rounded"></div>
                        <div className="w-full h-4 bg-gray-300 dark:bg-zinc-600 rounded"></div>
                        <div className="w-5/6 h-4 bg-gray-300 dark:bg-zinc-600 rounded"></div>
                        <ul className="text-sm space-y-1">
                            <li>
                                <div className="w-32 h-4 bg-gray-300 dark:bg-zinc-600 rounded"></div>
                            </li>
                            <li>
                                <div className="w-28 h-4 bg-gray-300 dark:bg-zinc-600 rounded"></div>
                            </li>
                            <li>
                                <div className="w-36 h-4 bg-gray-300 dark:bg-zinc-600 rounded"></div>
                            </li>
                            <li>
                                <div className="w-24 h-4 bg-gray-300 dark:bg-zinc-600 rounded"></div>
                            </li>
                        </ul>
                    </div>
                    {/* Эмблема */}
                    <div className="w-[100px] h-[100px] bg-gray-300 dark:bg-zinc-600 rounded-lg"></div>
                </div>
            </div>

            {/* Кнопка */}
            <div className="flex sm:flex-row flex-col w-full gap-3 mt-4">
                <div className="w-full sm:w-32 h-9 bg-gray-300 dark:bg-zinc-600 rounded-lg"></div>
            </div>
        </div>
    );
}