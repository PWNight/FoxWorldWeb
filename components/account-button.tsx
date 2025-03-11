"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
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
  const [isLoading, setIsLoading] = useState<Record<number, boolean>>({});

  const fetchAPI = useCallback(async <T,>(
      endpoint: string,
      token?: string,
      method = "GET",
      body?: any
  ): Promise<T | null> => {
    try {
      const res = await fetch(endpoint, {
        method,
        headers: token ? {
          Authorization: `Bearer ${token}`,
          ...(body && { "Content-Type": "application/json" })
        } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      return res.ok ? res.json() : null;
    } catch (e) {
      console.error(`Error ${endpoint}:`, e);
      return null;
    }
  }, []);

  const fetchData = useCallback(async (token: string | undefined) => {
    const [user, notifs] = await Promise.all([
      fetchAPI<UserData>("/api/v1/users/me", token),
      fetchAPI<Notification[]>("/api/v1/notifications", token),
    ]);
    return { user, notifs };
  }, [fetchAPI]);

  const initialize = useCallback(async () => {
    const session = await getSession();
    if (!session.success || !session.data?.token) {
      setIsLoaded(true);
      return;
    }

    const { user, notifs } = await fetchData(session.data.token);
    if (user) setUserData({ ...user, token: session.data.token });
    if (notifs) {
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.is_read).length);
    }
    setIsLoaded(true);
  }, [fetchData]);

  const markAsRead = useCallback(async (id: number) => {
    if (!userData?.token) return;
    setIsLoading(prev => ({ ...prev, [id]: true }));
    if (await fetchAPI("/api/v1/notifications", userData.token, "PATCH", { id })) {
      const notifs = await fetchAPI<Notification[]>("/api/v1/notifications", userData.token);
      if (notifs) {
        setNotifications(notifs);
        setUnreadCount(notifs.filter(n => !n.is_read).length);
      }
    }
    setIsLoading(prev => ({ ...prev, [id]: false }));
  }, [userData?.token, fetchAPI]);

  const logout = useCallback(async () => {
    if (!userData?.token) return;
    await fetchAPI("/api/v1/auth/logout", userData.token);
    setUserData(null);
    router.push("/");
  }, [userData?.token, router, fetchAPI]);

  useEffect(() => { initialize(); }, [initialize]);

  useEffect(() => {
    if (!userData?.token) return;
    const id = setInterval(async () => {
      const { user, notifs } = await fetchData(userData.token);
      if (user) setUserData(prev => prev ? { ...prev, ...user } : null);
      if (notifs) {
        setNotifications(notifs);
        setUnreadCount(notifs.filter(n => !n.is_read).length);
      }
    }, 15000);
    return () => clearInterval(id);
  }, [userData?.token, fetchData]);

  if (!isLoaded) return null;
  if (!userData?.token) return (
      <Anchor href="/login" className="px-6 bg-orange-500 text-white rounded-lg py-2">
        Войти
      </Anchor>
  );

  const UserAvatar = () => (
      <Image
          src={`https://minotar.net/helm/${userData.profile.nick}/100.png`}
          alt={userData.profile.nick}
          width={50}
          height={50}
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
          <DropdownMenuContent align="end" className="mt-2 p-4 w-80 max-h-[400px] overflow-y-auto rounded-lg">
            <DropdownMenuItem className="text-xl cursor-default">
              <div className="w-full">
                <h1 className="text-xl font-medium">Уведомления</h1>
                {!notifications.length && <p className="text-sm text-gray-500 mt-2">Нет уведомлений</p>}
              </div>
            </DropdownMenuItem>
            {notifications.map(({ id, message, is_read, created_at }) => (
                <DropdownMenuItem
                    key={id}
                    className={`flex flex-col gap-2 py-3 ${!is_read ? "bg-orange-50" : ""}`}
                >
                  <p className="text-sm">{message}</p>
                  <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {new Date(created_at).toLocaleString()}
                </span>
                    {!is_read && (
                        <button
                            onClick={() => markAsRead(id)}
                            disabled={isLoading[id]}
                            className="flex gap-1 items-center text-orange-400 hover:text-orange-500 text-xs disabled:opacity-50"
                        >
                          {isLoading[id] ? <Loader2 className="h-4 w-4 animate-spin" /> : "Прочитано"}
                        </button>
                    )}
                  </div>
                </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><UserAvatar /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="mt-2 py-6 flex flex-col gap-6 rounded-lg">
            <DropdownMenuItem className="text-xl">
              <div className="flex items-center gap-4">
                <UserAvatar />
                <div className="flex flex-col">
                  <div className="flex gap-1 items-center">
                    {userData.profile.hasFoxPlus && <Crown className="text-orange-400" />}
                    <h1 className="text-2xl">{userData.profile.nick}</h1>
                  </div>
                  {userData.profile.hasFoxPlus && <p className="flex gap-1"><HandHeart /> Активна</p>}
                  {!userData.profile.hasAccess && (
                      <Link href="/access" className="flex gap-1 text-primary hover:underline">
                        <Ban /> Анкета
                      </Link>
                  )}
                  {userData.profile.is_banned && <p className="flex gap-1"><Gavel /> Бан</p>}
                </div>
              </div>
            </DropdownMenuItem>
            <div>
              <DropdownMenuItem onClick={() => router.push("/me")} className="text-xl cursor-pointer">
                <p className="flex gap-1"><CircleUser /> Кабинет</p>
              </DropdownMenuItem>
              {userData.profile.hasAdmin && (
                  <DropdownMenuItem onClick={() => router.push("/admin")} className="text-xl cursor-pointer">
                    <p className="flex gap-1"><IdCard /> Админ</p>
                  </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={logout} className="text-xl cursor-pointer">
                <p className="flex gap-1"><LogOut /> Выйти</p>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
  );
}