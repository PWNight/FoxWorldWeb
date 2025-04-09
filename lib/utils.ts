import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getUserData(token: string) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/users/me`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: 'Не удалось получить данные о пользователе',
        error: errorData || response.statusText,
        status: response.status
      };
    }

    const user = await response.json();
    return {
      success: true,
      data: user,
      status: 200
    };

  } catch (error: any) {
    return {
      success: false,
      message: 'Ошибка при запросе данных пользователя',
      error: error.message,
      status: 500
    };
  }
}