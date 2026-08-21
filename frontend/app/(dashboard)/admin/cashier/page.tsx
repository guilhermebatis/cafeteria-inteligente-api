"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Customer } from "@/types/customers";
import { Order, AddItemToOrder, IncreaseItemQuantity, DecreaseItemQuantity, Payment, PaymentInput, PaymentResponse, PaymentMethod } from "@/types/orders";
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
    const [amountReceived, setAmountReceived] = useState("");
    const [showCashModal, setShowCashModal] = useState(false);
    const [changeMoney, setChangeMoney] = useState<number>(0);
    const [lastOrderId, setLastOrderId] = useState<number | null>(null);
    const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
    const [lastPayment, setLastPayment] = useState<{
        total: number;
        received: number;
        change: number;
    } | null>(null);

    const [showPixModal, setShowPixModal] = useState(false);
    const [pendingPaymentId, setPendingPaymentId] =
        useState<number | null>(null);

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

    async function handlePayment(
        method: PaymentMethod,
        received?: number
    ) {
        if (!order?.id) {
            return;
        }

        const currentOrderId = order.id;
        const currentTotal = Number(order.total_price)

        const data: PaymentInput = {
            method,
        };

        if (method === "CASH") {
            if (received === undefined) {
                toast.error("Informe o valor recebido.");
                return;
            }

            data.amount_received = received;
        }

        try {

            const response = await OrderService.payment(currentOrderId, data);

            if (method === "CASH") {
                setChangeMoney(response.change_money);
            }

            if (method === "PIX") {
                setShowPaymentModal(false);
                setShowPixModal(true);
                setPendingPaymentId(response.payment.id);

                return;
            }

            await OrderService.approvePayment(currentOrderId, response.payment.id);

            const finalized = await handleFinalizeOrder();

            if (!finalized) return;

            if (method == "CASH" && received !== undefined) {
                setLastPayment({
                    total: currentTotal,
                    received: received,
                    change: Number(response.change_money),
                })
            }

            setLastOrderId(currentOrderId);

            setShowPaymentModal(false);
            setShowCashModal(false);
            setAmountReceived("");
            setShowPaymentSuccess(true)

            await initializeOrder();

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao processar pagamento.");
            }
        }
    }

    async function handleApprovePix() {
        if (!order?.id || !pendingPaymentId) {
            return;
        }

        const currentOrderId = order.id;

        try {
            await OrderService.approvePayment(
                order.id,
                pendingPaymentId
            );

            const finalized = await handleFinalizeOrder();

            if (!finalized) {
                return;
            }

            await initializeOrder();

            setShowPixModal(false);
            setPendingPaymentId(null);

            router.push(`/receipt/${currentOrderId}`);

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao processar o Pix.");
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
                        handleSelectCustomer(Number(e.target.value))
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
                        <p>
                            <strong>Cliente:</strong>{" "}
                            {order.customer.name}
                        </p>

                        <p>
                            <strong>CPF:</strong>{" "}
                            {order.customer.cpf}
                        </p>

                        <p>
                            <strong>Telefone:</strong>{" "}
                            {order.customer.phone}
                        </p>
                    </div>
                )}

            </div>

            <input
                ref={inputRef}
                type="text"
                placeholder="Código de barras"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSearchProduct();
                    }
                }}
                className="border p-4 rounded w-full"
            />

            <div className="mt-10 flex flex-col gap-4">

                {order?.items.map((item) => (

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
                                    handleRemoveItem(item.product.id)
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
                                    Number(item.product.price) *
                                    item.quantity
                                ).toFixed(2)
                            }
                        </p>

                    </div>

                ))}

            </div>

            <div className="mt-10 border p-6 rounded">

                <h2 className="text-2xl font-bold">
                    Total: R${" "}
                    {Number(order?.total_price || 0).toFixed(2)}
                </h2>

                <button
                    onClick={() => setShowPaymentModal(true)}
                    className="border px-6 py-3 rounded mt-4"
                >
                    Finalizar
                </button>

            </div>

            {/* MODAL - FORMA DE PAGAMENTO */}
            {showPaymentModal && (

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
                    min-w-[350px]
                ">

                        <h2 className="text-2xl font-bold">
                            Forma de pagamento
                        </h2>

                        <p>
                            Total: R${" "}
                            {Number(
                                order?.total_price || 0
                            ).toFixed(2)}
                        </p>

                        {/* DINHEIRO */}
                        <button
                            onClick={() => {
                                setShowPaymentModal(false);
                                setShowCashModal(true);
                            }}
                            className="border p-4 rounded"
                        >
                            Dinheiro
                        </button>

                        {/* PIX */}
                        <button
                            onClick={() =>
                                handlePayment("PIX")
                            }
                            className="border p-4 rounded"
                        >
                            PIX
                        </button>

                        {/* CRÉDITO */}
                        <button
                            onClick={() =>
                                handlePayment("CREDIT_CARD")
                            }
                            className="border p-4 rounded"
                        >
                            Crédito
                        </button>

                        {/* DÉBITO */}
                        <button
                            onClick={() =>
                                handlePayment("DEBIT_CARD")
                            }
                            className="border p-4 rounded"
                        >
                            Débito
                        </button>

                        <button
                            onClick={() =>
                                setShowPaymentModal(false)
                            }
                            className="border p-4 rounded"
                        >
                            Cancelar
                        </button>

                    </div>

                </div>
            )}

            {/* MODAL - PAGAMENTO EM DINHEIRO */}
            {showCashModal && (

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
                    min-w-[350px]
                ">

                        <h2 className="text-2xl font-bold">
                            Pagamento em dinheiro
                        </h2>

                        <p>
                            Total: R${" "}
                            {Number(
                                order?.total_price || 0
                            ).toFixed(2)}
                        </p>

                        <label className="font-semibold">
                            Valor recebido
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0,00"
                            value={amountReceived}
                            onChange={(e) =>
                                setAmountReceived(e.target.value)
                            }
                            className="border p-4 rounded text-white"
                        />

                        {amountReceived && Number(amountReceived) >= Number(order?.total_price) && (
                            <div className="border p-4 rounded">
                                <p className="font-semibold">
                                    Troco:
                                </p>

                                <p className="text-2xl font-bold">
                                    R${" "}
                                    {(
                                        Number(amountReceived) -
                                        Number(order?.total_price || 0)
                                    ).toFixed(2)}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={() => {
                                const value = Number(
                                    amountReceived
                                );

                                if (
                                    !amountReceived ||
                                    value <= 0
                                ) {
                                    toast.error(
                                        "Informe um valor válido."
                                    );
                                    return;
                                }

                                handlePayment(
                                    "CASH",
                                    value
                                );
                            }}
                            className="border p-4 rounded"
                        >
                            Confirmar pagamento
                        </button>

                        <button
                            onClick={() => {
                                setShowCashModal(false);
                                setAmountReceived("");
                            }}
                            className="border p-4 rounded"
                        >
                            Voltar
                        </button>

                    </div>

                </div>
            )}

            {/* MODAL - PAGAMENTO NO PIX */}
            {showPixModal && (
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
            min-w-[350px]
        ">
                        <h2 className="text-2xl font-bold text-center">
                            Pagamento via PIX
                        </h2>

                        <p className="text-center">
                            Aguardando confirmação do pagamento...
                        </p>

                        <button
                            onClick={handleApprovePix}
                            className="border p-4 rounded"
                        >
                            Simular pagamento aprovado
                        </button>

                        <button
                            onClick={() => {
                                setShowPixModal(false);
                                setPendingPaymentId(null);
                            }}
                            className="border p-4 rounded"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {showPaymentSuccess && lastPayment && (
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
            min-w-[350px]
        ">

                        <h2 className="text-2xl font-bold text-center">
                            ✓ Pagamento aprovado
                        </h2>

                        <div className="border p-4 rounded">
                            <p>
                                Total:
                                {" "}
                                R$ {lastPayment.total.toFixed(2)}
                            </p>

                            <p>
                                Recebido:
                                {" "}
                                R$ {lastPayment.received.toFixed(2)}
                            </p>

                            <div className="mt-4">
                                <p className="font-semibold">
                                    Troco
                                </p>

                                <p className="text-3xl font-bold">
                                    R$ {lastPayment.change.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={async () => {
                                setShowPaymentSuccess(false);

                                if (!lastOrderId) return;

                                router.push(`/receipt/${lastOrderId}`);
                            }}
                            className="border p-4 rounded"
                        >
                            Continuar
                        </button>

                    </div>
                </div>
            )}

        </main>
    );
}