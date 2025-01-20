export default function GuildSkelet(){
    return (
        <div className="animate-pulse flex flex-col justify-between gap-2 items-start border-2 rounded-md py-5 px-3 bg-neutral-100 dark:bg-neutral-800 w-fit">
            <div className="flex flex-col gap-2 w-full"> {/* Добавил w-full для растягивания скелета */}
                <div className="flex flex-row gap-1 items-center w-full">
                    <div className="rounded-full bg-gray-300 w-6 h-6"></div> {/* Скелет аватара */}
                    <div className="bg-gray-300 h-4 w-20 rounded"></div> {/* Скелет имени */}
                </div>
                <div className="bg-gray-300 h-8 w-56 rounded"></div> {/* Скелет названия гильдии */}
                <div className="bg-gray-300 h-6 w-64 rounded"></div> {/* Скелет описания */}
                <ul className="list-inside w-full list-none">
                    <li className="bg-gray-300 h-4 w-32 rounded my-1"></li> {/* Скелет пункта списка */}
                    <li className="bg-gray-300 h-4 w-24 rounded my-1"></li> {/* Скелет пункта списка */}
                    <li className="bg-gray-300 h-4 w-40 rounded my-1"></li> {/* Скелет пункта списка */}
                    <li className="bg-gray-300 h-4 w-48 rounded my-1"></li> {/* Скелет пункта списка */}
                </ul>
            </div>
            <div className="flex flex-row gap-5 w-full justify-between"> {/* Расположение кнопок справа */}
                <div className="bg-gray-300 h-8 w-24 rounded"></div> {/* Скелет кнопки */}
                <div className="bg-gray-300 h-8 w-24 rounded"></div> {/* Скелет кнопки */}
            </div>
        </div>
    )
}