"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Order } from "@/types/orders";
import { Product } from "@/types/products"
import { toast } from "sonner";
import { ApiError } from "@/services/api";
import OrderService from "@/services/odersService";
import { AddItemToOrder } from "@/types/orders";
import ProductService from "@/services/productService";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  async function initializeOrder() {
    try {
      try {
        const order = await OrderService.getCurrentOrder();
        setOrder(order);
        return order;
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          const order = await OrderService.createCurrentOrder();
          setOrder(order);
          return order;
        }

        throw error;
      }
    } catch (error) {
      toast.error("Erro ao inicializar pedido.");
      return null;
    }
  }

  async function fetchOrder(orderIdParam?: number) {

    const currentOrderId = orderIdParam || order?.id;

    if (!currentOrderId) return;

    try {
      const response = await OrderService.getOrderId(currentOrderId)
      setOrder({ ...response });
      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao buscar as orders.");
      }
      return

    }
  }


  async function handleAddToCart(productId: number) {

    if (order == null) {
      return
    }

    let orderId = order?.id

    const data: AddItemToOrder = {
      product_id: productId,
      quantity: 1,
    }

    try {
      await OrderService.addProductToOrder(orderId, data)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao adicionar item.");
      }
    }

    await fetchOrder();

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    toast.success("Item adicionado ao carrinho!");
  }


  async function fetchProducts() {

    try {
      const response = await ProductService.getProducts()
      setProducts(response);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao buscar produtos.");
      }
    }
  }

  useEffect(() => {
    initializeOrder()
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