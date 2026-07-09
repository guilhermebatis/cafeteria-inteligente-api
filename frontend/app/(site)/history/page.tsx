"use client";

import { useEffect, useState } from "react";
import OrderHistory from "@/components/OrderHistory";
import { Order } from "@/types";

export default function HistoryPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    const [history, setHistory] = useState<Order[]>([]);

    async function fetchHistory() {

        const token = localStorage.getItem("access");

        if (!token) return;

        const response = await fetch(
            `${API_URL}/api/orders/history/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        setHistory(data);
    }

    useEffect(() => {

        fetchHistory();

    }, []);

    return (

        <main className="p-10">

            <OrderHistory history={history} />

        </main>
    );
}
