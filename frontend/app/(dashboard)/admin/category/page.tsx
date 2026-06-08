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
    const [editingId, setEditingId] = useState<number | null>(null);
    const [name, setName] = useState("")
    const [slug, setSlug] = useState("")

    async function fetchCategory() {

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

        fetchCategory();

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

        setName("")
        setSlug("")

        if (response.ok) {
            toast.success("categoria adicionada com sucesso")
        } else {
            toast.error("error ao adicionar a categoria")
        }

        fetchCategory();
    }

    async function handleDeleteCategory(id: Number) {

        const token = localStorage.getItem('access')

        const response = await fetch(
            `http://127.0.0.1:8000/api/categories/${id}/`,

            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );

        if (response.ok) {
            toast.success('categoria deletado com sucesso')
            fetchCategory()
        } else {
            toast.error("error ao remover categoria")

        }
    }

    function handleEditCategory(category: Category) {

        setEditingId(category.id)
        setName(category.name)
        setSlug(category.slug)
    }

    async function handleUpdateCategory(e: React.FormEvent) {
        e.preventDefault();

        const token = localStorage.getItem('access')

        const response = await fetch(
            `http://127.0.0.1:8000/api/categories/${editingId}/`,
            {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    slug,
                })
            }
        );

        if (response.ok) {
            toast.success('categoria atualizada com sucesso')
            setEditingId(null)
            setName('')
            setSlug('')
            fetchCategory()
        } else {
            toast.error('error ao atualizar a categoria')
        }
    }

    return (

        <main className="p-10">

            <h1 className="text-3xl font-bold mb-6">
                Categorias
            </h1>

            <form
                onSubmit={
                    editingId !== null
                        ? handleUpdateCategory
                        : handleAddCategory
                }
                className="flex flex-col gap-4 mb-10"
            >

                <input
                    type="text"
                    placeholder="Nome da categoria"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                    className="border p-2 rounded"
                />

                <input
                    type="text"
                    placeholder="Slug"
                    value={slug}
                    onChange={(e) =>
                        setSlug(e.target.value)
                    }
                    className="border p-2 rounded"
                />

                <button
                    type="submit"
                    className="border px-4 py-2 rounded"
                >
                    {
                        editingId !== null
                            ? "Atualizar Categoria"
                            : "Criar Categoria"
                    }
                </button>

            </form>

            <div className="grid gap-4">

                {categories.map((category) => (

                    <div
                        key={category.id}
                        className="border p-4 rounded"
                    >

                        <h2 className="font-bold">
                            {category.name}
                        </h2>

                        <p className="text-gray-500">
                            {category.slug}
                        </p>

                        <button
                            onClick={() =>
                                handleEditCategory(category)
                            }
                            className="border px-3 py-1 rounded mt-2 mr-2"
                        >
                            Editar
                        </button>

                        <button
                            onClick={() =>
                                handleDeleteCategory(category.id)
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