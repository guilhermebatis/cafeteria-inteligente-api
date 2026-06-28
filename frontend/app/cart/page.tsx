"use client";

import { useEffect, useState } from "react";
import Cart from "@/components/Cart";
import { Order } from "@/types";
import { toast } from "sonner";

export default function CartPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [order, setOrder] = useState<Order | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    async function fetchOrder() {

        const token = localStorage.getItem("access");

        const orderId = localStorage.getItem("order_id");

        if (!orderId) return;

        const response = await fetch(
            `${API_URL}/api/orders/${orderId}/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        setOrder(data);
    }

    useEffect(() => {

        fetchOrder();

    }, []);

    async function handleUpdateQuantity(
        productId: number,
        quantity: number
    ) {

        const token = localStorage.getItem("access");

        const orderId = localStorage.getItem("order_id");

        await fetch(
            `${API_URL}/api/orders/${orderId}/update_item/`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: quantity,
                }),
            }
        );

        await fetchOrder();

        toast.success("Quantidade atualizada!");
    }

    async function handleRemoveItem(productId: number) {

        const token = localStorage.getItem("access");

        const orderId = localStorage.getItem("order_id");

        await fetch(
            `${API_URL}/api/orders/${orderId}/remove_item/`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    product_id: productId,
                }),
            }
        );

        await fetchOrder();

        toast.success("Item removido!");
    }

    async function handleCheckout() {

        try {

            setIsLoading(true);

            const token = localStorage.getItem("access");

            const orderId = localStorage.getItem("order_id");

            await fetch(
                `${API_URL}/api/orders/${orderId}/checkout/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            localStorage.removeItem("order_id");

            setOrder(null);

            toast.success("Pedido finalizado!");

        } catch {

            toast.error("Erro ao finalizar pedido.");

        } finally {

            setIsLoading(false);

        }
    }

    return (
        <main className="p-10">

            <Cart
                order={order}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onCheckout={handleCheckout}
                isLoading={isLoading}
            />

        </main>
    );
}