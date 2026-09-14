"use client";
import mlService from "@/services/mlService";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { MlPrediction } from "@/types/ml";
import { Product } from "@/types/products";
import ProductService from "@/services/productService";

export default function MlPredictionPage() {
    const [productName, setProductName] = useState("");
    const [prediction, setPrediction] = useState<MlPrediction>();
    const [products, setProducts] = useState<Product[]>([]);

    async function handlePredict() {
        try {
            const response = await mlService.getPrediction(productName);
            setPrediction(response);
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
            const data = await ProductService.getProducts();
            setProducts(data);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro inesperado.");
            }
        }

    }

    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold">
                Previsão de vendas
            </h1>

            <div className="mt-6 flex gap-2">
                <select
                    value={productName}
                    onChange={(event) => setProductName(event.target.value)}
                    className="rounded border px-3 py-2"
                >
                    <option value="">Selecione um produto</option>

                    {products.map((product) => (
                        <option key={product.id} value={product.name}>
                            {product.name}
                        </option>
                    ))}
                </select>

                <button
                    type="button"
                    onClick={handlePredict}
                    className="rounded bg-black px-4 py-2 text-white"
                >
                    Prever
                </button>
            </div>

            {prediction && (
                <div className="mt-6">
                    <p>
                        Produto: {prediction.product}
                    </p>

                    <p>
                        Previsão: {prediction.prediction}
                    </p>
                </div>
            )}
        </main>
    );
}