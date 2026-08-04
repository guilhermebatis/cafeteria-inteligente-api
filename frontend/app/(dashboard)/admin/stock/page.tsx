"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import IngredientsService from "@/services/ingredientsService";
import StockService from "@/services/stockService";
import { Ingredient } from "@/types/ingredients";
import { StockMovement, CreateStockMovement } from "@/types/stocks";

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

        try {
            const response = await IngredientsService.getIngredients();
            setIngredients(response);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao carregar os ingredientes.");
            }
        }
    }

    useEffect(() => {

        fetchIngredients();
        fetchStockMovements();

    }, []);

    async function fetchStockMovements() {

        try {
            const response = await StockService.getStockMovements();
            setMovements(response);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao carregar as movimentaçoes de estoque.");
            }
        }
    }

    async function handleAddStock(ingredientId: number) {

        const data: CreateStockMovement = {
            quantity: Number(stockInputs[ingredientId]?.quantity),
            reason: stockInputs[ingredientId]?.reason,
        }

        try {
            await StockService.addStockMovement(ingredientId, data);
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
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao carregar as movimentaçoes de estoque.");
            }
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