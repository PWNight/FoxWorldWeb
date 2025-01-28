export default function MeSkelet(){
    return (
        <div className="grid lg:grid-cols-[.6fr_1fr] gap-2 animate-pulse">
            <div className="flex flex-col gap-2">
                <div className="bg-neutral-100 rounded-sm p-4 flex justify-center flex-col dark:bg-neutral-800">
                    <div className="border-b h-16 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for header */}
                    <div className="my-2">
                        <div className="flex flex-col gap-1">
                            <div className="xl:flex gap-2 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div>
                            <div className="xl:flex gap-2 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div>
                            <div className="xl:flex gap-2 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div>
                            <div className="xl:flex gap-2 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div>
                        </div>
                    </div>
                </div>
                <div className="bg-neutral-100 rounded-sm p-4 max-h-fit flex justify-center flex-col dark:bg-neutral-800">
                    <div className="border-b h-16 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for header */}
                    <div className="flex flex-col gap-4 my-2">
                        <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for link */}
                        <div className="flex 2xl:flex-row flex-col gap-2">
                            <div className="h-10 w-24 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for button */}
                            <div className="h-10 w-24 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for button */}
                        </div>
                    </div>
                </div>
            </div>
            <div className="">
                <div className="bg-neutral-100 rounded-sm p-4 lg:row-span-1 lg:col-span-2 dark:bg-neutral-800">
                    <div className="border-b h-16 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for header */}
                    <div className="my-2">
                        <div className="gap-2 grid 2xl:grid-cols-2">
                            <div>
                                <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for title */}
                                <div className="flex flex-col gap-2 text-sm">
                                    <div className="h-24 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for stats */}
                                    <div className="h-24 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for stats */}
                                    <div className="h-24 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for stats */}
                                </div>
                            </div>
                            <div>
                                <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for title */}
                                <div className="flex flex-col gap-2">
                                    <div className="h-24 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for stats */}
                                    <div className="h-24 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for stats */}
                                    <div className="h-24 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for stats */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function MeStatisticSkelet(){
    return (
            <div className="">
                <div className="bg-neutral-100 rounded-sm p-4 lg:row-span-1 lg:col-span-2 dark:bg-neutral-800">
                    <div className="border-b h-16 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for header */}
                    <div className="my-2">
                        <div className="gap-2 grid 2xl:grid-cols-2">
                            <div>
                                <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for title */}
                                <div className="flex flex-col gap-2 text-sm">
                                    <div className="h-24 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for stats */}
                                    <div className="h-24 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for stats */}
                                    <div className="h-24 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for stats */}
                                </div>
                            </div>
                            <div>
                                <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for title */}
                                <div className="flex flex-col gap-2">
                                    <div className="h-24 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for stats */}
                                    <div className="h-24 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for stats */}
                                    <div className="h-24 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for stats */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}