'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSession } from '@/app/actions/getInfo';

export default function Notifications() {
  const [userData, setUserData] = useState<any>(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});

  const fetchNotifications = useCallback(
    async (token: string) => {
      if (!token) return;

      const res = await fetch(`/api/v1/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data);
        return;
      }

      setNotifications(data);
      setUnreadCount(data.filter((n: any) => !n.is_read).length);
    },
    []
  );

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        const session = await getSession();
        if (mounted) {
          setUserData(session.data);
          await fetchNotifications(session.data.token);
        }
      } catch (error) {
        console.error('Failed to initialize:', error);
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [fetchNotifications]);

  useEffect(() => {
    if (!userData?.token) return;

    const interval = setInterval(() => {
      fetchNotifications(userData.token);
    }, 15000);

    return () => clearInterval(interval);
  }, [userData?.token, fetchNotifications]);

  const markAsRead = async (token: string, id: number) => {
    setLoadingStates((prev) => ({ ...prev, [id]: true })); // Устанавливаем loading для конкретного ID
    try {
      await fetch('/api/v1/notifications', {
        method: 'PATCH',
        body: JSON.stringify({ id }),
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      await fetchNotifications(token);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false })); // Сбрасываем loading
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
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
              notification.is_read ? 'bg-gray-100' : 'bg-blue-50'
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
                    className="inline-flex gap-1 items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors text-blue-500 hover:text-blue-600 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingStates[notification.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Пометить как прочитанное'
                    )}
                  </button>
                )}
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}