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

interface CartProps {
    order: Order | null;

    onUpdateQuantity: (
        productId: number,
        quantity: number
    ) => void;

    onRemoveItem: (
        productId: number
    ) => void;

    onCheckout: () => void;
}

export default function Cart({
    order,
    onUpdateQuantity,
    onRemoveItem,
    onCheckout,
}: CartProps) {

    return (
        <div className="mt-10">

            <h2 className="text-2xl font-bold mb-4">
                Carrinho
            </h2>

            {!order ? (
                <p>Carrinho vazio</p>
            ) : (
                <>
                    {order.items.map((item) => (

                        <div
                            key={item.id}
                            className="border p-4 rounded mb-2"
                        >

                            <h3>{item.product.name}</h3>

                            <div className="flex items-center gap-4 mt-2">

                                <button
                                    onClick={() =>
                                        onUpdateQuantity(
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
                                        onUpdateQuantity(
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
                                onClick={() =>
                                    onRemoveItem(item.product.id)
                                }
                                className="mt-2 border px-3 py-1 rounded"
                            >
                                Remover
                            </button>

                        </div>

                    ))}

                    <p className="font-bold mt-4">
                        Total: R$ {order.total_price}
                    </p>

                    <button
                        onClick={onCheckout}
                        className="mt-4 border px-4 py-2 rounded"
                    >
                        Finalizar Pedido
                    </button>
                </>
            )}

        </div>
    );
}