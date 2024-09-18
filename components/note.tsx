import { cn } from "@/lib/utils";
import clsx from "clsx";
import { PropsWithChildren } from "react";
import { Info, TriangleAlert, CircleAlert, CircleCheck } from "lucide-react";

type NoteProps = PropsWithChildren & {
  title?: string;
  type?: "note" | "warning" | "danger" | "success";
};

export default function Note({
  children,
  type = "note",
}: NoteProps) {
  const noteClassNames = clsx({
    "dark:bg-[#2c2e32] bg-[#e6eefa]": type == "note",
    "dark:bg-[#352521] bg-red-100 border-red-200 dark:border-[#352521]":
      type === "danger",
    "dark:bg-orange-500/30 bg-orange-100 border-orange-100 dark:border-orange-500/30":
      type === "warning",
    "dark:bg-green-400/30 bg-green-200 border-green-200 dark:border-green-400/30":
      type === "success",
  });
  const noteIcon = ()=>{
    if(type == 'note'){
      return <Info/>
    }else if(type == 'warning'){
      return <TriangleAlert/>
    }else if(type == 'danger'){
      return <CircleAlert/>
    }else if(type == 'success'){
      return <CircleCheck/>
    }
  }
  return (
    <div
      className={cn(
        "border rounded-md py-0.5 px-3.5 text-sm tracking-wide flex flex-row",
        noteClassNames
      )}
    >
      <p className="font-semibold m-0 mr-2 mt-4">{noteIcon()}</p> <div>{children}</div>
    </div>
  );
}
