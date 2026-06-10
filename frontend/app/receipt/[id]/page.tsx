"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Order } from "@/types";

export default function ReceiptPage() {

    const params = useParams();
    const [order, setOrder] = useState<Order | null>(null);


    console.log(params.id);

    async function fetchOrder() {

        const token = localStorage.getItem('access')

        const response = await fetch(
            `http://127.0.0.1:8000/api/orders/${params.id}/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })

        if (!response.ok) {
            toast.error('error ao buscar o pedido');
            return;
        }

        const data = await response.json();
        setOrder(data)

    }

    useEffect(() => {

        fetchOrder()

    }, []);



    return (

        <main className="min-h-screen p-10 bg-gray-100">

            <div
                className="
                max-w-sm
                mx-auto
                border
                bg-white
                p-6
                rounded-lg
                shadow
                font-mono
            "
            >

                {order && (

                    <>

                        <div className="text-center">

                            <h1
                                className="
                                text-2xl
                                font-bold
                            "
                            >
                                Cafeteria Inteligente
                            </h1>

                            <p className="mt-2">
                                Pedido #{order.id}
                            </p>

                            <p
                                className="
                                text-sm
                                text-gray-500
                            "
                            >
                                {new Date(
                                    order.created_at
                                ).toLocaleString("pt-BR")}
                            </p>

                        </div>

                        <hr className="my-4" />

                        <div
                            className="
                            space-y-2
                            mt-6
                        "
                        >

                            {order.items.map((item) => (

                                <div
                                    key={item.id}
                                    className="
                                    flex
                                    justify-between
                                "
                                >

                                    <span>
                                        {item.product.name}
                                        {" "}
                                        x{item.quantity}
                                    </span>

                                    <span>
                                        R$ {item.quantity} x {item.price}
                                    </span>

                                </div>

                            ))}

                        </div>

                        <hr className="my-4" />

                        <div
                            className="
                            flex
                            justify-between
                            font-bold
                            text-lg
                        "
                        >

                            <span>
                                TOTAL
                            </span>

                            <span>
                                R$ {order.total_price}
                            </span>

                        </div>

                        <button
                            onClick={() => window.print()}
                            className="
                            mt-6
                            w-full
                            bg-black
                            text-white
                            py-2
                            rounded
                            hover:opacity-90
                        "
                        >

                            Imprimir

                        </button>

                    </>

                )}

            </div>

        </main>

    );


}