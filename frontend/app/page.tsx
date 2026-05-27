"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Cart from "@/components/Cart";
import OrderHistory from "@/components/OrderHistory";
import { Product, Order } from "@/types";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [history, setHistory] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);


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

    toast.success("Item adicionado ao carrinho!");
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
    toast.success("Item removido!");
  }

  async function handleCheckout() {

    try {

      setIsLoading(true);

      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

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

      setIsLoading(false);

      toast.success("Pedido finalizado!");
    }

    catch (error) {
      setIsLoading(false);
      toast.error("Erro ao finalizar pedido.");
    }

    finally {

      setIsLoading(false);

    }
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

      <Navbar
        totalItems={
          order?.items.reduce(
            (total, item) => total + item.quantity,
            0
          ) || 0
        }
        onLogout={handleLogout}
      />


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
        isLoading={isLoading}
      />

      <OrderHistory history={history} />


    </main>
  );
}