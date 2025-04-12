"use client";
import { createContext, useContext } from "react";

export interface SessionData {
    token: string;
    user: {
        premium_uuid: string;
        joined: string;
        last_seen: string;
    };
    profile: {
        id: number;
        nick: string;
        fk_uuid: string;
        hasAdmin: boolean;
        hasFoxPlus: boolean;
        inGuild: boolean;
    };
}

interface SessionContextType {
    session: SessionData | null;
    isAuthorized: boolean | null;
}

export const SessionContext = createContext<SessionContextType | undefined>(
    undefined
);

export function useSession(): SessionContextType {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
}