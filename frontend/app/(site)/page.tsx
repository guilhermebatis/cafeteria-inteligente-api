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
import { Category } from "@/types/categories";
import CategoryServices from "@/services/categoryService";


export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);


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


  async function fetchProducts(search?: string, category?: number) {

    try {
      const response = await ProductService.getProducts(search, category)
      setProducts(response);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao buscar produtos.");
      }
    }
  }

  async function fetchCategories() {
    try {
      const response = await CategoryServices.getCategory()
      setCategories(response)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao buscar categorias.");
      }
    }
  }

  useEffect(() => {
    initializeOrder()
    fetchOrder();
    fetchProducts()
    fetchCategories()
  }, []);

  useEffect(() => {
    fetchProducts(search, selectedCategory ?? undefined);
  }, [search, selectedCategory]);

  return (
    <main className="p-10">

      {/* Pesquisa */}
      <div className="w-full flex justify-center mb-8">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar produto..."
          className="
      w-full
      max-w-2xl
      px-4
      py-3
      rounded-lg
      border
      border-gray-700
      bg-gray-900
      text-white
      placeholder-gray-400
      outline-none
      focus:border-white
    "
        />
      </div>


      {/* Categorias */}

      <div className="flex justify-center gap-3 overflow-x-auto pb-2 mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition ${selectedCategory === null
            ? "bg-black text-white"
            : "border hover:bg-gray-100"
            }`}
        >
          Todos
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition ${selectedCategory === category.id
              ? "bg-black text-white"
              : "border hover:bg-gray-100"
              }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Produtos */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

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