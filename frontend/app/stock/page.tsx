"use client";

import { useEffect, useState } from "react";

interface Ingredient {
    id: number;
    name: string;
    stock_quantity: number;
    minimum_stock: number;
    unit: string;
}

export default function StockPage() {

    const [ingredients, setIngredients] = useState<Ingredient[]>([]);

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

    return (

        <main className="p-10">

            <h1 className="text-3xl font-bold mb-6">
                Estoque
            </h1>

            <div className="grid gap-4">

                {ingredients.map((ingredient) => (

                    <div
                        key={ingredient.id}
                        className="border p-4 rounded-lg"
                    >

                        <h2 className="text-xl font-semibold">
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