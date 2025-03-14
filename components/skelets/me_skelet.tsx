export default function MeSkelet() {
    return (
        <div className="grid xl:grid-cols-[.7fr_1fr] gap-6 animate-pulse h-full w-full">
            {/* Левая колонка */}
            <div className="flex flex-col gap-6">
                {/* Информация об аккаунте */}
                <div className="h-full w-full bg-neutral-100 rounded-lg p-6 shadow-sm dark:bg-neutral-800">
                </div>
                {/* Пустой блок */}
                <div className="h-full w-full bg-neutral-100 rounded-lg shadow-sm dark:bg-neutral-800 flex items-center justify-center">
                </div>
            </div>

            {/* Правая колонка */}
            <MeStatisticSkelet />
        </div>
    )
}
export function MeStatisticSkelet() {
    return (
        <div className="grid md:grid-cols-2 gap-6 h-full w-full">
            {/* Статистика активности */}
            <div className="h-full w-full bg-neutral-100 rounded-lg p-6 shadow-sm dark:bg-neutral-800">
            </div>

            {/* Статистика убийств и смертей */}
            <div className="h-full w-full bg-neutral-100 rounded-lg p-6 shadow-sm dark:bg-neutral-800">
            </div>
        </div>
    )
}