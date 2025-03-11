export default function MeSkelet() {
    return (
        <div className="grid xl:grid-cols-[.7fr_1fr] gap-6 animate-pulse">
            {/* Левая колонка */}
            <div className="flex flex-col gap-6">
                {/* Информация об аккаунте */}
                <div className="bg-neutral-100 rounded-lg p-6 shadow-sm dark:bg-neutral-800">
                    <div className="h-7 w-48 bg-neutral-200 dark:bg-neutral-700 rounded mb-3 border-b border-neutral-200 dark:border-neutral-700 pb-3"></div>
                    <div className="mt-4 space-y-3">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="flex justify-between items-center">
                                <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                                <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Пустой блок */}
                <div className="bg-neutral-100 rounded-lg shadow-sm dark:bg-neutral-800 w-full h-40 flex items-center justify-center">
                    <div className="h-4 w-40 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                </div>
            </div>

            {/* Правая колонка */}
            <MeStatisticSkelet />
        </div>
    )
}
export function MeStatisticSkelet() {
    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Статистика активности */}
                <div className="bg-neutral-100 rounded-lg p-6 shadow-sm dark:bg-neutral-800">
                    <div className="h-6 w-40 bg-neutral-200 dark:bg-neutral-700 rounded mb-4 border-b border-neutral-200 dark:border-neutral-700 pb-2"></div>
                    <div className="space-y-6">
                        {[1, 2].map((section) => (
                            <div key={section}>
                                <div className="h-4 w-28 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
                                <div className="space-y-4">
                                    {[1, 2].map((subsection) => (
                                        <div key={subsection}>
                                            <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
                                            <div className="space-y-2">
                                                {[1, 2, 3].map((item) => (
                                                    <div key={item} className="h-3 w-36 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Статистика убийств и смертей */}
                <div className="bg-neutral-100 rounded-lg p-6 shadow-sm dark:bg-neutral-800">
                    <div className="h-6 w-48 bg-neutral-200 dark:bg-neutral-700 rounded mb-4 border-b border-neutral-200 dark:border-neutral-700 pb-2"></div>
                    <div className="space-y-6">
                        {[1, 2, 3].map((section) => (
                            <div key={section}>
                                <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
                                <div className="space-y-2">
                                    {[1, 2, 3].map((item) => (
                                        <div key={item} className="h-3 w-28 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}