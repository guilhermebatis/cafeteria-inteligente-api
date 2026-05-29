"use client";

import { useEffect, useState } from "react";

interface Ingredient {
    id: number;
    name: string;
    stock_quantity: number;
    minimum_stock: number;
    unit: string;
}

export default function IngredientsPage() {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [name, setName] = useState("");
    const [stockQuantity, setStockQuantity] = useState(0);
    const [unit, setUnit] = useState("");
    const [minimum_stock, setMinimumStock] = useState(0);

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

    }, []);

    async function handleAddIngredient(e: React.FormEvent) {
        e.preventDefault();

        const token = localStorage.getItem("access");

        await fetch(
            "http://127.0.0.1:8000/api/ingredients/",
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

        fetchIngredients();
    }


    return (
        <main className="p-10">

            <h1 className="text-3xl font-bold mb-6">
                Ingredientes
            </h1>

            <form
                onSubmit={handleAddIngredient}
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
                    Criar Ingrediente
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

                    </div>

                ))}

            </div>

        </main>
    );
}
