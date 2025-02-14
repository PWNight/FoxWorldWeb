export default function GuildEditSkelet(){
    return (
        <div className="">
            <div className="animate-pulse">
                <h1 className="text-3xl font-bold mb-4 sm:ml-0 ml-4 bg-gray-300 dark:bg-neutral-700 rounded w-64 h-8"></h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:w-fit">
                    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow h-fit">
                        <div className="p-4 border-b border-gray-300 dark:border-gray-700">
                            <h2 className="text-xl font-semibold bg-gray-300 dark:bg-neutral-700 rounded w-32 h-6"></h2>
                        </div>
                        <div className="p-4">
                            <form>
                                <div className="mb-4">
                                    <label
                                        className="block font-medium mb-2 bg-gray-300 dark:bg-neutral-700 rounded w-24 h-4"></label>
                                    <input
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-300 dark:bg-neutral-700 dark:border-gray-600 dark:text-white"
                                        type="text" disabled/>
                                </div>
                                <div className="mb-4">
                                    <label
                                        className="block font-medium mb-2 bg-gray-300 dark:bg-neutral-700 rounded w-24 h-4"></label>
                                    <input
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-300 dark:bg-neutral-700 dark:border-gray-600 dark:text-white"
                                        type="text" disabled/>
                                </div>
                                <div className="mb-4">
                                    <label
                                        className="block font-medium mb-2 bg-gray-300 dark:bg-neutral-700 rounded w-24 h-4"></label>
                                    <input
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-300 dark:bg-neutral-700 dark:border-gray-600 dark:text-white"
                                        type="text" disabled/>
                                </div>
                                <div className="mb-4">
                                    <label
                                        className="block font-medium mb-2 bg-gray-300 dark:bg-neutral-700 rounded w-24 h-4"></label>
                                    <textarea rows={3}
                                              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-300 dark:bg-neutral-700 dark:border-gray-600 dark:text-white"
                                              disabled></textarea>
                                </div>
                                <button type="submit"
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-300 dark:bg-neutral-700 text-white h-10 px-4 py-2 w-full"></button>
                            </form>
                        </div>
                    </div>
                    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow h-fit">
                        <div className="p-4 border-b border-gray-300 dark:border-gray-700">
                            <h2 className="text-xl font-semibold bg-gray-300 dark:bg-neutral-700 rounded w-32 h-6"></h2>
                        </div>
                        <div className="p-4">
                            <div className="mb-4">
                                <h3 className="text-lg font-medium mb-2 bg-gray-300 dark:bg-neutral-700 rounded w-24 h-4"></h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 bg-gray-300 dark:bg-neutral-700 rounded w-48 h-4"></p>
                                <form>
                                    <div className="flex gap-2">
                                        <label
                                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-300 dark:bg-neutral-700 text-white h-10 px-4 py-2"></label>
                                        <input className="hidden" type="file" disabled/>
                                    </div>
                                </form>
                            </div>
                            <div className="mb-4">
                                <h3 className="text-lg font-medium mb-2 bg-gray-300 dark:bg-neutral-700 rounded w-24 h-4"></h3>
                                <form>
                                    <input
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-300 dark:bg-neutral-700 dark:border-gray-600 dark:text-white"
                                        type="text" disabled/>
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-300 dark:bg-neutral-700 text-white h-10 px-4 py-2"
                                            type="submit"></button>
                                    </div>
                                </form>
                            </div>
                            <div className="mt-4 flex flex-col gap-2">
                                <a className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-300 dark:bg-neutral-700 text-white h-10 px-4 py-2 w-full"></a>
                                <button
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-300 dark:bg-neutral-700 text-white h-10 px-4 py-2 w-full"
                                    type="button" disabled></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}