"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface Category {
    id: number;
    name: string,
    slug: string,
}



export default function () {

    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setname] = useState("")
    const [slug, setslug] = useState("")

    function normalizeData(data: any) {
        if (Array.isArray(data)) return data;
        if (Array.isArray(data.results)) return data.results;
        return [];
    }


    async function fechtCategory() {

        const token = localStorage.getItem('access')

        const response = await fetch(
            "http://127.0.0.1:8000/api/categories/",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

        const data = await response.json();


        setCategories(data);


    }

    useEffect(() => {

        fechtCategory();

    }, []);

    async function handleAddCategory(e: React.FormEvent) {
        e.preventDefault()

        const token = localStorage.getItem('access')

        const response = await fetch(
            "http://127.0.0.1:8000/api/categories/",
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        name: name,
                        slug: slug
                    }
                )
            }
        );

        setname("")
        setslug("")

        if (response.ok) {
            toast.success("categoria adicionada com sucesso")
        } else {
            toast.error("error ao adicionar a categoria")
        }

        fechtCategory();
    }

    return (

        <main className="p-10">

            <h1 className="text-4xl font-bold mb-10">
                Categorias
            </h1>

            <form
                onSubmit={handleAddCategory}
                className="flex flex-col gap-4 mb-10"
            >

                <input
                    type="text"
                    placeholder="Nome da categoria"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    className="border p-3 rounded"
                />

                <input
                    type="text"
                    placeholder="Slug"
                    value={slug}
                    onChange={(e) => setslug(e.target.value)}
                    className="border p-3 rounded"
                />

                <button
                    type="submit"
                    className="bg-black text-white p-3 rounded"
                >
                    Adicionar Categoria
                </button>

            </form>

            <div className="flex flex-col gap-4">

                {categories.map((item) => (

                    <div
                        key={item.id}
                        className="border p-4 rounded"
                    >

                        <h2 className="text-xl font-bold">
                            {item.name}
                        </h2>

                        <p className="text-gray-500">
                            {item.slug}
                        </p>

                    </div>

                ))}

            </div>

        </main>

    );


}