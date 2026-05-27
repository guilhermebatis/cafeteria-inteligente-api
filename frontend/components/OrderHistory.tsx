import { Order } from "@/types";

interface OrderHistoryProps {
    history: Order[];
}

export default function OrderHistory({
    history,
}: OrderHistoryProps) {

    return (
        <div className="mt-10">

            <h2 className="text-2xl font-bold mb-4">
                Histórico de Pedidos
            </h2>

            {history.map((order) => (

                <div
                    key={order.id}
                    className="border p-4 rounded mb-4"
                >

                    <h3 className="font-bold">
                        Pedido #{order.id}
                    </h3>

                    {order.items.map((item) => (

                        <div
                            key={item.id}
                            className="mt-2"
                        >

                            <p>
                                {item.product.name}
                            </p>

                            <p>
                                Quantidade: {item.quantity}
                            </p>

                            <p>
                                Preço: R$ {item.price}
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