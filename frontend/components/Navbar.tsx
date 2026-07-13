"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface NavbarProps {
    totalItems: number;
}

export default function Navbar({
    totalItems,
}: NavbarProps) {

    const pathname = usePathname();
    const { logout, user } = useAuth();

    if (pathname === "/login" || pathname.startsWith("/receipt")) {
        return null;
    }

    return (

        <div className="flex items-center justify-between mb-10">

            <h1 className="text-3xl font-bold">
                Cafeteria Inteligente
            </h1>

            <div className="flex items-center gap-4">

                <Link
                    href="/"
                    className="border px-4 py-2 rounded"
                >
                    Home
                </Link>

                <Link
                    href="/cart"
                    className="border px-4 py-2 rounded"
                >
                    Carrinho ({totalItems})
                </Link>

                <Link
                    href="/history"
                    className="border px-4 py-2 rounded"
                >
                    Histórico
                </Link>

                <button
                    onClick={logout}
                    className="border px-4 py-2 rounded"
                >
                    Logout
                </button>

            </div>

        </div>

    );
}