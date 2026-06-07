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
    ingredients: ProductIngredient[];
    barcode: string;
}

interface Ingredient {
    id: number;
    name: string;
    unit: string;
}

interface ProductIngredient {
    ingredient: Ingredient;
    quantity: string;
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
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [selectedProduct, setSelectedProduct] =
        useState<Product | null>(null);
    const [ingredientId, setIngredientId] = useState("");
    const [ingredientQuantity, setIngredientQuantity] =
        useState("");
    const [editingIngredientId, setEditingIngredientId] =
        useState<number | null>(null);
    const [editingQuantity, setEditingQuantity] =
        useState("");
    const [barcode, setBarcode] = useState("");

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
            return [];
        }

        const data = await response.json()

        setProducts(data);

        return data || [];
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
        fetchIngredients();

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
                    category_id: Number(categoryId),
                    barcode: barcode

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

        setBarcode(product.barcode)

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
                    barcode: barcode
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

    async function handleUpdateIngredient() {

        if (!selectedProduct) {
            return;
        }

        const token = localStorage.getItem('access')

        const response = await fetch(
            `http://127.0.0.1:8000/api/products/${selectedProduct.id}/update_ingredient/`,

            {
                method: 'PATCH',

                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    ingredient_id: editingIngredientId,
                    quantity: Number(editingQuantity)
                }),
            }

        );

        if (response.ok) {
            toast.success("Ingrediente atualizado!");

            const updateProducts = await fetchProducts();
            const updatedProduct =
                updateProducts.find(
                    (product: Product) =>
                        product.id ===
                        selectedProduct.id);

            setSelectedProduct(updatedProduct);

            setEditingIngredientId(null);

            setEditingQuantity("");
        }

        else {
            toast.error("Erro ao atualizar ingrediente")
        }
    }

    async function handleAddIngredientToProduct(e: React.FormEvent) {

        e.preventDefault();

        if (!selectedProduct) return;

        const token = localStorage.getItem('access');

        const response = await fetch(
            `http://127.0.0.1:8000/api/products/${selectedProduct.id}/add_ingredient/`,

            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    ingredient_id: Number(ingredientId),
                    quantity: Number(ingredientQuantity),
                }),

            }
        );

        if (response.ok) {
            toast.success("Ingrediente adicionado!");

            setIngredientId("");
            setIngredientQuantity("");

            const updatedProducts = await fetchProducts();

            const updatedProduct = updatedProducts.find(
                (product: Product) =>
                    product.id === selectedProduct.id
            );

            setSelectedProduct(updatedProduct);
        }

        else {
            toast.error("Erro ao adicionar ingrediente");
        }

    }

    async function handleRemoveIngredient(
        ingredientId: number
    ) {

        if (!selectedProduct) {
            return;
        }

        const token = localStorage.getItem('access');

        const response = await fetch(
            `http://127.0.0.1:8000/api/products/${selectedProduct.id}/remove_ingredient/`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    ingredient_id: ingredientId,
                }),
            }
        );

        if (response.ok) {

            toast.success("Ingrediente removido!");

            const updatedProducts =
                await fetchProducts();

            const updatedProduct =
                updatedProducts.find(
                    (product: Product) =>
                        product.id === selectedProduct.id
                );

            setSelectedProduct(updatedProduct);

        } else {

            toast.error(
                "Erro ao remover ingrediente"
            );

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

                <input
                    type="text"
                    placeholder="Código de barras"
                    value={barcode}
                    onChange={(e) =>
                        setBarcode(e.target.value)
                    }
                    className="border p-2 rounded"
                />

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

                        <p>
                            Código: {product.barcode}
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

                            <button
                                onClick={() =>
                                    setSelectedProduct(product)
                                }
                                className="border px-3 py-1 rounded"
                            >
                                Ingredientes
                            </button>

                        </div>

                    </div>

                ))}

                {selectedProduct && (

                    <div className="mt-10 border p-4 rounded">

                        <h2 className="text-2xl font-bold mb-4">
                            Ingredientes de:
                            {" "}
                            {selectedProduct.name}
                        </h2>

                        <form
                            onSubmit={handleAddIngredientToProduct}
                            className="flex flex-col gap-4"
                        >

                            <select
                                value={ingredientId}
                                onChange={(e) =>
                                    setIngredientId(e.target.value)
                                }
                                className="border p-2 rounded"
                            >

                                <option value="">
                                    Selecione ingrediente
                                </option>

                                {ingredients.map((ingredient) => (

                                    <option
                                        key={ingredient.id}
                                        value={ingredient.id}
                                    >
                                        {ingredient.name}
                                    </option>

                                ))}

                            </select>

                            <input
                                type="number"
                                placeholder="Quantidade"
                                value={ingredientQuantity}
                                onChange={(e) =>
                                    setIngredientQuantity(
                                        e.target.value
                                    )
                                }
                                className="border p-2 rounded"
                            />

                            <button
                                type="submit"
                                className="border px-4 py-2 rounded"
                            >
                                Adicionar Ingrediente
                            </button>

                        </form>

                        <div className="mt-6">

                            <h3 className="font-bold mb-2">
                                Receita do produto
                            </h3>

                            {selectedProduct.ingredients.length === 0 ? (

                                <p>
                                    Nenhum ingrediente adicionado
                                </p>

                            ) : (

                                <div className="flex flex-col gap-2">

                                    {selectedProduct.ingredients.map((item) => (

                                        <div
                                            key={item.ingredient.id}
                                            className="border p-2 rounded flex justify-between"
                                        >

                                            <span>
                                                {item.ingredient.name}
                                            </span>

                                            <span>
                                                {item.quantity}
                                                {" "}
                                                {item.ingredient.unit}
                                            </span>

                                            <button
                                                onClick={() => {

                                                    setEditingIngredientId(
                                                        item.ingredient.id
                                                    );

                                                    setEditingQuantity(
                                                        item.quantity
                                                    );
                                                }}

                                                className="border px-2 py-1 rounded"
                                            >
                                                Editar
                                            </button>

                                            {editingIngredientId ===
                                                item.ingredient.id && (

                                                    <div className="flex gap-2 mt-2">

                                                        <input
                                                            type="number"

                                                            value={editingQuantity}

                                                            onChange={(e) =>
                                                                setEditingQuantity(
                                                                    e.target.value
                                                                )
                                                            }

                                                            className="border p-1 rounded"
                                                        />

                                                        <button
                                                            onClick={
                                                                handleUpdateIngredient
                                                            }

                                                            className="border px-2 py-1 rounded"
                                                        >
                                                            Salvar
                                                        </button>

                                                    </div>
                                                )}

                                            <button
                                                onClick={() =>
                                                    handleRemoveIngredient(
                                                        item.ingredient.id
                                                    )
                                                }
                                                className="border px-2 py-1 rounded"
                                            >
                                                Remover
                                            </button>




                                        </div>



                                    ))}

                                </div>

                            )}

                        </div>

                    </div>
                )}

            </div>



        </main>
    );

}