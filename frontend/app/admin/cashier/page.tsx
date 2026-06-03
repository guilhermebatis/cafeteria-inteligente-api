"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";


interface Product {
    id: number;
    name: string;
    price: string;
    barcode: string;
}

interface CartItem {
    product: Product;
    quantity: number;
}

export default function CashierPage() {

    const [barcode, setBarcode] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orderId, setOrderId] = useState<number | null>(null);

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

        setCart((prev) => {

            const existingItem = prev.find(
                (item) =>
                    item.product.id === data.id
            );

            if (existingItem) {

                return prev.map((item) =>

                    item.product.id === data.id
                        ? {
                            ...item,
                            quantity: item.quantity + 1
                        }
                        : item
                );
            }

            return [
                ...prev,
                {
                    product: data,
                    quantity: 1
                }
            ];
        });

        setBarcode("");

    }

    const total = cart.reduce((acc, item) => {

        return (
            acc +
            (
                Number(item.product.price)
                * item.quantity
            )
        );

    }, 0);


    async function handleRemoveItem(productId: number) {
        setCart((prev) =>
            prev.filter((item) =>
                item.product.id !== productId
            )
        );
    }

    function handleIncreaseQuantity(productId: number) {
        setCart((prev) =>
            prev.map((item) =>
                item.product.id === productId
                    ? {
                        ...item,
                        quantity: item.quantity + 1
                    }
                    : item
            )
        );
    }


    async function handleDecreaseQuantity(productId: number) {
        setCart((prev) =>
            prev.map((item) =>
                item.product.id === productId
                    ? {
                        ...item,
                        quantity: item.quantity - 1
                    }
                    : item
            ).filter((item) =>
                item.quantity > 0
            )
        );
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
            toast.error("Erro ao finalizar pedido");
            return;
        }

        toast.success("Pedido finalizado!");
        setCart([]);
        await createOrder();

    }

    useEffect(() => {
        createOrder();
    }, []);



    return (

        <main className="p-10">

            <h1 className="text-4xl font-bold mb-6">
                Caixa
            </h1>

            <input
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

                {cart.map((item) => (

                    <div
                        key={item.product.id}
                        className="border p-4 rounded flex justify-between"
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

                    R$ {total.toFixed(2)}
                    <br />
                    <br />
                    <button onClick={handleFinalizeOrder}>finalizar</button>

                </h2>



            </div>


        </main>
    );
}