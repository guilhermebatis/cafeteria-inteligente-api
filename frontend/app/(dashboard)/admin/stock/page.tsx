"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

interface Ingredient {
    id: number;
    name: string;
    stock_quantity: number;
    minimum_stock: number;
    unit: string;
}

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


export default function StockPage() {

    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [movements, setMovements] = useState<StockMovement[]>([]);
    const [stockInputs, setStockInputs] = useState<{
        [key: number]: {
            quantity: string;
            reason: string;
        };
    }>({});

    async function fetchIngredients() {

        const token = localStorage.getItem("access");

        const response = await fetch(
            "http://127.0.0.1:8000/api/ingredients/",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        setIngredients(data);
    }

    useEffect(() => {

        fetchIngredients();
        fetchStockMovements();

    }, []);

    async function fetchStockMovements() {

        const token = localStorage.getItem("access");

        const response = await fetch(
            "http://127.0.0.1:8000/api/stock-movements/",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            toast.error("Erro ao carregar o histórico de estoque.");
            return;
        }

        const data = await response.json();

        setMovements(data);



    }

    async function handleAddStock(ingredientId: number) {

        const token = localStorage.getItem("access");

        const response = await fetch(
            `http://127.0.0.1:8000/api/ingredients/${ingredientId}/add_stock/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },

                body: JSON.stringify({
                    quantity: Number(stockInputs[ingredientId]?.quantity),
                    reason: stockInputs[ingredientId]?.reason,
                }),

            }
        );

        if (response.ok) {

            toast.success("Estoque atualizado com sucesso!");
            setStockInputs({
                ...stockInputs,

                [ingredientId]: {
                    quantity: "",
                    reason: "",
                },
            });
            fetchIngredients();
            fetchStockMovements();
        } else {

            toast.error("Erro ao atualizar o estoque.");
        }
    }


    return (

        <main className="p-10">

            <h1 className="text-3xl font-bold mb-6">
                Estoque
            </h1>

            <div className="grid gap-4">

                {ingredients.map((ingredient) => (

                    <div
                        key={ingredient.id}
                        className="border p-4 rounded"
                    >

                        <h2 className="font-bold">
                            {ingredient.name}
                        </h2>

                        <p>
                            Quantidade:
                            {" "}
                            {ingredient.stock_quantity}
                            {" "}
                            {ingredient.unit}
                        </p>

                        <p>
                            Estoque mínimo:
                            {" "}
                            {ingredient.minimum_stock}
                            {" "}
                            {ingredient.unit}
                        </p>

                        <p>
                            Status:
                            {" "}

                            {ingredient.stock_quantity <=
                                ingredient.minimum_stock ? (

                                <span className="text-red-500">
                                    Estoque baixo
                                </span>

                            ) : (

                                <span className="text-green-500">
                                    Normal
                                </span>

                            )}

                        </p>

                        <input
                            type="number"
                            placeholder="Quantidade"
                            value={
                                stockInputs[ingredient.id]
                                    ?.quantity || ""
                            }
                            onChange={(e) =>
                                setStockInputs({
                                    ...stockInputs,

                                    [ingredient.id]: {
                                        quantity: e.target.value,

                                        reason:
                                            stockInputs[
                                                ingredient.id
                                            ]?.reason || "",
                                    },
                                })
                            }
                            className="border p-2 rounded mt-2"
                        />

                        <input
                            type="text"
                            placeholder="Motivo"
                            value={
                                stockInputs[ingredient.id]
                                    ?.reason || ""
                            }
                            onChange={(e) =>
                                setStockInputs({
                                    ...stockInputs,

                                    [ingredient.id]: {

                                        quantity:
                                            stockInputs[
                                                ingredient.id
                                            ]?.quantity || "",

                                        reason:
                                            e.target.value,
                                    },
                                })
                            }
                            className="border p-2 rounded mt-2"
                        />

                        <button
                            onClick={() =>
                                handleAddStock(
                                    ingredient.id
                                )
                            }
                            className="border px-4 py-2 rounded mt-2"
                        >
                            Adicionar estoque
                        </button>

                    </div>

                ))}

            </div>

        </main>
    );
}