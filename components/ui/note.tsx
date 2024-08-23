import { cn } from "@/lib/utils";
import clsx from "clsx";
import { PropsWithChildren } from "react";
import { TriangleAlert as Warning, Info, CircleAlert as Danger, CircleCheck as Success  } from "lucide-react";

type NoteProps = PropsWithChildren & {
  type?: "Info" | "Danger" | "Warning" | "Success";
};

export default function Note({
  children,
  type = "Info",
}: NoteProps) {
  const noteClassNames = clsx({
    "dark:bg-neutral-900 bg-neutral-100": type == "Info",
    "dark:bg-red-950 bg-red-100 border-red-200 dark:border-red-900":
      type === "Danger",
    "dark:bg-orange-950 bg-orange-100 border-orange-200 dark:border-orange-900":
      type === "Warning",
    "dark:bg-green-950 bg-green-100 border-green-200 dark:border-green-900":
      type === "Success",
  });
  function getIcon(){
    if(type === 'Info'){
      return <Info/>
    }else if(type === 'Danger'){
      return <Danger/>
    }else if(type === 'Warning'){
      return <Warning/>
    }else{
      return <Success/>
    }
  }

  return (
    <div
      className={cn(
        "border rounded-md py-3 px-3.5 text-sm tracking-wide flex-row flex gap-2",
        noteClassNames
      )}
    >
    <>
      <div className="h-full">{getIcon()}</div>
      <div className="not-prose flex flex-col gap-1 break-words text-base">
        {children}
      </div>
    </>
    </div>
  );
}
