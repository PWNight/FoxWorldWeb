export default function MeSettingsSkelet(){
    return (
        <div className="grid xl:grid-cols-[.7fr_1fr] lg:grid-cols-[1fr_1fr] gap-2 animate-pulse">
            <div className="flex flex-col gap-2">
                <div className="bg-neutral-100 rounded-sm p-4 flex justify-center flex-col dark:bg-neutral-800">
                    <div className="border-b h-8 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div>
                    <div className="flex flex-col my-2">
                        <form className="flex flex-col gap-2" onSubmit={() => {}}> {/* Empty onSubmit */}
                            <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for input */}
                            <div className="h-5 w-24 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for button */}
                        </form>
                        <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded-sm mt-1"></div> {/* Placeholder for message */}
                    </div>
                </div>
                <div className="bg-neutral-100 rounded-sm p-4 flex justify-center flex-col dark:bg-neutral-800">
                    <div className="border-b h-8 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div>
                    <div className="flex flex-col my-2">
                        <form className="flex flex-col gap-2" onSubmit={() => {}}> {/* Empty onSubmit */}
                            <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for input */}
                            <div className="h-5 w-24 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div> {/* Placeholder for button */}
                        </form>
                        <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded-sm mt-1"></div> {/* Placeholder for message */}
                        <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded-sm mt-2"></div> {/* Placeholder for link */}
                    </div>
                </div>
            </div>
            <div className="">
                <div className="bg-neutral-100 rounded-sm p-4 max-h-fit flex justify-center flex-col dark:bg-neutral-800"> {/* Placeholder for InDev */}
                    <div className="border-b h-16 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div>
                    <div className="my-2 h-32 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div>
                </div>
            </div>
        </div>
    )
}