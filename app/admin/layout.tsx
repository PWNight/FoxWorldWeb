"use client"
import {PropsWithChildren} from "react";
import {NavAdmin} from "@/components/navbar_admin";

export default function AdminMeLayout({ children }: PropsWithChildren) {
    return (
        <div className="grid sm:grid-cols-[300px_1fr] gap-6 mt-4 mb-4 sm:px-4 sm:w-[90%] w-full mx-auto">
            <NavAdmin/>
            {children}
        </div>
    );
}
