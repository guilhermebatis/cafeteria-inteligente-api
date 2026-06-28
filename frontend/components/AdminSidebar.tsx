"use client";

import Link from "next/link";
import { toast } from "sonner";

export default function AdminSidebar() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    async function handleSalesReport() {

        const token = localStorage.getItem('access')

        const response = await fetch(
            `${API_URL}/api/orders/sales_report_pdf/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        )

        if (response.ok) {
            const pdf = await response.blob()
            const url = URL.createObjectURL(pdf)
            const link = document.createElement("a")
            document.body.appendChild(link);
            link.href = url
            link.download = "sales_report.pdf"
            link.click()
            link.remove();
            URL.revokeObjectURL(url);
        } else {
            toast.error('error ao fazer download no relatorio de vendas')
            return
        }
    }

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

            <Link
                href="/admin/users"
                className="border p-2 rounded"
            >
                Usuario
            </Link>

            <Link
                href="/admin/customers"
                className="border p-2 rounded"
            >
                Clientes
            </Link>

            <button
                onClick={handleSalesReport}
                className="border p-2 rounded text-left cursor-pointer"
            >
                Relatório de vendas
            </button>

        </aside>
    );
}