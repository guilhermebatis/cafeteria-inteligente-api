"use client";

import AuthService from "../services/authService"
import { useState, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import type { User } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AuthProviderProps {
    children: React.ReactNode;
}

export default function AuthProvider({
    children,
}: AuthProviderProps) {
    const router = useRouter();

    const [user, setUser] =
        useState<User | null>(null);

    const [loading, setLoading] =
        useState(true);

    async function fetchUser() {
        const token = localStorage.getItem("access");

        if (!token) {
            setUser(null);
            setLoading(false);
            router.push("/login");
            return;
        }

        try {
            const response = await AuthService.me()
            setUser(response)
        } catch (error) {
            setUser(null)
            toast.error("Failed to fetch user data");
            router.push("/login");


        } finally {
            setLoading(false);
        }
    }

    async function login(username: string,
        password: string) {
        try {
            const response = await AuthService.login({
                username,
                password
            })

            localStorage.setItem("access", response.access);
            localStorage.setItem("refresh", response.refresh);
            await fetchUser();
            router.push("/");
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Failed to login.");
            }
        }
    }

    function logout() {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("is_staff");

        setUser(null);
        router.push("/login");
    }

    useEffect(() => {
        fetchUser();
    }, []);

    if (loading) {
        return null;
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}