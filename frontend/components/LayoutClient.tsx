"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

interface LayoutClientProps {
    children: React.ReactNode;
}

export default function LayoutClient({
    children,
}: LayoutClientProps) {

    const [totalItems, setTotalItems] = useState(0);

    async function fetchCart() {

        const token = localStorage.getItem("access");

        const orderId = localStorage.getItem("order_id");

        if (!token || !orderId) {

            setTotalItems(0);

            return;
        }

        const response = await fetch(
            `http://127.0.0.1:8000/api/orders/${orderId}/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        const total =
            data.items?.reduce(
                (sum: number, item: any) =>
                    sum + item.quantity,
                0
            ) || 0;

        setTotalItems(total);
    }

    useEffect(() => {

        fetchCart();

        window.addEventListener(
            "cartUpdated",
            fetchCart
        );

        return () => {

            window.removeEventListener(
                "cartUpdated",
                fetchCart
            );
        };

    }, []);

    function handleLogout() {

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("order_id");

        window.location.href = "/login";
    }

    return (

        <>
            <Navbar
                totalItems={totalItems}
                onLogout={handleLogout}
            />

            {children}
        </>

    );
}