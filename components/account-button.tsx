"use client";

import { Button, buttonVariants } from "./ui/button";
import { useEffect, useState, useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Anchor from "./anchor";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Ban,
  Bell,
  CircleUser,
  Crown,
  Gavel,
  HandHeart,
  IdCard,
  Loader2,
  LogOut,
} from "lucide-react";
import { getSession } from "@/app/actions/getInfo";

export function AccountButton() {
  const [userData, setUserData] = useState<any>({});
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});
  const router = useRouter();

  const fetchNotifications = useCallback(async (token: string) => {
    if (!token) {
      console.warn("Токен отсутствует, уведомления не загружаются");
      return;
    }

    try {
      const res = await fetch(`/api/v1/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Ошибка загрузки уведомлений:", data);
        return;
      }

      setNotifications(data);
      setUnreadCount(data.filter((n: any) => !n.is_read).length);
    } catch (error) {
      console.error("Не удалось загрузить уведомления:", error);
    }
  }, []);

  const fetchUserInfo = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/users/me`, {});

      const data = await res.json();

      if (!res.ok) {
        console.error("Ошибка загрузки данных пользователя:", data);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Не удалось загрузить данные пользователя:", error);
      return null;
    }
  }, []);

  async function logOut() {
    if (Object.keys(userData).length === 0) return;

    try {
      const response = await fetch("/api/v1/auth/logout", {
        method: "GET",
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Ошибка при выходе:", errorData);
      }
      setUserData({});
      router.push("/");
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    } finally {
      setIsLoaded(true);
    }
  }

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        const session = await getSession();
        if (!mounted) return;

        if (!session.success || !session.data?.token) {
          setUserData({});
          setIsLoaded(true);
          return;
        }

        // Получаем данные пользователя из /api/v1/users/me
        const userInfo = await fetchUserInfo();
        if (!userInfo) {
          setUserData({});
          setIsLoaded(true);
          return;
        }

        // Устанавливаем данные пользователя и токен
        setUserData({ ...userInfo, token: session.data.token });
        await fetchNotifications(session.data.token);
        setIsLoaded(true);
      } catch (error) {
        console.error("Ошибка инициализации:", error);
        setUserData({});
        setIsLoaded(true);
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [fetchNotifications, fetchUserInfo]);

  useEffect(() => {
    if (!userData?.token) return;

    const interval = setInterval(() => {
      fetchNotifications(userData.token);
      fetchUserInfo();
    }, 15000);

    return () => clearInterval(interval);
  }, [userData.token, fetchNotifications, fetchUserInfo]);

  const markAsRead = async (token: string, id: number) => {
    if (!token) {
      console.warn("Токен отсутствует, невозможно пометить как прочитанное");
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch("/api/v1/notifications", {
        method: "PATCH",
        body: JSON.stringify({ id }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error("Ошибка при обновлении уведомления:", await res.json());
        return;
      }

      await fetchNotifications(token);
    } catch (error) {
      console.error("Ошибка при пометке как прочитанное:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (!isLoaded) return null;

  if (Object.keys(userData).length === 0 || !userData.token) {
    return (
      <Anchor
        href="/login"
        className={buttonVariants({ variant: "accent", className: "px-6", size: "lg" })}
      >
        Войти
      </Anchor>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      {/* Notifications Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="mt-2 py-4 flex flex-col gap-4 rounded-lg w-80 max-h-[400px] overflow-y-auto"
        >
          <DropdownMenuItem className="text-xl cursor-default">
            <div className="flex flex-col w-full">
              <h1 className="text-xl font-medium">Уведомления</h1>
              {notifications.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">Нет новых уведомлений</p>
              )}
            </div>
          </DropdownMenuItem>

          {notifications.map((notification: any) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex flex-col gap-2 py-3 ${
                !notification.is_read ? "bg-orange-50 dark:bg-orange-900/20" : "!dark:bg-neutral-50"
              }`}
            >
              <div className="flex flex-col w-full">
                <p className="text-sm">{notification.message}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                  {!notification.is_read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(userData.token, notification.id);
                      }}
                      disabled={loadingStates[notification.id]}
                      className="inline-flex gap-1 items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors text-orange-400 hover:text-orange-500 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingStates[notification.id] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Пометить как прочитанное"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Account Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Image
              src={`https://minotar.net/helm/${userData.profile.nick}/100.png`}
              alt={userData.profile.nick}
              width={50}
              height={50}
              quality={100}
              className="rounded-lg"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="mt-2 py-10 flex flex-col gap-10 rounded-lg">
          <DropdownMenuItem className="text-xl">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 flex items-center flex-col justify-center">
                <Image
                  src={`https://minotar.net/helm/${userData.profile.nick}/100.png`}
                  alt={userData.profile.nick}
                  width={50}
                  height={50}
                  quality={100}
                  className="rounded-lg"
                />
              </div>
              <div className="flex flex-col text-lg">
                <div className="flex gap-1 items-center">
                  {userData.profile.have_fplus ? <Crown className="text-orange-400" /> : ""}
                  <h1 className="text-2xl">{userData.profile.nick}</h1>
                </div>
                {userData.profile.have_fplus ? (
                  <p className="flex flex-row gap-1">
                    <HandHeart />
                    Подписка активна
                  </p>
                ) : null}
                {!userData.profile.has_access ? (
                  <Link
                    href="/access"
                    className="inline-flex gap-1 items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary underline-offset-4 hover:underline"
                  >
                    <Ban />
                    Заполните анкету
                  </Link>
                ) : null}
                {userData.profile.is_banned ? (
                  <p className="flex flex-row gap-1">
                    <Gavel />
                    Заблокирован
                  </p>
                ) : null}
              </div>
            </div>
          </DropdownMenuItem>
          <div>
            <DropdownMenuItem onClick={() => router.push("/me")} className="text-xl">
              <p className="flex flex-row gap-1">
                <CircleUser />
                Личный кабинет
              </p>
            </DropdownMenuItem>
            {["dev", "staff"].includes(userData.group) && (
              <DropdownMenuItem onClick={() => router.push("/admin")} className="text-xl">
                <p className="flex flex-row gap-1">
                  <IdCard />
                  Кабинет разработчика
                </p>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => logOut()} className="text-xl">
              <p className="flex flex-row gap-1">
                <LogOut />
                Выйти
              </p>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}