"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Ingredient {
    id: number;
    name: string;
    stock_quantity: number;
    minimum_stock: number;
    unit: string;
}

export default function IngredientsPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [name, setName] = useState("");
    const [stockQuantity, setStockQuantity] = useState(0);
    const [unit, setUnit] = useState("");
    const [minimum_stock, setMinimumStock] = useState(0);
    const [editingId, setEditingId] = useState<number | null>(null);

    async function fetchIngredients() {
        const token = localStorage.getItem("access");

        const response = await fetch(
            `${API_URL}/api/ingredients/`,
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

    }, []);

    async function handleAddIngredient(e: React.FormEvent) {
        e.preventDefault();

        const token = localStorage.getItem("access");

        const response = await fetch(
            `${API_URL}/api/ingredients/`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    unit: unit,
                    stock_quantity: Number(stockQuantity),
                    minimum_stock: Number(minimum_stock),
                }),


            }
        );


        setName("");
        setStockQuantity(0);
        setUnit("");
        setMinimumStock(0);

        if (response.ok) {
            toast.success("Ingrediente criado com sucesso!");
        } else {
            toast.error("Erro ao criar ingrediente");
        }

        fetchIngredients();
    }



    async function handleDeleteIngredient(
        id: number
    ) {

        const token = localStorage.getItem("access");

        const response = await fetch(
            `${API_URL}/api/ingredients/${id}/`,
            {
                method: "DELETE",

                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.ok) {
            toast.success("Ingrediente deletado com sucesso!");
            fetchIngredients();

        } else {

            toast.error("Erro ao deletar ingrediente");

        }
    }

    function handleEditIngredient(ingredient: Ingredient) {
        setEditingId(ingredient.id)

        setName(ingredient.name)

        setStockQuantity(ingredient.stock_quantity)

        setUnit(ingredient.unit)

        setMinimumStock(ingredient.minimum_stock)
    }

    async function handleUpdateIngredient(e: React.FormEvent) {

        e.preventDefault();

        const token = localStorage.getItem('access')

        const responde = await fetch(
            `${API_URL}/api/ingredients/${editingId}/`,

            {
                method: 'PATCH',

                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    name,
                    unit,
                    stock_quantity: Number(stockQuantity),
                    minimum_stock: Number(minimum_stock),
                }),

            }
        );


        if (responde.ok) {
            toast.success('Ingrediente atualizado!')

            setEditingId(null);

            setName("");
            setStockQuantity(0);
            setUnit("");
            setMinimumStock(0);

            fetchIngredients();
        }

        else {
            toast.error('Erro ao atualizar ingrediente')
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
                            e.target.value
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
                            e.target.value
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
