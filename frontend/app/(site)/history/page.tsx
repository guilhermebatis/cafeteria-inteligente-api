"use client";

import { useEffect, useState } from "react";
import OrderHistory from "@/components/OrderHistory";
import { Order } from "@/types/orders";
import orderService from "@/services/odersService";
import { toast } from "sonner";

export default function HistoryPage() {

    const [history, setHistory] = useState<Order[]>([]);

    async function fetchHistory() {

        try {
            const response = await orderService.setHistory()
            setHistory(response)
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao buscar historico.");
            }
        }
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
