"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Order } from "@/types/orders";
import orderService from "@/services/odersService";

export default function ReceiptPage() {
    const params = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const router = useRouter();


    async function fetchOrder() {
        const orderId = Number(params.id);

        if (!orderId) {
            toast.error("Pedido inválido.");
            return;
        }

        try {
            const response = await orderService.getOrderId(Number(orderId))
            setOrder(response)
            console.log("created_at:", response.created_at);
            console.log("PARAMS:", params);
            console.log("ORDER:", response);
            console.log("CREATED_AT:", response.created_at);
            console.log(
                "DATE PARSED:",
                new Date(response.created_at)
            );
            console.log(
                "DATE BRASIL:",
                new Date(response.created_at).toLocaleString("pt-BR", {
                    timeZone: "America/Sao_Paulo",
                })
            );
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao fazer a nota fiscal.");
            }
            return
        }



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

                <button
                    onClick={() => router.push("/admin/cashier")}
                    className="
                    absolute
                    top-4
                    right-4
                    text-black
                    font-bold
                    text-xl
                    hover:text-red-500
                    "
                >
                    ✕
                </button>

                {order && (

                    <>

                        <div className="text-center">

                            <h1
                                className="
                                text-2xl
                                font-bold
                                text-black
                            "
                            >
                                Cafeteria Inteligente
                            </h1>

                            <p className="mt-2 text-black">
                                Pedido #{order.id}
                            </p>

                            <p className="text-black">
                                Cliente: {order.customer?.name || "Consumidor Final"}
                            </p>

                            <p
                                className="
                                text-sm
                                text-black
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
                            text-black
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
                                        R$ {(item.quantity * Number(item.product.price)).toFixed(2)}
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
                            text-black
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