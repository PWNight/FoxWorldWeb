import { Leftbar } from "@/components/leftbar";
import React from "react";

export default function WikiLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <div className="flex items-start gap-6 sm:gap-8 lg:px-8 w-full">
            <Leftbar key="leftbar" />
            <main className="flex-[5] w-full">{children}</main>
        </div>
    );
}
