import {
    Order,
    PaymentMethod,
} from "@/types/orders";

interface CartProps {
    order: Order | null;

    onUpdateQuantity: (
        productId: number,
        quantity: number
    ) => void;

    onRemoveItem: (
        productId: number
    ) => void;

    handlePayment: (
        method: PaymentMethod
    ) => void;

    handleApprovePix: () => void;

    handleApproveCard: () => void;

    cancelPayment: () => void;

    showPaymentModal: boolean;

    showPixModal: boolean;

    showCardModal: boolean;

    showPaymentSuccess: boolean;

    lastOrderId: number | null;

    openPaymentModal: () => void;

    closePaymentModal: () => void;

    onPaymentSuccessContinue: () => void;

    isLoading: boolean;

    // CUPOM
    couponCode: string;
    setCouponCode: (value: string) => void;
    applyCoupon: (code: string) => void;
    removeCoupon: () => void;
}

export default function Cart({
    order,
    onUpdateQuantity,
    onRemoveItem,
    handlePayment,
    handleApprovePix,
    handleApproveCard,
    cancelPayment,
    showPaymentModal,
    showPixModal,
    showCardModal,
    showPaymentSuccess,
    lastOrderId,
    openPaymentModal,
    closePaymentModal,
    onPaymentSuccessContinue,
    isLoading,

    // CUPOM
    couponCode,
    setCouponCode,
    applyCoupon,
    removeCoupon,
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
                            <h3>
                                {item.product.name}
                            </h3>

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

                                <p>
                                    {item.quantity}
                                </p>

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
                                Preço: R${" "}
                                {item.product.price}
                            </p>

                            <button
                                onClick={() =>
                                    onRemoveItem(
                                        item.product.id
                                    )
                                }
                                className="mt-2 border px-3 py-1 rounded"
                            >
                                Remover
                            </button>
                        </div>
                    ))}

                    {/* CUPOM */}

                    <div className="border p-4 rounded mt-6">

                        <h3 className="font-bold mb-3">
                            Cupom de desconto
                        </h3>

                        {!order.coupon ? (
                            <div className="flex gap-2">

                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) =>
                                        setCouponCode(e.target.value)
                                    }
                                    placeholder="Digite seu cupom"
                                    className="border p-2 rounded flex-1"
                                />

                                <button
                                    onClick={() =>
                                        applyCoupon(couponCode)
                                    }
                                    disabled={isLoading || !couponCode.trim()}
                                    className="border px-4 py-2 rounded"
                                >
                                    Aplicar
                                </button>

                            </div>
                        ) : (
                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="font-bold">
                                        Cupom aplicado
                                    </p>

                                    <p>
                                        Código: {order.coupon.code}
                                    </p>

                                    <p>
                                        Desconto:{" "}
                                        {order.coupon.discount_percent}%
                                    </p>
                                </div>

                                <button
                                    onClick={removeCoupon}
                                    disabled={isLoading}
                                    className="border px-4 py-2 rounded"
                                >
                                    Remover cupom
                                </button>

                            </div>
                        )}

                    </div>

                    {/* TOTAL */}

                    <p className="font-bold mt-4">
                        Total: R${" "}
                        {Number(order.total_price).toFixed(2)}
                    </p>

                    <button
                        onClick={openPaymentModal}
                        className="mt-4 border px-4 py-2 rounded"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? "Processando..."
                            : "Finalizar Pedido"}
                    </button>

                    {/* MODAL - ESCOLHER PAGAMENTO */}

                    {showPaymentModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                            <div className="bg-black p-10 rounded flex flex-col gap-4 min-w-[350px]">
                                <h2 className="text-2xl font-bold">
                                    Forma de pagamento
                                </h2>

                                <p>
                                    Total: R${" "}
                                    {Number(
                                        order.total_price
                                    ).toFixed(2)}
                                </p>

                                <button
                                    onClick={() =>
                                        handlePayment(
                                            "PIX"
                                        )
                                    }
                                    className="border p-4 rounded"
                                    disabled={isLoading}
                                >
                                    PIX
                                </button>

                                <button
                                    onClick={() =>
                                        handlePayment(
                                            "CREDIT_CARD"
                                        )
                                    }
                                    className="border p-4 rounded"
                                    disabled={isLoading}
                                >
                                    Cartão de Crédito
                                </button>

                                <button
                                    onClick={() =>
                                        handlePayment(
                                            "DEBIT_CARD"
                                        )
                                    }
                                    className="border p-4 rounded"
                                    disabled={isLoading}
                                >
                                    Cartão de Débito
                                </button>

                                <button
                                    onClick={
                                        closePaymentModal
                                    }
                                    className="border p-4 rounded"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* MODAL - PIX */}

                    {showPixModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                            <div className="bg-black p-10 rounded flex flex-col gap-4 min-w-[350px]">
                                <h2 className="text-2xl font-bold text-center">
                                    Pagamento via Pix
                                </h2>

                                <p className="text-center">
                                    Aguardando confirmação do pagamento...
                                </p>

                                <button
                                    onClick={
                                        handleApprovePix
                                    }
                                    className="border p-4 rounded"
                                    disabled={isLoading}
                                >
                                    {isLoading
                                        ? "Processando..."
                                        : "Simular pagamento aprovado"}
                                </button>

                                <button
                                    onClick={
                                        cancelPayment
                                    }
                                    className="border p-4 rounded"
                                    disabled={isLoading}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* MODAL - CARTÃO */}

                    {showCardModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                            <div className="bg-black p-10 rounded flex flex-col gap-4 min-w-[350px]">
                                <h2 className="text-2xl font-bold text-center">
                                    Pagamento via Cartão
                                </h2>

                                <p className="text-center">
                                    Aguardando confirmação do pagamento...
                                </p>

                                <button
                                    onClick={
                                        handleApproveCard
                                    }
                                    className="border p-4 rounded"
                                    disabled={isLoading}
                                >
                                    {isLoading
                                        ? "Processando..."
                                        : "Simular pagamento aprovado"}
                                </button>

                                <button
                                    onClick={
                                        cancelPayment
                                    }
                                    className="border p-4 rounded"
                                    disabled={isLoading}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* MODAL - PAGAMENTO APROVADO */}

                    {showPaymentSuccess && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                            <div className="bg-black p-10 rounded flex flex-col gap-4 min-w-[350px]">
                                <h2 className="text-2xl font-bold text-center">
                                    ✓ Pagamento aprovado
                                </h2>

                                <p className="text-center">
                                    Seu pagamento foi aprovado com sucesso.
                                </p>

                                <p className="text-center font-bold">
                                    Pedido #{lastOrderId}
                                </p>

                                <button
                                    onClick={
                                        onPaymentSuccessContinue
                                    }
                                    className="border p-4 rounded"
                                >
                                    Continuar
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}