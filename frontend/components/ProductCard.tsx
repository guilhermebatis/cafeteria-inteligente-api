import { Product } from "@/types/products";

interface ProductCardProps {
    product: Product;
    onAddToCart: (productId: number) => void;
}

export default function ProductCard({
    product,
    onAddToCart,
}: ProductCardProps) {
    return (
        <div className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-zinc-600 hover:shadow-xl">

            {/* Imagem */}
            <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Categoria */}
                <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {product.category.name}
                </span>
            </div>

            {/* Conteúdo */}
            <div className="p-5">

                <h2 className="text-lg font-semibold text-white">
                    {product.name}
                </h2>

                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">
                    {product.description}
                </p>

                {/* Preço + botão */}
                <div className="mt-5 flex items-center justify-between gap-3">

                    <span className="text-xl font-bold text-white">
                        R$ {Number(product.price).toFixed(2)}
                    </span>

                    <button
                        onClick={() => onAddToCart(product.id)}
                        className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-all hover:bg-zinc-200 active:scale-95"
                    >
                        + Adicionar
                    </button>

                </div>
            </div>
        </div>
    );
}