"use client";
import { useEffect, useState } from "react";

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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const token = localStorage.getItem("access");
      const response = await fetch("http://127.0.0.1:8000/api/products/", {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      const data = await response.json();
      console.log(data);
      setProducts(data);
    }

    fetchProducts();
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Cafeteria Inteligente
      </h1>

      <div className="grid gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border p-4 rounded-lg"
          >
            <h2 className="text-xl font-semibold">
              {product.name}
            </h2>

            <p>{product.description}</p>

            <p className="font-bold mt-2">
              R$ {product.price}
            </p>

            <p>
              Categoria: {product.category.name}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}