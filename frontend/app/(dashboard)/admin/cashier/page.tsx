"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Customer } from "@/types/customers";
import { Order, AddItemToOrder, IncreaseItemQuantity, DecreaseItemQuantity, Payment } from "@/types/orders";
import OrderService from "@/services/odersService";
import CustomersService from "@/services/customersService";
import ProductService from "@/services/productService";
import { ApiError } from "@/services/api";

export default function CashierPage() {
    const [loading, setLoading] = useState(true);
    const [barcode, setBarcode] = useState("");
    const [order, setOrder] = useState<Order | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [selectedProductId, setSelectedProductId]
        = useState<number | null>(null);
    const [showPaymentModal, setShowPaymentModal] =
        useState(false);
    const router = useRouter();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [customerSearch, setCustomerSearch] = useState('')

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.cpf?.includes(customerSearch) ||
        customer.phone?.includes(customerSearch)
    );

    async function fetchOrder(orderIdParam?: number) {

        const currentOrderId = orderIdParam || order?.id;

        if (!currentOrderId) return;

        try {
            const response = await OrderService.getOrderId(currentOrderId)
            setOrder({ ...response });
            setLoading(false);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao buscar as orders.");
            }
            return

        }
    }

    async function fetchCustomer() {

        try {
            const response = await CustomersService.getCustomers()
            setCustomers(response)
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao buscar clientes.");
            }
            return

        }
    }

    async function initializeOrder() {
        try {
            try {
                const order = await OrderService.getCurrentOrder();
                setOrder(order);
                return order;
            } catch (error) {
                if (error instanceof ApiError && error.status === 404) {
                    const order = await OrderService.createCurrentOrder();
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


    async function handleSearchProduct() {

        try {
            const Productresponse = await ProductService.searchProducts(barcode);

            const data: AddItemToOrder = {
                product_id: Productresponse.id,
                quantity: 1
            }

            await OrderService.addProductToOrder(order?.id!, data)
            await fetchOrder(order?.id!);
            toast.success("Produto adicionado");

            setBarcode("");
            inputRef.current?.focus();
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro inesperado.");
            }
            return
        }

    }


    async function handleRemoveItem(productId: number) {
        if (!order?.id) return;

        try {
            await OrderService.removeProductFromOrder(order?.id, productId);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro inesperado.");
            }
            return

        }
        await fetchOrder();
    }


    async function handleIncreaseQuantity(productId: number) {

        if (!order?.id || !order) return;

        const item = order.items.find(
            (item) => item.product.id === productId
        );

        if (!item) return;

        const data: IncreaseItemQuantity = {
            product_id: productId,
            quantity: item.quantity + 1
        }

        try {
            await OrderService.increaseProductQuantity(order?.id, data);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao atualizar item.");
            }
            return

        }
        await fetchOrder();

    }


    async function handleDecreaseQuantity(productId: number) {
        if (!order?.id || !order) return;

        const item = order.items.find(
            (item) => item.product.id === productId
        );

        if (!item) return;

        if (item.quantity === 1) {
            return handleRemoveItem(productId);
        }

        const data: DecreaseItemQuantity = {
            product_id: productId,
            quantity: item.quantity - 1
        }

        try {
            await OrderService.decreaseProductQuantity(order?.id, data);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao atualizar item.");
            }
            return

        }

        await fetchOrder();
    }

    async function handleFinalizeOrder() {
        if (!order?.id) return false;

        try {
            await OrderService.finalizeOrder(order.id);
            toast.success("Pedido finalizado!");

            setOrder(null);

            return true;
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao finalizar pedido.");
            }
            return false
        }

    }

    async function handlePayment(method: string) {

        if (!order?.id) {
            return
        }

        const currentOrderId = order.id;

        const data: Payment = {
            method: method
        }

        try {
            await OrderService.payment(currentOrderId, data);

            await OrderService.approvePayment(currentOrderId);

            const finalized = await handleFinalizeOrder();

            if (!finalized) return;

            setShowPaymentModal(false);

            router.push(`/receipt/${currentOrderId}`);

            await initializeOrder();

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao processar pagamento.");
            }
        }
    }

    async function handleSelectCustomer(customerId: number) {

        if (!order?.id) return

        try {
            await OrderService.setCustomerToOrder(order?.id, customerId);
            toast.success('Cliente vinculado')

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao aprovar pagamento.");
            }
            return
        }
        await fetchOrder()
    }


    useEffect(() => {

        initializeOrder();
        fetchCustomer();

    }, []);

    useEffect(() => {


        function handleKeyboardShortcuts(
            event: KeyboardEvent
        ) {

            const selectedItem = order?.items.find(
                (item) =>
                    item.product.id === selectedProductId
            );

            if (event.key === "F2") {

                event.preventDefault();

                setShowPaymentModal(true);
            }

            if (event.key === "Escape") {

                setBarcode("");
            }

            if (event.key === "F4") {

                event.preventDefault();

                inputRef.current?.focus();
            }

            if (event.key === "Delete") {

                event.preventDefault();

                if (selectedItem) {
                    handleRemoveItem(
                        selectedItem.product.id
                    );
                }
            }

            if (event.key === "+") {

                event.preventDefault();

                if (selectedItem) {
                    handleIncreaseQuantity(
                        selectedItem.product.id
                    );
                }
            }

            if (event.key === "-") {

                event.preventDefault();

                if (selectedItem) {
                    handleDecreaseQuantity(
                        selectedItem.product.id
                    );
                }
            }

            if (event.key === "ArrowDown") {

                event.preventDefault();

                if (!order?.items.length) return;

                if (!selectedProductId) {

                    setSelectedProductId(
                        order.items[0].product.id
                    );

                    return;
                }

                const currentIndex =
                    order.items.findIndex(
                        (item) =>
                            item.product.id === selectedProductId
                    );

                const nextIndex =
                    currentIndex < order.items.length - 1
                        ? currentIndex + 1
                        : 0;

                setSelectedProductId(
                    order.items[nextIndex].product.id
                );
            }

            if (event.key === "ArrowUp") {

                event.preventDefault();

                if (!order?.items.length) return;

                if (!selectedProductId) {

                    setSelectedProductId(
                        order.items[0].product.id
                    );

                    return;
                }

                const currentIndex =
                    order.items.findIndex(
                        (item) =>
                            item.product.id === selectedProductId
                    );

                const prevIndex =
                    currentIndex > 0
                        ? currentIndex - 1
                        : order.items.length - 1;

                setSelectedProductId(
                    order.items[prevIndex].product.id
                );
            }
        }

        window.addEventListener(
            "keydown",
            handleKeyboardShortcuts
        );

        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyboardShortcuts
            );

        };

    }, [order, selectedProductId]);


    return (

        <main className="p-10">

            <h1 className="text-4xl font-bold mb-6">
                Caixa
            </h1>

            <div className="mb-4">

                <label className="block mb-2 font-semibold">
                    Cliente
                </label>

                <input
                    type="text"
                    placeholder="Buscar por nome, CPF ou telefone"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="border p-2 rounded w-full"
                />

                <select
                    className="border p-2 rounded w-full"
                    onChange={(e) =>
                        handleSelectCustomer(
                            Number(e.target.value)
                        )
                    }
                    defaultValue=""
                >

                    <option value="">
                        Selecione um cliente
                    </option>

                    {filteredCustomers.map((customer) => (

                        <option
                            key={customer.id}
                            value={customer.id}
                        >
                            {customer.name} - CPF: {customer.cpf} - Tel: {customer.phone}
                        </option>

                    ))}

                </select>

                {order?.customer && (
                    <div className="mt-2 border p-2 rounded">
                        <p><strong>Cliente:</strong> {order.customer.name}</p>
                        <p><strong>CPF:</strong> {order.customer.cpf}</p>
                        <p><strong>Telefone:</strong> {order.customer.phone}</p>
                    </div>
                )}

            </div>

            <input
                ref={inputRef}
                type="text"
                placeholder="Código de barras"
                value={barcode}
                onChange={(e) =>
                    setBarcode(e.target.value)
                }
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSearchProduct();
                    }
                }}
                className="border p-4 rounded w-full"
            />

            <div className="mt-10 flex flex-col gap-4">

                {order?.items.map((item, index) => (

                    <div
                        key={item.product.id}
                        className={`border p-4 rounded flex justify-between ${selectedProductId === item.product.id
                            ? "border-blue-500"
                            : ""
                            }`}
                    >

                        <div>

                            <h2 className="font-bold">
                                {item.product.name}
                            </h2>

                            <p>
                                Quantidade: {item.quantity}
                            </p>

                            <p>
                                Código: {item.product.barcode}
                            </p>

                            <button
                                onClick={() =>
                                    handleRemoveItem(
                                        item.product.id
                                    )
                                }
                                className="border px-3 py-1 rounded mt-2"
                            >
                                Remover
                            </button>

                        </div>

                        <div className="flex gap-2 mt-2">

                            <button
                                onClick={() =>
                                    handleDecreaseQuantity(
                                        item.product.id
                                    )
                                }
                                className="border px-3 py-1 rounded"
                            >
                                -
                            </button>

                            <button
                                onClick={() =>
                                    handleIncreaseQuantity(
                                        item.product.id
                                    )
                                }
                                className="border px-3 py-1 rounded"
                            >
                                +
                            </button>

                        </div>

                        <p className="font-bold">

                            R$ {
                                (
                                    Number(item.product.price)
                                    * item.quantity
                                ).toFixed(2)
                            }

                        </p>

                    </div>

                ))}

            </div>

            <div className="mt-10 border p-6 rounded">

                <h2 className="text-2xl font-bold">

                    Total:
                    {" "}

                    R$ {Number(order?.total_price || 0).toFixed(2)}
                    <br />
                    <br />
                    <button onClick={() => setShowPaymentModal(true)}>finalizar</button>

                </h2>



            </div>

            {
                showPaymentModal && (

                    <div className="
                    fixed inset-0
                    bg-black/50
                    flex items-center
                    justify-center
                ">

                        <div className="
                        bg-black
                        p-10
                        rounded
                        flex
                        flex-col
                        gap-4
                    ">

                            <h2 className="text-2xl font-bold">
                                Forma de pagamento
                            </h2>

                            <button
                                onClick={() =>
                                    handlePayment("CASH")
                                }
                                className="border p-4 rounded"
                            >
                                Dinheiro
                            </button>

                            <button
                                onClick={() =>
                                    handlePayment("PIX")
                                }
                                className="border p-4 rounded"
                            >
                                PIX
                            </button>

                            <button
                                onClick={() =>
                                    handlePayment("CREDIT_CARD")
                                }
                                className="border p-4 rounded"
                            >
                                Crédito
                            </button>

                            <button
                                onClick={() =>
                                    handlePayment("DEBIT_CARD")
                                }
                                className="border p-4 rounded"
                            >
                                Débito
                            </button>

                        </div>

                    </div>
                )
            }


        </main>
    );
}