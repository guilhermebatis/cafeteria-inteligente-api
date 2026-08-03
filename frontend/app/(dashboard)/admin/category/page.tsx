"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Category, CreateCategory, UpdateCategory } from "@/types/categories";
import CategoryServices from "@/services/categoryService";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [name, setName] = useState("")
    const [slug, setSlug] = useState("")

    function generateSlug(value: string) {
        return value
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9_-]/g, "");
    }

    function resetForm() {
        setEditingId(null);
        setName("");
        setSlug("");
    }

    async function fetchCategory() {
        try {
            const response = await CategoryServices.getCategory()
            setCategories(response);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro inesperado.");
            }
        }
    }

    useEffect(() => {

        fetchCategory();

    }, []);

    async function handleAddCategory(e: React.FormEvent) {
        e.preventDefault()

        const data: CreateCategory = {
            name,
            slug
        }

        try {
            await CategoryServices.createCategory(data)

            toast.success('categoria criada com sucesso')

            await fetchCategory()

            resetForm()

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro inesperado.");
            }

        }

    }

    async function handleDeleteCategory(id: number) {

        if (id === null) {
            return
        }

        try {
            await CategoryServices.deleteCategory(id)
            toast.success('categoria deletada com sucesso')
            await fetchCategory()

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro inesperado.");
            }
        }
    }


    function handleEditCategory(category: Category) {

        setEditingId(category.id)
        setName(category.name)
        setSlug(category.slug)
    }

    async function handleUpdateCategory(e: React.FormEvent) {
        e.preventDefault();

        if (editingId === null) {
            return;
        }

        const data: UpdateCategory = {
            name,
            slug
        }

        try {
            await CategoryServices.updateCategory(editingId, data)
            toast.success('categoria atualizada com sucesso')
            resetForm()
            await fetchCategory()
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
                        setSlug(generateSlug(e.target.value))
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