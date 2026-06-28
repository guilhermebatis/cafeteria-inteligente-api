"use client";

import { useEffect, useState } from "react";

interface StockMovement {
    id: number;

    ingredient: {
        name: string;
    };

    quantity: string;
    movement_type: string;
    reason: string;
    created_at: string;
}

export default function StockHistoryPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [movements, setMovements] =
        useState<StockMovement[]>([]);

    async function fetchStockMovements() {

        const token =
            localStorage.getItem("access");

        const response = await fetch(
            `${API_URL}/api/stock-movements/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        setMovements(data);
    }

    useEffect(() => {

        fetchStockMovements();

    }, []);

    return (

        <main className="p-10">

            <h1 className="text-3xl font-bold mb-6">
                Histórico de Estoque
            </h1>

            <div className="grid gap-4">

                {movements.map((movement) => (

                    <div
                        key={movement.id}
                        className="border p-4 rounded"
                    >

                        <h2 className="font-bold">
                            {movement.ingredient.name}
                        </h2>

                        <p>
                            Quantidade:
                            {" "}
                            {movement.quantity}
                        </p>

                        <p>
                            Tipo:
                            {" "}

                            {movement.movement_type === "IN"
                                ? "Entrada"
                                : "Saída"}
                        </p>

                        <p>
                            Motivo:
                            {" "}
                            {movement.reason}
                        </p>

                        <p>
                            Data:
                            {" "}
                            {new Date(
                                movement.created_at
                            ).toLocaleString()}
                        </p>

                    </div>

                ))}

            </div>

        </main>
    );
}