import { Order } from "@/types/orders";

interface OrderHistoryProps {
    history: Order[];
}

export default function OrderHistory({
    history,
}: OrderHistoryProps) {

    const sortedHistory = [...history].sort(
        (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
    );

    return (
        <div className="mt-10">

            <h2 className="text-2xl font-bold mb-4">
                Histórico de Pedidos
            </h2>

            {sortedHistory.map((order) => (

                <div
                    key={order.id}
                    className="border p-4 rounded mb-4"
                >

                    <div className="flex justify-between items-start">

                        <div>
                            <h3 className="font-bold">
                                Pedido #{order.id}
                            </h3>

                            <p className="text-sm text-gray-500">
                                {new Date(
                                    order.created_at
                                ).toLocaleString("pt-BR")}
                            </p>
                        </div>

                    </div>

                    {order.items.map((item) => (

                        <div
                            key={item.id}
                            className="mt-3"
                        >

                            <p>
                                {item.product.name}
                            </p>

                            <p>
                                Quantidade: {item.quantity}
                            </p>

                            <p>
                                Preço: R$ {item.product.price}
                            </p>

                        </div>

                    ))}

                    <p className="font-bold mt-4">
                        Total: R$ {order.total_price}
                    </p>

                </div>

            ))}

        </div>
    );
}