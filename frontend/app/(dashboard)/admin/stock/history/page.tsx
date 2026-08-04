"use client";

import { useEffect, useState } from "react";
import { StockMovement } from "@/types/stocks";
import stockService from "@/services/stockService";
import { toast } from "sonner";


export default function StockHistoryPage() {

    const [movements, setMovements] =
        useState<StockMovement[]>([]);

    async function fetchStockMovements() {

        try {
            const response = await stockService.getStockMovements();
            setMovements(response);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao carregar as movimentaçoes de estoque.");
            }
        }
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