"use client";

import {Suspense} from "react";
import Loading from "@/components/loading";
import {LoginForm} from "@/components/loginform";

export default function LoginPage() {
    return (
        <Suspense fallback={<Loading/>}>
            <LoginForm />
        </Suspense>
    );
}