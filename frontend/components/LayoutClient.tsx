"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

interface LayoutClientProps {
    children: React.ReactNode;
}

export default function LayoutClient({
    children,
}: LayoutClientProps) {

    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const [totalItems, setTotalItems] = useState(0);

    async function fetchCart() {

        const token = localStorage.getItem("access");

        const orderId = localStorage.getItem("order_id");

        if (!token || !orderId) {

            setTotalItems(0);

            return;
        }

        const response = await fetch(
            `${API_URL}/api/orders/${orderId}/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            toast.error("Erro ao buscar o carrinho");
            return;
        }

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

    return (

        <>
            <Navbar
                totalItems={totalItems}
            />

            {children}
        </>

    );
}