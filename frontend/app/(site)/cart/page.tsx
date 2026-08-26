"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Cart from "@/components/Cart";

import {
    Order,
    IncreaseItemQuantity,
    PaymentInput,
    PaymentMethod,
} from "@/types/orders";

import { toast } from "sonner";

import OrderService from "@/services/odersService";
import { ApiError } from "@/services/api";

export default function CartPage() {
    const router = useRouter();

    const [order, setOrder] = useState<Order | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    // Modal de escolha do pagamento
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // Modal PIX
    const [showPixModal, setShowPixModal] = useState(false);

    // Modal cartão
    const [showCardModal, setShowCardModal] = useState(false);

    // Modal de sucesso
    const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

    // Pagamento que está aguardando aprovação
    const [pendingPaymentId, setPendingPaymentId] =
        useState<number | null>(null);

    // Pedido que acabou de ser pago
    const [lastOrderId, setLastOrderId] =
        useState<number | null>(null);

    async function initializeOrder() {
        try {
            try {
                const order = await OrderService.getCurrentOrder();

                setOrder(order);

                return order;
            } catch (error) {
                if (
                    error instanceof ApiError &&
                    error.status === 404
                ) {
                    const order =
                        await OrderService.createCurrentOrder();

                    setOrder(order);

                    return order;
                }

                throw error;
            }
        } catch (error) {
            toast.error("Erro ao inicializar pedido.");

            return null;
        }
    }

    async function fetchOrder(orderIdParam?: number) {
        const currentOrderId =
            orderIdParam || order?.id;

        if (!currentOrderId) {
            return;
        }

        try {
            const response =
                await OrderService.getOrderId(currentOrderId);

            setOrder({
                ...response,
            });
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error(
                    "Erro ao buscar o pedido."
                );
            }
        }
    }

    useEffect(() => {
        initializeOrder();
    }, []);

    async function handleUpdateQuantity(
        productId: number,
        quantity: number
    ) {
        if (!order?.id) {
            toast.error("Pedido não encontrado.");
            return;
        }

        try {
            if (quantity === 0) {
                await OrderService.removeProductFromOrder(
                    Number(order.id),
                    productId
                );
            } else {
                const data: IncreaseItemQuantity = {
                    product_id: productId,
                    quantity,
                };

                await OrderService.increaseProductQuantity(
                    Number(order.id),
                    data
                );
            }

            await fetchOrder();

            toast.success("Carrinho atualizado!");
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error(
                    "Erro ao atualizar o carrinho."
                );
            }
        }
    }

    async function handleRemoveItem(
        productId: number
    ) {
        if (!order?.id) {
            toast.error("Pedido não encontrado.");
            return;
        }

        try {
            await OrderService.removeProductFromOrder(
                Number(order.id),
                productId
            );

            await fetchOrder();

            toast.success("Item removido!");
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error(
                    "Erro ao remover produto."
                );
            }
        }
    }

    async function handleFinalizeOrder() {
        if (!order?.id) {
            return false;
        }

        try {
            await OrderService.finalizeOrder(order.id);

            toast.success("Pedido finalizado!");

            setOrder(null);

            return true;
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error(
                    "Erro ao finalizar pedido."
                );
            }

            return false;
        }
    }

    async function handlePayment(
        method: PaymentMethod
    ) {
        if (!order?.id) {
            toast.error("Pedido não encontrado.");
            return;
        }

        const currentOrderId = order.id;

        const data: PaymentInput = {
            method,
        };

        setIsLoading(true);

        try {
            const response =
                await OrderService.payment(
                    currentOrderId,
                    data
                );

            const paymentId =
                response.payment.id;

            setPendingPaymentId(paymentId);

            // PIX
            if (method === "PIX") {
                setShowPaymentModal(false);
                setShowPixModal(true);

                return;
            }

            // CARTÃO
            if (
                method === "CREDIT_CARD" ||
                method === "DEBIT_CARD"
            ) {
                setShowPaymentModal(false);
                setShowCardModal(true);

                return;
            }

            // Caso futuramente exista outro método
            await OrderService.approvePayment(
                currentOrderId,
                paymentId
            );

            const finalized =
                await handleFinalizeOrder();

            if (!finalized) {
                return;
            }

            setLastOrderId(currentOrderId);

            setShowPaymentModal(false);
            setShowPaymentSuccess(true);

            await initializeOrder();
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error(
                    "Erro ao processar pagamento."
                );
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function handleApprovePix() {
        if (
            !order?.id ||
            !pendingPaymentId
        ) {
            toast.error(
                "Pagamento não encontrado."
            );

            return;
        }

        const currentOrderId = order.id;

        setIsLoading(true);

        try {
            // Simula aprovação do PIX
            await OrderService.approvePayment(
                currentOrderId,
                pendingPaymentId
            );

            const finalized =
                await handleFinalizeOrder();

            if (!finalized) {
                return;
            }

            // Guarda o pedido que foi pago
            setLastOrderId(currentOrderId);

            // Fecha modal PIX
            setShowPixModal(false);

            // Limpa pagamento pendente
            setPendingPaymentId(null);

            // Abre modal de sucesso
            setShowPaymentSuccess(true);

            // Cria/busca novo carrinho
            await initializeOrder();
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error(
                    "Erro ao processar o Pix."
                );
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function handleApproveCard() {
        if (
            !order?.id ||
            !pendingPaymentId
        ) {
            toast.error(
                "Pagamento não encontrado."
            );

            return;
        }

        const currentOrderId = order.id;

        setIsLoading(true);

        try {
            // Simula aprovação do cartão
            await OrderService.approvePayment(
                currentOrderId,
                pendingPaymentId
            );

            const finalized =
                await handleFinalizeOrder();

            if (!finalized) {
                return;
            }

            // Guarda o pedido pago
            setLastOrderId(currentOrderId);

            // Fecha modal
            setShowCardModal(false);

            // Limpa pagamento pendente
            setPendingPaymentId(null);

            // Abre sucesso
            setShowPaymentSuccess(true);

            // Cria/busca novo carrinho
            await initializeOrder();
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error(
                    "Erro ao processar o cartão."
                );
            }
        } finally {
            setIsLoading(false);
        }
    }

    function cancelPayment() {
        setShowPaymentModal(false);
        setShowPixModal(false);
        setShowCardModal(false);

        setPendingPaymentId(null);
    }

    function handleOpenPaymentModal() {
        if (!order?.id) {
            toast.error("Pedido não encontrado.");
            return;
        }

        if (!order.items?.length) {
            toast.error(
                "Adicione pelo menos um produto ao carrinho."
            );

            return;
        }

        setShowPaymentModal(true);
    }

    function handleCloseSuccess() {
        setShowPaymentSuccess(false);
    }

    return (
        <main className="p-10">
            <Cart
                order={order}

                onUpdateQuantity={
                    handleUpdateQuantity
                }

                onRemoveItem={
                    handleRemoveItem
                }

                handlePayment={
                    handlePayment
                }

                handleApprovePix={
                    handleApprovePix
                }

                handleApproveCard={
                    handleApproveCard
                }

                cancelPayment={
                    cancelPayment
                }

                showPaymentModal={
                    showPaymentModal
                }

                showPixModal={
                    showPixModal
                }

                showCardModal={
                    showCardModal
                }

                showPaymentSuccess={
                    showPaymentSuccess
                }

                lastOrderId={
                    lastOrderId
                }

                openPaymentModal={
                    handleOpenPaymentModal
                }

                closePaymentModal={() =>
                    setShowPaymentModal(false)
                }

                onPaymentSuccessContinue={
                    handleCloseSuccess
                }

                isLoading={
                    isLoading
                }
            />
        </main>
    );
}