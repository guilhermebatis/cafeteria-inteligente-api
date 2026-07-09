"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const router = useRouter();
    const [loading, setLoading] = useState(true);

    async function checkAuth(token: string | null) {

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/me/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        if (!response.ok) {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            router.replace('/login');
            return;
        }
        setLoading(false);
    }

    useEffect(() => {

        const token = localStorage.getItem('access');

        if (!token) {
            router.replace('/login');
            return;
        }
        checkAuth(token)
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p>Carregando...</p>
            </div>
        );
    }

    return (

        <main className="flex min-h-screen">

            <AdminSidebar />

            <div className="flex-1 p-10">

                {children}

            </div>

        </main>

    );
}