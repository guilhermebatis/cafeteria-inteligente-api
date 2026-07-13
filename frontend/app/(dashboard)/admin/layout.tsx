"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const router = useRouter();
    const {
        user,
        loading,
    } = useAuth();

    useEffect(() => {
        if (!loading && (!user || !user.is_staff)) {
            router.replace("/login");
        }
    }, [loading, user, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p>Carregando...</p>
            </div>
        );
    }

    if (!user || !user.is_staff) {
        return null;
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