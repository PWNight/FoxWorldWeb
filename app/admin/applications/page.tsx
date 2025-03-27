"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, getVerifyApplications } from "@/app/actions/getDataHandlers";
import { LucideCheck, Loader2, LucideX, SearchX } from "lucide-react";
import Image from "next/image";
import ErrorMessage from "@/components/ui/notify-alert";

export default function VerifyApplications() {
    const [userData, setUserData] = useState(Object);
    const [verifyApplications, setVerifyApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [notifyMessage, setNotifyMessage] = useState("");
    const [notifyType, setNotifyType] = useState("");
    const [pageLoaded, setPageLoaded] = useState(false);
    const [updating, setUpdating] = useState(0);
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateSort, setDateSort] = useState("desc");

    const router = useRouter();

    useEffect(() => {
        getSession().then(async (r) => {
            if (!r.success) {
                router.push("/login?to=admin/applications");
                return;
            }
            if (!r.data.profile.hasAdmin) {
                router.push("/");
                return;
            }
            setUserData(r.data);

            const verifyResponse = await getVerifyApplications(r.data.token);
            if (!verifyResponse.success) {
                setNotifyMessage("Произошла ошибка при загрузке заявок игроков");
                setNotifyType("error");
                return;
            }
            setVerifyApplications(verifyResponse.data);
            setFilteredApplications(verifyResponse.data);
            setPageLoaded(true);
        });
    }, [router]);

    useEffect(() => {
        let updatedApplications = [...verifyApplications];

        if (statusFilter !== "all") {
            updatedApplications = updatedApplications.filter((app: any) => {
                if (statusFilter === "Рассматривается") return app.status === "Рассматривается";
                if (statusFilter === "Принята") return app.status === "Принята";
                if (statusFilter === "Отклонена") return app.status === "Отклонена";
                return true;
            });
        }

        updatedApplications.sort((a: any, b: any) => {
            const dateA = new Date(a.date_create);
            const dateB = new Date(b.date_create);
            // @ts-ignore
            return dateSort === "desc" ? dateB - dateA : dateA - dateB;
        });

        setFilteredApplications(updatedApplications);
    }, [statusFilter, dateSort, verifyApplications]);

    const handleClose = () => setNotifyMessage("");

    const handleUpdate = async (status: string, nickname: string, appId: number) => {
        setUpdating(appId);

        let response = await fetch("/api/v1/users/applications", {
            headers: { "Authorization": `Bearer ${userData.token}` },
            method: "POST",
            body: JSON.stringify({ application_id: appId, status, nickname }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData);
            setNotifyMessage(`Произошла ошибка ${response.status} при обновлении заявки игрока`);
            setNotifyType("error");
            setUpdating(0);
            return;
        }

        response = await fetch("/api/v1/notifications", {
            headers: { "Authorization": `Bearer ${userData.token}` },
            method: "POST",
            body: JSON.stringify({
                nickname,
                message: `Ваша заявка была ${status === "Принята" ? "Принята. Теперь вы можете начать игру на нашем сервере." : "Отклонена. Причину отказа вы можете узнать в службе поддержки."}`,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData);
            setNotifyMessage(`Произошла ошибка ${response.status} при отправке уведомления игроку`);
            setNotifyType("error");
            setUpdating(0);
            return;
        }

        await getVerifyApplications(userData.token).then(async (r) => {
            if (!r.success) {
                setNotifyMessage("Произошла ошибка при загрузке заявок игроков");
                setNotifyType("error");
                return;
            }
            setNotifyMessage("Заявка игрока успешно обновлена");
            setNotifyType("success");
            setVerifyApplications(r.data);
        });

        setUpdating(0);
    };

    return (
        <div>
            {notifyMessage && <ErrorMessage message={notifyMessage} onClose={handleClose} type={notifyType} />}
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Управление заявками</h1>

            {/* Фильтры */}
            <div className="mb-6 bg-white dark:bg-neutral-800 rounded-lg shadow p-4 flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2 flex-1">
                    <label className="text-gray-700 dark:text-gray-300 font-medium">Статус:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                        <option value="all">Все</option>
                        <option value="Рассматривается">Рассматривается</option>
                        <option value="Принята">Принята</option>
                        <option value="Отклонена">Отклонена</option>
                    </select>
                </div>
                <div className="flex items-center gap-2 flex-1">
                    <label className="text-gray-700 dark:text-gray-300 font-medium">Сортировка по дате:</label>
                    <select
                        value={dateSort}
                        onChange={(e) => setDateSort(e.target.value)}
                        className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                        <option value="desc">Новые сверху</option>
                        <option value="asc">Старые сверху</option>
                    </select>
                </div>
            </div>

            {!pageLoaded ? (
                <div className="flex items-center justify-center gap-2 text-xl text-gray-700 dark:text-gray-300">
                    <Loader2 className="animate-spin" /> <p>Загружаю анкеты...</p>
                </div>
            ) : filteredApplications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredApplications.map((app: any) => (
                        <div
                            key={app.id}
                            className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6 flex flex-col transition-all duration-300 hover:shadow-lg"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <Image
                                    src={`https://minotar.net/helm/${app.nickname}/150.png`}
                                    alt={app.nickname}
                                    width={40}
                                    height={40}
                                    quality={100}
                                    className="rounded-md"
                                />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{app.nickname}</h2>
                            </div>
                            <div className="space-y-3 flex-1">
                                <p className="text-gray-500 dark:text-gray-400">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Возраст:</span> {app.age}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">О себе:</span> {app.about}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Откуда узнал:</span> {app.where_find}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Планы:</span> {app.plans}
                                </p>
                                <p
                                    className={`font-medium ${
                                        app.status === "Принята"
                                            ? "text-green-500"
                                            : app.status === "Отклонена"
                                                ? "text-red-500"
                                                : "text-yellow-500"
                                    }`}
                                >
                                    <span className="text-gray-700 dark:text-gray-300">Статус:</span> {app.status}
                                </p>
                            </div>
                            {app.status === "Рассматривается" && (
                                <div className="mt-4 flex gap-3">
                                    <button
                                        onClick={() => handleUpdate("Принята", app.nickname, app.id)}
                                        disabled={updating === app.id}
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-all duration-200"
                                    >
                                        {updating === app.id ? (
                                            <>
                                                <Loader2 className="mr-2 animate-spin" /> Выполняю..
                                            </>
                                        ) : (
                                            <>
                                                <LucideCheck className="mr-2" /> Принять
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleUpdate("Отклонена", app.nickname, app.id)}
                                        disabled={updating === app.id}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-all duration-200"
                                    >
                                        {updating === app.id ? (
                                            <>
                                                <Loader2 className="mr-2 animate-spin" /> Выполняю..
                                            </>
                                        ) : (
                                            <>
                                                <LucideX className="mr-2" /> Отклонить
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-full bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6 text-center">
                    <SearchX className="h-20 w-20 mx-auto text-gray-500 dark:text-gray-400" />
                    <h2 className="text-2xl font-bold mt-4 text-gray-900 dark:text-gray-100">Заявки не найдены</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Нет заявок, соответствующих выбранным фильтрам.</p>
                </div>
            )}
        </div>
    );
}