import { createContext } from "react";
import type { User } from "@/types";

interface AuthContextType {
    user: User | null;
    loading: boolean;

    login: (
        username: string,
        password: string
    ) => Promise<void>;

    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

