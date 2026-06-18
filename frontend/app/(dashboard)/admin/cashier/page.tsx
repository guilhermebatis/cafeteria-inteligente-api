"use client";

import { useEffect, useState, useRef } from "react";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";

interface Product {
    id: number;
    name: string;
    price: string;
    barcode: string;
}

interface Order {
    id: number;
    customer?: Number | null
    user: number;
    total_price: string;
    is_completed: boolean;
    items: OrderItem[];

}

interface OrderItem {
    id: number;
    product: Product;
    quantity: number;
    price: string;

}

interface Customer {
    id: Number,
    name: string,
    cpf: string,
    phone: string,
    email: string,
    is_active: Boolean,

}

export default function CashierPage() {

    const [loading, setLoading] = useState(true);
    const [barcode, setBarcode] = useState("");
    const [orderId, setOrderId] = useState<number | null>(null);
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

        const currentOrderId = orderIdParam || orderId;

        if (!currentOrderId) return;

        const token = localStorage.getItem("access");

        const response = await fetch(
            `http://127.0.0.1:8000/api/orders/${currentOrderId}/`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        if (!response.ok) {
            toast.error("Erro ao buscar pedido");
            return;
        }

        const data = await response.json();

        setOrder({ ...data });
        setLoading(false);

    }

    async function fetchCustomer() {

        const token = localStorage.getItem('access')

        const response = await fetch(
            "http://127.0.0.1:8000/api/customers/",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        )
        const data = await response.json()
        setCustomers(data)
    }


    async function createOrder() {
        const token = localStorage.getItem("access");

        const response = await fetch(
            `http://127.0.0.1:8000/api/orders/`,

            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            }
        )

        if (!response.ok) {
            toast.error("Erro ao criar pedido");
            return;
        }

        const data = await response.json();
        setOrderId(data.id);
        await fetchOrder(data.id);
        return data.id;

    }

    async function getCurrentOrder() {
        const token = localStorage.getItem("access");

        const response = await fetch(
            `http://127.0.0.1:8000/api/orders/current/`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        if (response.status === 404) {
            await createOrder();
            return;
        }

        const data = await response.json();
        setOrder(data);
        setOrderId(data.id);
        await fetchOrder(data.id);

    }

    async function handleSearchProduct() {
        const token = localStorage.getItem("access");

        const response = await fetch(
            `http://127.0.0.1:8000/api/products/by_barcode/?barcode=${barcode}`,

            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        if (!response.ok) {
            toast.error("Produto não encontrado");
            return;
        }

        const data = await response.json();

        const orderResponse = await fetch(
            `http://127.0.0.1:8000/api/orders/${orderId}/add_item/`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    product_id: data.id,
                    quantity: 1
                })
            }
        )

        if (!orderResponse.ok) {
            toast.error("Erro ao adicionar item ao pedido");
            return;
        }


        await fetchOrder(orderId!);

        toast.success("Produto adicionado");

        setBarcode("");
        inputRef.current?.focus();
    }



    async function handleRemoveItem(productId: number) {
        if (!orderId) return;

        const token = localStorage.getItem("access");

        const response = await fetch(
            `http://127.0.0.1:8000/api/orders/${orderId}/remove_item/`,

            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    product_id: productId
                })
            }
        )

        if (!response.ok) {
            toast.error("Erro ao remover item");
            return;
        }

        await fetchOrder();
    }


    async function handleIncreaseQuantity(productId: number) {

        if (!orderId || !order) return;

        const item = order.items.find(
            (item) => item.product.id === productId
        );

        if (!item) return;

        const token = localStorage.getItem("access");

        const response = await fetch(
            `http://127.0.0.1:8000/api/orders/${orderId}/update_item/`,

            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: item.quantity + 1
                })
            }
        )

        if (!response.ok) {
            toast.error("Erro ao atualizar item");
            return;
        }

        await fetchOrder();

    }


    async function handleDecreaseQuantity(productId: number) {
        if (!orderId || !order) return;

        const item = order.items.find(
            (item) => item.product.id === productId
        );

        if (!item) return;

        if (item.quantity === 1) {
            return handleRemoveItem(productId);
        }

        const token = localStorage.getItem("access");

        const response = await fetch(
            `http://127.0.0.1:8000/api/orders/${orderId}/update_item/`,

            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: item.quantity - 1
                })
            }
        )

        if (!response.ok) {
            toast.error("Erro ao atualizar item");
            return;
        }

        await fetchOrder();
    }

    async function handleFinalizeOrder() {
        if (!orderId) return;

        const token = localStorage.getItem("access");

        const response = await fetch(
            `http://127.0.0.1:8000/api/orders/${orderId}/finalize/`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            }
        )

        if (!response.ok) {

            const data = await response.json();

            console.log(data);

            toast.error(data.error || "Erro ao finalizar pedido");
            return;
        }

        toast.success("Pedido finalizado!");

        setOrder(null);

        await createOrder();

    }

    async function handlePayment(method: string) {

        if (!orderId) {
            return
        }

        const token = localStorage.getItem('access')

        const response = await fetch(
            `http://127.0.0.1:8000/api/orders/${orderId}/pay/`,

            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    method
                }),
            }
        );

        if (!response.ok) {
            const data = await response.json();
            toast.error(data.error || "Erro no pagamento")
            return
        }

        const approveResponse = await fetch(
            `http://127.0.0.1:8000/api/orders/${orderId}/approve_payment/`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

        if (!approveResponse.ok) {
            toast.error("Erro ao aprovar pagamento")
            return
        }

        toast.success("pagamento aprovado")

        await handleFinalizeOrder();

        router.push(`/receipt/${orderId}`);

        setShowPaymentModal(false);

        await fetchOrder();

        await createOrder();

    }

    async function handleSelectCustomer(customerId: number) {

        if (!orderId) return

        const token = localStorage.getItem('access')

        const response = await fetch(
            `http://127.0.0.1:8000/api/orders/${orderId}/set_customer/`,
            {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customer: customerId,
                })
            })

        if (!response.ok) {
            toast.error("Error ao vincular Cliente")
            return
        }

        toast.success('Cliente vinculado')
        const data = await response.json();
        console.log(data);
        await fetchOrder()
    }


    useEffect(() => {

        getCurrentOrder();
        fetchCustomer();

    }, []);

    useEffect(() => {

        if (orderId) {
            fetchOrder();
        }

    }, [orderId]);

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