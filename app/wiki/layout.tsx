import { Leftbar } from "@/components/leftbar";
import React from "react";

export default function WikiLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex items-start gap-8 px-4 sm:w-[90%] w-full mx-auto">
      <Leftbar key="leftbar" />
      <div className="flex-[5.25]">{children}</div>
    </div>
  );
}
