"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    is_available: boolean;
    category: Category;
}


export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [isAvailable, setIsAvailable] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);

    async function fetchProducts() {

        const token = localStorage.getItem('access')

        const response = await fetch(
            "http://127.0.0.1:8000/api/products/",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            toast.error("Erro ao buscar produtos");
            return;
        }

        const data = await response.json()

        setProducts(data);
    }




    async function fetchCategories() {

        const token = localStorage.getItem("access");

        const response = await fetch(
            "http://127.0.0.1:8000/api/categories/",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        setCategories(data);
    }

    useEffect(() => {

        fetchProducts();
        fetchCategories();

    }, []);

    async function handleAddProduct(e: React.FormEvent) {

        e.preventDefault();

        const token = localStorage.getItem('access')

        const response = await fetch(
            "http://127.0.0.1:8000/api/products/",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    name: name,
                    description: description,
                    price: Number(price),
                    is_available: isAvailable,
                    category_id: Number(categoryId)

                }),
            }
        );

        setName('')
        setDescription('')
        setPrice('0')
        setIsAvailable(true)


        if (response.ok) {
            toast.success('Produto criado com sucesso')
        }

        else {
            toast.error('error a criar o produto')
        }


        fetchProducts()
    }


    async function handleDeleteProduct(id: number) {

        const token = localStorage.getItem('access')

        const response = await fetch(
            `http://127.0.0.1:8000/api/products/${id}/`,

            {
                method: 'DELETE',

                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );

        if (response.ok) {
            toast.success('protudo deletado com sucesso!')
        }
        else {
            toast.error('error ao deletar o item!')
        }

        fetchProducts()
    }


    function handleEditProduct(product: Product) {

        setEditingId(product.id)

        setName(product.name)

        setDescription(product.description)

        setPrice(product.price)

        setIsAvailable(product.is_available)

        setCategoryId(
            String(product.category.id)
        )

    }

    async function handleUpdateProduct(e: React.FormEvent) {
        e.preventDefault();

        const token = localStorage.getItem('access')

        const response = await fetch(
            `http://127.0.0.1:8000/api/products/${editingId}/`,

            {
                method: 'PATCH',

                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    name,
                    description,
                    price: Number(price),
                    is_available: isAvailable,
                    category_id: Number(categoryId),
                }),

            }

        );

        if (response.ok) {
            toast('produto atualizado com sucesso!')

            setEditingId(null);

            setName(""),
                setDescription(""),
                setPrice('0'),
                setIsAvailable(true),
                setCategoryId("")
            fetchProducts()
        }

        else {
            toast.error('error ao atualizar o protudo')
        }
    }



    return (
        <main className="p-10">

            <Toaster />

            <h1 className="text-3xl font-bold mb-6">
                Produtos
            </h1>

            <form
                onSubmit={
                    editingId
                        ? handleUpdateProduct
                        : handleAddProduct
                }
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

                <textarea
                    placeholder="Descrição"
                    value={description}
                    onChange={(e) =>
                        setDescription(e.target.value)
                    }
                    className="border p-2 rounded"
                />

                <input
                    type="number"
                    placeholder="Preço"
                    value={price}
                    onChange={(e) =>
                        setPrice(e.target.value)
                    }
                    className="border p-2 rounded"
                />

                <select
                    value={categoryId}
                    onChange={(e) =>
                        setCategoryId(e.target.value)
                    }
                    className="border p-2 rounded"
                >

                    <option value="">
                        Selecione uma categoria
                    </option>

                    {categories.map((category) => (

                        <option
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </option>

                    ))}

                </select>

                <label className="flex gap-2">

                    <input
                        type="checkbox"
                        checked={isAvailable}
                        onChange={(e) =>
                            setIsAvailable(
                                e.target.checked
                            )
                        }
                    />

                    Disponível

                </label>

                <button
                    type="submit"
                    className="border px-4 py-2 rounded"
                >
                    {editingId
                        ? "Atualizar Produto"
                        : "Criar Produto"}
                </button>

            </form>

            <div className="grid gap-4">

                {products.map((product) => (

                    <div
                        key={product.id}
                        className="border p-4 rounded"
                    >

                        <h2 className="font-bold">
                            {product.name}
                        </h2>

                        <p>
                            {product.description}
                        </p>

                        <p>
                            R$ {product.price}
                        </p>

                        <p>
                            Categoria:
                            {" "}
                            {product.category.name}
                        </p>

                        <div className="flex gap-2 mt-4">

                            <button
                                onClick={() =>
                                    handleEditProduct(product)
                                }
                                className="border px-3 py-1 rounded"
                            >
                                Editar
                            </button>

                            <button
                                onClick={() =>
                                    handleDeleteProduct(product.id)
                                }
                                className="border px-3 py-1 rounded"
                            >
                                Remover
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </main>
    );

}