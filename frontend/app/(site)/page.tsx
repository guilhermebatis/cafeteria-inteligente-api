"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { Product, Order } from "@/types";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

export default function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [history, setHistory] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchOrder() {
    const token = localStorage.getItem("access");

    const orderId = localStorage.getItem("order_id");

    if (!orderId) return;

    const response = await fetch(
      `${API_URL}/api/orders/${orderId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    console.log(data)

    setOrder(data);
  }

  async function handleAddToCart(productId: number) {
    const token = localStorage.getItem("access");

    let orderId = localStorage.getItem("order_id");

    if (!orderId) {
      const response = await fetch(
        `${API_URL}/api/orders/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      orderId = String(data.id);

      localStorage.setItem("order_id", orderId);
    }

    await fetch(
      `${API_URL}/api/orders/${orderId}/add_item/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: 1,
        }),
      }
    );

    await fetchOrder();

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    toast.success("Item adicionado ao carrinho!");
  }


  async function fetchProducts() {
    const token = localStorage.getItem("access");

    const response = await fetch(
      `${API_URL}/api/products/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    setProducts(data);
  }


  useEffect(() => {
    const token = localStorage.getItem("access");
    fetchOrder();
    fetchProducts()
  }, []);

  return (
    <main className="p-10">


      <div className="grid gap-4">

        {Array.isArray(products) &&
          products.map((product) => (

            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />

          ))}

      </div>

    </main>
  );
}