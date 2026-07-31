"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import IngredientsService from '@/services/ingredientsService'
import { Ingredient, CreateIngredient, UpdateIngredient } from "@/types/ingredients";

export default function IngredientsPage() {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [name, setName] = useState("");
    const [stockQuantity, setStockQuantity] = useState(0);
    const [unit, setUnit] = useState("");
    const [minimum_stock, setMinimumStock] = useState(0);
    const [editingId, setEditingId] = useState<number | null>(null);

    function resetForm() {
        setName("");
        setStockQuantity(0);
        setUnit("");
        setMinimumStock(0);
    }

    async function fetchIngredients() {
        try {
            const response = await IngredientsService.getIngredients()

            setIngredients(response);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro inesperado.");
            }
        }
    }

    useEffect(() => {

        fetchIngredients();

    }, []);

    async function handleAddIngredient(e: React.FormEvent) {
        e.preventDefault();

        const data: CreateIngredient = {
            name,
            unit,
            stock_quantity: Number(stockQuantity),
            minimum_stock: Number(minimum_stock),

        }
        try {
            await IngredientsService.addIngredients(data)

            resetForm()

            await fetchIngredients();

            toast.success("ingrediente adicionado com sucesso")
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro inesperado.");
            }


        }
    }

    async function handleDeleteIngredient(
        id: number
    ) {
        try {
            await IngredientsService.deleteIngredients(id)

            toast.success("ingrediente removido")

            await fetchIngredients()
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro inesperado.");
            }
        }
    }

    function handleEditIngredient(ingredient: Ingredient) {
        setEditingId(ingredient.id)

        setName(ingredient.name)

        setStockQuantity(ingredient.stock_quantity)

        setUnit(ingredient.unit)

        setMinimumStock(ingredient.minimum_stock)
    }

    async function handleUpdateIngredient(e: React.FormEvent,) {

        e.preventDefault();

        if (editingId === null) {
            return;
        }

        const data: UpdateIngredient = {
            name,
            unit,
            stock_quantity: Number(stockQuantity),
            minimum_stock: Number(minimum_stock),
        }

        try {
            await IngredientsService.updateIngredient(editingId, data)

            toast.success('Ingrediente atualizado!')

            setEditingId(null);

            resetForm()

            await fetchIngredients();
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro inesperado.");
            }
        }

    }

    return (
        <main className="p-10">

            <h1 className="text-3xl font-bold mb-6">
                Ingredientes
            </h1>

            <form
                onSubmit={editingId
                    ? handleUpdateIngredient
                    : handleAddIngredient}
                className="flex flex-col gap-4 mb-10"
            >

                <input
                    type="text"
                    placeholder="Nome"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                    className="border p-2 rounded"
                />

                <select
                    value={unit}
                    onChange={(e) =>
                        setUnit(e.target.value)
                    }
                    className="border p-2 rounded"
                >

                    <option value="">
                        Selecione uma unidade
                    </option>

                    <option value="g">
                        Gramas
                    </option>

                    <option value="kg">
                        Quilogramas
                    </option>

                    <option value="ml">
                        Mililitros
                    </option>

                    <option value="l">
                        Litros
                    </option>

                </select>

                <input
                    type="number"
                    placeholder="Quantidade"
                    value={stockQuantity}
                    onChange={(e) =>
                        setStockQuantity(
                            Number(e.target.value)
                        )
                    }
                    className="border p-2 rounded"
                />

                <input
                    type="number"
                    placeholder="Estoque Mínimo"
                    value={minimum_stock}
                    onChange={(e) =>
                        setMinimumStock(
                            Number(e.target.value)
                        )
                    }
                    className="border p-2 rounded"
                />

                <button
                    type="submit"
                    className="border px-4 py-2 rounded"
                >
                    {
                        editingId
                            ? "Atualizar Ingrediente"
                            : "Criar Ingrediente"
                    }
                </button>

            </form>


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

                        <button
                            onClick={() =>
                                handleEditIngredient(ingredient)
                            }
                            className="border px-3 py-1 rounded mt-2 mr-2"
                        >
                            Editar
                        </button>

                        <button
                            onClick={() =>
                                handleDeleteIngredient(
                                    ingredient.id
                                )
                            }
                            className="border px-3 py-1 rounded mt-2"
                        >
                            Remover
                        </button>

                    </div>

                ))}

            </div>

        </main>
    );
}
