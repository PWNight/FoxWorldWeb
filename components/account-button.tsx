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

interface Notification {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  fk_profile: number;
}

interface UserData {
  profile: {
    nick: string;
    hasFoxPlus: boolean;
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
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});

  const fetchAPI = useCallback(async <T,>(
      endpoint: string,
      token?: string,
      method = "GET",
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

      return res.ok ? res.json() : null;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return null;
    }
  }, []);

  const fetchNotifications = useCallback(async (token: string | undefined) => {
    const data = await fetchAPI<Notification[]>("/api/v1/notifications", token);
    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.is_read).length);
    }
  }, [fetchAPI]);

  const initialize = useCallback(async () => {
    setIsUserLoading(true);
    const user = await fetchAPI<UserData>("/api/v1/users/me");
    if (user) {
      setUserData(user);
      setIsUserLoading(false);
      setIsNotificationsLoading(true);
      await fetchNotifications(user.token);
      setIsNotificationsLoading(false);
    } else {
      setUserData(null);
      setIsUserLoading(false);
    }
  }, [fetchAPI, fetchNotifications]);

  const refreshData = useCallback(async () => {
    const user = await fetchAPI<UserData>("/api/v1/users/me");
    if (user) {
      setUserData(user);
      await fetchNotifications(user.token);
    } else {
      setUserData(null);
    }
  }, [fetchAPI, fetchNotifications]);

  useEffect(() => {
    initialize();
    const intervalId = setInterval(() => refreshData(), 15000);
    return () => clearInterval(intervalId);
  }, [initialize, refreshData]);

  const markAsRead = useCallback(async (notificationId: number, fk_profile: number) => {
    if (!userData?.token) return;
    setLoadingStates((prev) => ({ ...prev, [notificationId]: true }));
    const success = await fetchAPI<any>(
        "/api/v1/notifications",
        userData.token,
        "PATCH",
        { id: notificationId, userId: fk_profile }
    );
    if (success) await fetchNotifications(userData.token);
    setLoadingStates((prev) => ({ ...prev, [notificationId]: false }));
  }, [userData?.token, fetchNotifications, fetchAPI]);

  const handleLogout = useCallback(async () => {
    if (!userData?.token) return;
    await fetchAPI("/api/v1/auth/logout", userData.token);
    setUserData(null);
    router.push("/");
  }, [userData?.token, fetchAPI, router]);

  if (isUserLoading) {
    return (
        <div className="flex gap-2 items-center">
          <Button variant="ghost" size="icon" disabled className="rounded-lg">
            <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon" disabled className="rounded-lg">
            <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
          </Button>
        </div>
    );
  }

  if (!userData?.token) {
    return (
        <Anchor
            href="/login"
            className={buttonVariants({
              variant: "accent",
              className: "px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow",
              size: "lg",
            })}
        >
          Войти
        </Anchor>
    );
  }

  const UserAvatar = () => (
      <Image
          src={`https://minotar.net/helm/${userData.profile.nick}/150.png`}
          alt={userData.profile.nick}
          width={40}
          height={40}
          quality={100}
          className="rounded-lg"
      />
  );

  return (
      <div className="flex gap-3 items-center">
        {isNotificationsLoading ? (
            <Button variant="ghost" size="icon" disabled className="rounded-lg">
              <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
            </Button>
        ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-lg w-5 h-5 flex items-center justify-center text-xs font-medium shadow-sm">
                  {unreadCount}
                </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                  align="end"
                  className="mt-2 w-80 max-h-[450px] overflow-y-auto bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-0"
              >
                <div className="px-4 py-3 border-b border-gray-200 dark:border-neutral-700">
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Уведомления</h1>
                </div>
                {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                      <Bell className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Уведомлений пока нет</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <DropdownMenuItem
                            key={notification.id}
                            className={`w-full items-start flex flex-col gap-2 px-4 py-3 border-b border-gray-100 dark:border-neutral-700 last:border-b-0 ${
                                !notification.is_read
                                    ? "bg-orange-50 dark:bg-orange-900/10 hover:bg-orange-100 dark:hover:bg-orange-900/20"
                                    : "hover:bg-gray-50 dark:hover:bg-neutral-700"
                            } transition-colors`}
                        >
                          <p className="text-sm text-gray-700 dark:text-gray-300">{notification.message}</p>
                          <div className="flex justify-between w-full">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(notification.created_at).toLocaleString()}
                            </span>
                            {!notification.is_read && (
                                <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notification.id, notification.fk_profile);
                                    }}
                                    disabled={loadingStates[notification.id]}
                                    className="text-xs text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-medium disabled:opacity-50"
                                >
                                  {loadingStates[notification.id] ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                      "Прочитано"
                                  )}
                                </button>
                            )}
                          </div>
                        </DropdownMenuItem>
                    ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
        )}

        {/* Меню профиля */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
                variant="ghost"
                size="icon"
                className="rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors p-1"
            >
              <UserAvatar />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
              align="end"
              className="mt-2 w-72 bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-4"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-neutral-700">
                <UserAvatar />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    {userData.profile.hasFoxPlus && (
                        <Crown className="h-4 w-4 text-orange-400" />
                    )}
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {userData.profile.nick}
                    </h1>
                  </div>
                  <div className="text-sm">
                    {userData.profile.hasFoxPlus && (
                        <p className="text-orange-400 flex items-center gap-1">
                          <HandHeart className="h-4 w-4" />
                          Подписка активна
                        </p>
                    )}
                    {userData.profile.is_banned && (
                        <p className="text-red-500 flex items-center gap-1">
                          <Gavel className="h-4 w-4" />
                          Заблокирован
                        </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <DropdownMenuItem
                    onClick={() => router.push("/me")}
                    className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg px-3 py-2 cursor-pointer transition-colors"
                >
                  <CircleUser className="h-5 w-5 mr-2" />
                  Личный кабинет
                </DropdownMenuItem>
                {userData.profile.hasAdmin && (
                    <DropdownMenuItem
                        onClick={() => router.push("/admin")}
                        className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg px-3 py-2 cursor-pointer transition-colors"
                    >
                      <IdCard className="h-5 w-5 mr-2" />
                      Кабинет разработчика
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg px-3 py-2 cursor-pointer transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Выйти
                </DropdownMenuItem>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
  );
}