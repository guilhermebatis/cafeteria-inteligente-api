"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

interface OrderItem {
  id: number;
  quantity: number;
  price: string;
  product: Product;
}

interface Order {
  id: number;
  total_price: string;
  items: OrderItem[];
}

export default function Home() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [order, setOrder] = useState<Order | null>(null);

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

    alert("Pedido finalizado!");
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

            <button
              onClick={() => handleAddToCart(product.id)}
              className="mt-4 border px-4 py-2 rounded"
            >
              Adicionar ao carrinho
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">
          Carrinho
        </h2>

        {order?.items.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded mb-2"
          >
            <h3>{item.product.name}</h3>

            <div className="flex items-center gap-4 mt-2">

              <button
                onClick={() =>
                  handleUpdateQuantity(
                    item.product.id,
                    item.quantity - 1
                  )
                }
                className="border px-3 py-1 rounded"
              >
                -
              </button>

              <p>{item.quantity}</p>

              <button
                onClick={() =>
                  handleUpdateQuantity(
                    item.product.id,
                    item.quantity + 1
                  )
                }
                className="border px-3 py-1 rounded"
              >
                +
              </button>

            </div>

            <p>
              Preço: R$ {item.price}
            </p>
            <button
              onClick={() => handleRemoveItem(item.product.id)}
              className="mt-2 border px-3 py-1 rounded"
            >
              Remover
            </button>

          </div>
        ))}

        <p className="font-bold mt-4">
          Total: R$ {order?.total_price}
        </p>
        <button
          onClick={handleCheckout}
          className="mt-4 border px-4 py-2 rounded"
        >
          Finalizar Pedido
        </button>
      </div>

    </main>
  );
}