"use client";

import Link from "next/link";

export default function AdminSidebar() {

    return (

        <aside className="w-64 border-r p-6 flex flex-col gap-4">

            <h2 className="text-2xl font-bold mb-4">
                Admin
            </h2>

            <Link
                href="/"
                className="border p-2 rounded"
            >
                Cliente
            </Link>

            <Link
                href="/admin"
                className="border p-2 rounded"
            >
                Dashboard
            </Link>

            <Link
                href="/admin/cashier"
                className="border p-2 rounded"
            >
                Caixa
            </Link>

            <Link
                href="/admin/products"
                className="border p-2 rounded"
            >
                Produtos
            </Link>

            <Link
                href="/admin/ingredients"
                className="border p-2 rounded"
            >
                Ingredientes
            </Link>

            <Link
                href="/admin/category"
                className="border p-2 rounded"
            >
                Categorias
            </Link>

            <Link
                href="/admin/stock"
                className="border p-2 rounded"
            >
                Estoque
            </Link>

            <Link
                href="/admin/stock/history"
                className="border p-2 rounded"
            >
                Histórico de estoque
            </Link>

        </aside>
    );
}