"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Anchor from "./anchor";
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

interface Notification {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface UserData {
  profile: {
    nick: string;
    hasFoxPlus: boolean;
    hasAccess: boolean;
    is_banned: boolean;
    hasAdmin: boolean;
  };
  token?: string;
}

export function AccountButton() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});

  // Объединяем все fetch-запросы в один хелпер
  const fetchAPI = useCallback(async <T,>(
    endpoint: string,
    token?: string,
    method: string = "GET",
    body?: any
  ): Promise<T | null> => {
    try {
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
      if (body) headers["Content-Type"] = "application/json";

      const res = await fetch(endpoint, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await res.json();
      if (!res.ok) {
        console.error(`Ошибка ${endpoint}:`, data);
        return null;
      }
      return data;
    } catch (error) {
      console.error(`Ошибка запроса ${endpoint}:`, error);
      return null;
    }
  }, []);

  const fetchNotifications = useCallback(async (token: string | undefined) => {
    const data = await fetchAPI<Notification[]>(`/api/v1/notifications`, token);
    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    }
  }, [fetchAPI]);

  const initializeData = useCallback(async () => {
    const session = await getSession();
    if (!session.success || !session.data?.token) {
      setIsLoaded(true);
      return;
    }

    // Параллельная загрузка данных
    const [userInfo, notificationsData] = await Promise.all([
      fetchAPI<UserData>(`/api/v1/users/me`, session.data.token),
      fetchAPI<Notification[]>(`/api/v1/notifications`, session.data.token),
    ]);

    if (userInfo) {
      setUserData({ ...userInfo, token: session.data.token });
    }
    if (notificationsData) {
      setNotifications(notificationsData);
      setUnreadCount(notificationsData.filter(n => !n.is_read).length);
    }

    setIsLoaded(true);
  }, [fetchAPI]);

  const markAsRead = useCallback(async (notificationId: number) => {
    if (!userData?.token) return;

    setLoadingStates(prev => ({ ...prev, [notificationId]: true }));
    const success = await fetchAPI<any>(
      "/api/v1/notifications",
      userData.token,
      "PATCH",
      { id: notificationId }
    );

    if (success) await fetchNotifications(userData.token);
    setLoadingStates(prev => ({ ...prev, [notificationId]: false }));
  }, [userData?.token, fetchNotifications, fetchAPI]);

  const handleLogout = useCallback(async () => {
    if (!userData?.token) return;

    await fetchAPI("/api/v1/auth/logout", userData.token);
    setUserData(null);
    router.push("/");
    setIsLoaded(true);
  }, [userData?.token, fetchAPI, router]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  useEffect(() => {
    if (!userData?.token) return;

    const interval = setInterval(() => {
      Promise.all([
        fetchNotifications(userData.token),
        fetchAPI<UserData>("/api/v1/users/me", userData.token).then(data =>
          data && setUserData(prev => ({ ...prev, ...data, token: prev?.token }))
        ),
      ]);
    }, 15000);

    return () => clearInterval(interval);
  }, [userData?.token, fetchNotifications, fetchAPI]);

  if (!isLoaded) return null;
  if (!userData?.token) {
    return (
      <Anchor
        href="/login"
        className={buttonVariants({ variant: "accent", className: "px-6", size: "lg" })}
      >
        Войти
      </Anchor>
    );
  }

  const UserAvatar = () => (
    <Image
      src={`https://minotar.net/helm/${userData.profile.nick}/100.png`}
      alt={userData.profile.nick}
      width={50}
      height={50}
      quality={100}
      className="rounded-lg"
    />
  );

  return (
    <div className="flex gap-2 items-center">
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
        <DropdownMenuContent align="end" className="mt-2 py-4 w-80 max-h-[400px] overflow-y-auto rounded-lg">
          <DropdownMenuItem className="text-xl cursor-default">
            <div className="flex flex-col w-full">
              <h1 className="text-xl font-medium">Уведомления</h1>
              {!notifications.length && (
                <p className="text-sm text-gray-500 mt-2">Нет новых уведомлений</p>
              )}
            </div>
          </DropdownMenuItem>
          {notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex flex-col gap-2 py-3 ${
                !notification.is_read ? "bg-orange-50 dark:bg-orange-900/20" : ""
              }`}
            >
              <div className={'flex flex-col w-full'}>
                <p className="text-sm">{notification.message}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                  {!notification.is_read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      disabled={loadingStates[notification.id]}
                      className="inline-flex gap-1 items-center text-orange-400 hover:text-orange-500 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <UserAvatar />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="mt-2 py-10 flex flex-col gap-10 rounded-lg">
          <DropdownMenuItem className="text-xl">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14">
                <UserAvatar />
              </div>
              <div className="flex flex-col text-lg">
                <div className="flex gap-1 items-center">
                  {userData.profile.hasFoxPlus && <Crown className="text-orange-400" />}
                  <h1 className="text-2xl">{userData.profile.nick}</h1>
                </div>
                {userData.profile.hasFoxPlus && (
                  <p className="flex gap-1">
                    <HandHeart />
                    Подписка активна
                  </p>
                )}
                {!userData.profile.hasAccess && (
                  <Link href="/access" className="inline-flex gap-1 items-center text-primary hover:underline">
                    <Ban />
                    Заполните анкету
                  </Link>
                )}
                {userData.profile.is_banned && (
                  <p className="flex gap-1">
                    <Gavel />
                    Заблокирован
                  </p>
                )}
              </div>
            </div>
          </DropdownMenuItem>
          <div>
            <DropdownMenuItem onClick={() => router.push("/me")} className="text-xl cursor-pointer">
              <p className="flex gap-1">
                <CircleUser />
                Личный кабинет
              </p>
            </DropdownMenuItem>
            {userData.profile.hasAdmin && (
              <DropdownMenuItem onClick={() => router.push("/admin")} className="text-xl cursor-pointer">
                <p className="flex gap-1">
                  <IdCard />
                  Кабинет разработчика
                </p>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleLogout} className="text-xl cursor-pointer">
              <p className="flex gap-1">
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