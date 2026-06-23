"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function AdminPage() {

    const [productsCount, setProductsCount] = useState(0);
    const [ingredientsCount, setIngredientsCount] = useState(0);
    const [lowStockIngredients, setLowStockIngredients] = useState<any[]>([]);
    const router = useRouter();
    const [stats, setStats] = useState({
        orders_count: 0,
        total_revenue: 0,
        average_ticket: 0,
    });
    const [customersCount, setCustomersCount] = useState(0);
    const [topProducts, setTopProducts] = useState<any[]>([]);
    const [topCustomers, setTopCustomers] = useState<any[]>([]);
    const [salesByDay, setSalesByDay] = useState<any[]>([]);

    async function fetchDashboardData() {
        try {
            const isStaff = localStorage.getItem("is_staff");
            if (isStaff !== "true") { router.push("/"); }

            const token = localStorage.getItem("access");

            const productsResponse = await fetch(
                "http://127.0.0.1:8000/api/products/",

                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const igredientsresponse = await fetch(
                "http://127.0.0.1:8000/api/ingredients/",

                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const statusresponse = await fetch(
                "http://127.0.0.1:8000/api/orders/stats/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            )

            const cumoserstatus = await fetch(
                "http://127.0.0.1:8000/api/customers/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,

                    }
                }
            )

            const topProductsResponse = await fetch(
                "http://127.0.0.1:8000/api/products/top_selling/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            )

            const TopCustomerResponse = await fetch(
                "http://127.0.0.1:8000/api/customers/top_customers/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }

            )

            const salesResponse = await fetch(
                "http://127.0.0.1:8000/api/orders/sales_by_day/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            )


            const productsData = await productsResponse.json();
            const ingredientsData = await igredientsresponse.json();
            const statsData = await statusresponse.json()
            const cumoserData = await cumoserstatus.json()
            const topProducts = await topProductsResponse.json()
            const topCustomers = await TopCustomerResponse.json()
            const salesData = await salesResponse.json();

            setProductsCount(productsData.length);
            setIngredientsCount(ingredientsData.length);
            setStats(statsData)
            setCustomersCount(cumoserData.length)
            setTopProducts(topProducts)
            setTopCustomers(topCustomers)
            setSalesByDay(salesData);

            const lowStock = ingredientsData.filter(
                (ingredient: any) =>
                    ingredient.stock_quantity < ingredient.minimum_stock);

            setLowStockIngredients(lowStock);

        } catch (error) {

            console.error("Erro ao buscar dashboard:", error);

        }


    }

    useEffect(() => {

        const token = localStorage.getItem("access");

        if (!token) {
            router.push("/login");
            return;
        }


    }, []);

    useEffect(() => {

        fetchDashboardData();

    }, []);





    return (

        <main className="flex min-h-screen">



            <div className="flex-1 p-10">

                <h1 className="text-4xl font-bold mb-10">
                    Painel Admin
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

                    <div className="border rounded-lg p-4">
                        <h3 className="text-sm text-gray-500">
                            Receita Total
                        </h3>

                        <p className="text-3xl font-bold">
                            R$ {Number(stats.total_revenue).toFixed(2)}
                        </p>
                    </div>

                    <div className="border rounded-lg p-4">
                        <h3 className="text-sm text-gray-500">
                            Pedidos
                        </h3>

                        <p className="text-3xl font-bold">
                            {stats.orders_count}
                        </p>
                    </div>

                    <div className="border rounded-lg p-4">
                        <h3 className="text-sm text-gray-500">
                            Ticket Médio
                        </h3>

                        <p className="text-3xl font-bold">
                            R$ {Number(stats.average_ticket).toFixed(2)}
                        </p>
                    </div>

                </div>

                <div className="border rounded-lg p-4 mb-8 mt-8">

                    <h2 className="text-xl font-bold mb-4">
                        Produtos Mais Vendidos
                    </h2>

                    <div className="space-y-2">

                        {topProducts.map((product) => (

                            <div
                                key={product.id}
                                className="flex justify-between"
                            >

                                <span>
                                    {product.name}
                                </span>

                                <span>
                                    {product.total_sold} vendas
                                </span>

                            </div>

                        ))}

                    </div>

                </div>

                <div className="border rounded-lg p-4 mt-8 mb-8">

                    <h2 className="text-xl font-bold mb-4">
                        Receita por Dia
                    </h2>

                    <ResponsiveContainer
                        width="100%"
                        height={300}
                    >

                        <LineChart data={salesByDay}>

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="date_only"
                                tickFormatter={(value) =>
                                    new Date(value).toLocaleDateString("pt-BR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                    })
                                } />

                            <YAxis />

                            <Tooltip />

                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#8884d8"
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

                <div className="border rounded-lg p-4 mb-8">
                    <h3 className="text-sm text-gray-500">
                        Clientes
                    </h3>

                    <p className="text-3xl font-bold">
                        {customersCount}
                    </p>
                </div>

                <div className="border rounded-lg p-4 mt-8 mb-8">

                    <h2 className="text-xl font-bold mb-4">
                        Top Clientes
                    </h2>

                    <div className="space-y-2">

                        {topCustomers.map((customer) => (

                            <div
                                key={customer.id}
                                className="flex justify-between"
                            >

                                <span>
                                    {customer.name}
                                </span>

                                <span>
                                    R$ {Number(customer.total_spent).toFixed(2)}
                                </span>

                            </div>

                        ))}

                    </div>

                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">

                    <div className="border p-6 rounded">

                        <h2 className="text-xl font-bold">
                            Produtos
                        </h2>

                        <p className="text-3xl">
                            {productsCount}
                        </p>

                    </div>

                    <div className="border p-6 rounded">

                        <h2 className="text-xl font-bold">
                            Ingredientes
                        </h2>

                        <p className="text-3xl">
                            {ingredientsCount}
                        </p>

                    </div>

                </div>

                <div className="border p-6 rounded">

                    <h2 className="text-2xl font-bold mb-4">
                        Estoque Baixo
                    </h2>

                    {lowStockIngredients.length === 0 ? (

                        <p>
                            Nenhum item com estoque baixo
                        </p>

                    ) : (

                        <div className="flex flex-col gap-2">

                            {lowStockIngredients.map(
                                (ingredient) => (

                                    <div
                                        key={ingredient.id}
                                        className="border p-2 rounded"
                                    >

                                        {ingredient.name}
                                        {" — "}
                                        {ingredient.stock_quantity}
                                        {" "}
                                        {ingredient.unit}

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>

        </main>
    );
}
