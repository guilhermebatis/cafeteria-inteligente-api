"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CustomerHistoryPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const params = useParams()
    const [orders, setOrders] = useState<any[]>([]);

    console.log(params.id)

    async function fetchOrderCustomer() {

        const token = localStorage.getItem('access')

        const response = await fetch(
            `${API_URL}/api/customers/${params.id}/orders/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        )

        if (response.ok) {
            const data = await response.json();
            setOrders(data)
        } else {
            toast('error ao buscar historico do cliente')
        }
    }


    useEffect(() => {
        fetchOrderCustomer();
    }, []);

    const customer = orders[0]?.customer;

    return (
        <main className="p-10">

            {customer && (

                <div className="border rounded p-6 mb-6">

                    <h1 className="text-3xl font-bold">
                        {customer.name}
                    </h1>

                    <p>
                        CPF: {customer.cpf || "Não informado"}
                    </p>

                    <p>
                        Telefone: {customer.phone}
                    </p>

                    <p>
                        Email: {customer.email}
                    </p>

                </div>

            )}

            <h2 className="text-2xl font-bold mb-4">
                Histórico de Compras
            </h2>

            <div className="grid gap-4">

                {orders.map((order) => (

                    <div
                        key={order.id}
                        className="border rounded p-4"
                    >

                        <h3 className="font-bold">
                            Pedido #{order.id}
                        </h3>

                        <p>
                            Total: R$ {order.total_price}
                        </p>

                        <p>
                            Data: {
                                new Date(
                                    order.created_at
                                ).toLocaleString("pt-BR")
                            }
                        </p>

                        <div className="mt-3">

                            {order.items.map((item: any) => (

                                <p key={item.id}>

                                    {item.product.name}
                                    {" "}
                                    x{item.quantity}

                                </p>

                            ))}

                        </div>

                    </div>

                ))}

            </div>

        </main>
    )
}