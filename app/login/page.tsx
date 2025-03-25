"use client";

import {Suspense} from "react";
import {LoginForm} from "@/components/forms/login";

export default function LoginPage() {
    return (
        <Suspense fallback={<p>Loading</p>}>
            <LoginForm />
        </Suspense>
    );
}