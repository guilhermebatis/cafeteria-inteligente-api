"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import ProductService from "@/services/productService";
import CategoryService from '@/services/categoryService'
import IngredientsService from '@/services/ingredientsService'
import { Product, UpdateProduct, CreateProduct, UpdateIngredient } from '@/types/products';
import { Category } from '@/types/categories'
import { Ingredient } from "@/types/ingredients";


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
    const [image, setImage] = useState<File | null>(null);


    function resetForm() {
        setName('')
        setDescription('')
        setCategoryId('')
        setBarcode('')
        setPrice('')
        setIsAvailable(true)
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

    async function fetchProducts() {
        try {
            const response = await ProductService.getProducts()

            setProducts(response);

            return response;
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro inesperado.");
            }
            return [];

        }
    }


    async function fetchCategories() {
        try {
            const response = await CategoryService.getCategory()

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

        fetchProducts();
        fetchCategories();
        fetchIngredients();

    }, []);

    async function handleAddProduct(e: React.FormEvent) {

        e.preventDefault();

        const formData = new FormData();

        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("is_available", String(isAvailable));
        formData.append("category_id", categoryId);
        formData.append("barcode", barcode);
        if (image) {
            formData.append("image", image);
        }

        try {
            await ProductService.createProduct(formData)

            toast.success('new product create')

            resetForm()

            await fetchProducts()
        }
        catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro inesperado.");
            }
        }
    }


    async function handleDeleteProduct(id: number) {
        try {
            await ProductService.deleteProduct(id)

            toast.success('produto excluido')
            await fetchProducts()
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro inesperado.");
            }
        }
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

        if (editingId === null) {
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("is_available", String(isAvailable));
        formData.append("category_id", categoryId);
        formData.append("barcode", barcode);
        if (image) {
            formData.append("image", image);
        }

        try {
            await ProductService.updateProduct(editingId, formData)

            setEditingId(null);

            resetForm()

            toast.success("Produto atualizado com sucesso!");

            await fetchProducts()
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro inesperado.");
            }
        }
    }

    async function handleUpdateIngredient() {

        if (!selectedProduct || editingIngredientId === null) {
            return;
        }
        const data: UpdateIngredient = {
            ingredient_id: editingIngredientId,
            quantity: Number(editingQuantity)

        }
        try {
            await ProductService.updateIngredient(selectedProduct.id, data)

            const updateProducts = await fetchProducts();


            const updatedProduct =
                updateProducts.find(
                    (product: Product) =>
                        product.id ===
                        selectedProduct.id);

            if (!updatedProduct) {
                toast.error("Produto não encontrado.");
                return;
            }

            setSelectedProduct(updatedProduct);

            setEditingIngredientId(null);

            setEditingQuantity("");

            toast.success("Ingrediente atualizado com sucesso!");

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro inesperado.");
            }
        }
    }

    async function handleAddIngredientToProduct(e: React.FormEvent) {

        e.preventDefault();

        if (!selectedProduct || ingredientId === null) {
            return;
        }

        const data: UpdateIngredient = {
            ingredient_id: Number(ingredientId),
            quantity: Number(ingredientQuantity)
        }

        try {
            await ProductService.addIngredient(selectedProduct.id, data)

            setIngredientId("");
            setIngredientQuantity("");

            const updatedProducts = await fetchProducts();

            const updatedProduct = updatedProducts.find(
                (product: Product) =>
                    product.id === selectedProduct.id
            );
            if (!updatedProduct) {
                toast.error("Produto não encontrado.");

                return;
            }
            setSelectedProduct(updatedProduct);

            toast.success("Ingrediente adicionado com sucesso!");

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro inesperado.");
            }
        }


    }

    async function handleRemoveIngredient(
        ingredientId: number
    ) {

        if (!selectedProduct) {
            return;
        }

        try {
            await ProductService.deleteIngredient(
                selectedProduct.id,
                {
                    ingredient_id: ingredientId,
                }
            )

            toast.success("Ingrediente removido!");

            const updatedProducts =
                await fetchProducts();

            const updatedProduct =
                updatedProducts.find(
                    (product: Product) =>
                        product.id === selectedProduct.id
                );
            if (!updatedProduct) {
                toast.error("Produto não encontrado.");

                return;
            }

            setSelectedProduct(updatedProduct);
        }

        catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro inesperado.");
            }
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

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        setImage(e.target.files?.[0] || null);
                    }}
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