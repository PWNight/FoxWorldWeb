"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[99vh] px-2 py-8 flex flex-col gap-5 items-start">
      <div className="flex flex-col gap-2">
        <h2 className="text-5xl font-bold">Произошла ошибка!</h2>
        <p className="text-muted-foreground">Кажется, что-то пошло не так. Попробуйте заново загрузить страницу или вернитесь на главную и сообщите команде разработки о баге.</p>
      </div>
      <Button
        variant='accent'
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Попытать удачу
      </Button>
    </div>
  );
}
