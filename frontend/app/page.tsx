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
      const response = await fetch("http://127.0.0.1:8000/api/products/", {
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc5MTQzMzQxLCJpYXQiOjE3NzkxMzk3NDEsImp0aSI6ImQ3ZGMyNDc0NDQ3ZTRlZDJhMDA5OThiZmRhZjNjMjVhIiwidXNlcl9pZCI6IjEifQ.gkXAuWUXgizHgoE2AHmlSFrBDAxvA_OMZ-q1GRxW6iA",
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