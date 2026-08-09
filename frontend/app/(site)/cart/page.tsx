"use client";

import { useEffect, useState } from "react";
import Cart from "@/components/Cart";
import { Order, IncreaseItemQuantity } from "@/types/orders";
import { toast } from "sonner";
import OderService from "@/services/odersService";
export default function CartPage() {

    const [order, setOrder] = useState<Order | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    async function fetchOrder() {

        const orderId = localStorage.getItem("order_id");

        if (!orderId) return;

        try {
            const response = await OderService.getOrderId(Number(orderId));
            setOrder(response);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao buscar a order.");
            }
            return
        }


    }

    useEffect(() => {

        fetchOrder();

    }, []);

    async function handleUpdateQuantity(
        productId: number,
        quantity: number
    ) {
        const orderId = localStorage.getItem("order_id");

        if (!orderId || !order) {
            toast.error("Pedido não encontrado.");
            return;
        }

        try {
            if (quantity === 0) {
                await OderService.removeProductFromOrder(
                    Number(orderId),
                    productId
                );
            } else {
                const data: IncreaseItemQuantity = {
                    product_id: productId,
                    quantity,
                };

                await OderService.increaseProductQuantity(
                    Number(orderId),
                    data
                );
            }

            await fetchOrder();
            toast.success("Carrinho atualizado!");

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao atualizar o carrinho.");
            }
        }
    }

    async function handleRemoveItem(productId: number) {
        const orderId = localStorage.getItem("order_id");

        if (!orderId) {
            toast.error("Pedido não encontrado.");
            return;
        }

        try {
            await OderService.removeProductFromOrder(
                Number(orderId),
                productId
            );

            await fetchOrder();

            toast.success("Item removido!");
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao remover produto.");
            }
        }
    }

    async function handleCheckout() {

        const orderId = localStorage.getItem("order_id");

        if (!orderId) {
            toast.error("Pedido não encontrado.");
            return;
        }

        try {
            setIsLoading(true);

            await OderService.Checkout(Number(orderId), {})

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