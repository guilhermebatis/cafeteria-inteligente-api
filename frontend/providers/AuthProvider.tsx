"use client";

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
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    const [user, setUser] =
        useState<User | null>(null);

    const [loading, setLoading] =
        useState(true);

    async function fetchUser() {
        const token = localStorage.getItem("access");

        if (!token) {
            setLoading(false);
            return;
        }

        const response = await fetch(
            `${API_URL}/api/users/me/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        )

        if (response.ok) {
            const data = await response.json();
            setUser(data);
        } else {
            toast.error("Failed to fetch user data");
            setUser(null);
        }
        setLoading(false);
    }

    async function login(username: string,
        password: string) {

        const response = await fetch(
            `${API_URL}/api/token/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            }
        );
        if (!response.ok) {
            toast.error("Login failed");
            return;
        }
        const data = await response.json();

        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        await fetchUser();

        router.push("/");
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