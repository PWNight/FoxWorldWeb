"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "FW - Мы сломались :(",
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.log(error);
  }, [error]);

  return (
      <div className="px-2 py-8 flex flex-col gap-8 justify-center items-start m-auto h-full sm:w-1/2 select-none">
          <div className="flex flex-col gap-2">
              <h2 className="text-4xl font-bold">Ой, ошибка!</h2>
              <p className="text-muted-foreground">Кажется, что-то пошло не так. Попробуйте заново загрузить страницу
                  или вернитесь на главную и сообщите команде разработки о баге.</p>
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
