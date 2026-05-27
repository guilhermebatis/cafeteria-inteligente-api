"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Cart from "@/components/Cart";
import OrderHistory from "@/components/OrderHistory";

export default function Home() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [history, setHistory] = useState<Order[]>([]);

  function handleLogout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("order_id");
    router.push("/login");
  }

  async function fetchOrder() {
    const token = localStorage.getItem("access");

    const orderId = localStorage.getItem("order_id");

    if (!orderId) return;

    const response = await fetch(
      `http://127.0.0.1:8000/api/orders/${orderId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    setOrder(data);
  }

  async function handleAddToCart(productId: number) {
    const token = localStorage.getItem("access");

    let orderId = localStorage.getItem("order_id");

    if (!orderId) {
      const response = await fetch(
        "http://127.0.0.1:8000/api/orders/",
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
      `http://127.0.0.1:8000/api/orders/${orderId}/add_item/`,
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
  }

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      const token = localStorage.getItem("access");
      fetchHistory();

      if (!token) return;

      const response = await fetch(
        "http://127.0.0.1:8000/api/products/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setProducts(data);
    }

    fetchProducts();

    fetchOrder();
  }, []);

  async function handleUpdateQuantity(
    productId: number,
    quantity: number
  ) {

    const token = localStorage.getItem("access");

    const orderId = localStorage.getItem("order_id");

    await fetch(
      `http://127.0.0.1:8000/api/orders/${orderId}/update_item/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: quantity,
        }),
      }
    );

    await fetchOrder();
  }

  async function handleRemoveItem(productId: number) {

    const token = localStorage.getItem("access");

    const orderId = localStorage.getItem("order_id");

    await fetch(
      `http://127.0.0.1:8000/api/orders/${orderId}/remove_item/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
        }),
      }
    );

    await fetchOrder();
  }

  async function handleCheckout() {

    const token = localStorage.getItem("access");

    const orderId = localStorage.getItem("order_id");

    await fetch(
      `http://127.0.0.1:8000/api/orders/${orderId}/checkout/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    localStorage.removeItem("order_id");

    setOrder(null);

    await fetchHistory();

    alert("Pedido finalizado!");
  }

  async function fetchHistory() {

    const token = localStorage.getItem("access");
    if (!token) return;

    const response = await fetch(
      "http://127.0.0.1:8000/api/orders/history/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    console.log(data);

    setHistory(data);

  }

  return (
    <main className="p-10">

      <button
        onClick={handleLogout}
        className="mb-6 border px-4 py-2 rounded"
      >
        Logout
      </button>

      <h1 className="text-3xl font-bold mb-6">
        Cafeteria Inteligente
      </h1>

      <div className="grid gap-4">

        {products.map((product) => (

          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />

        ))}

      </div>

      <Cart
        order={order}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <OrderHistory history={history} />


    </main>
  );
}