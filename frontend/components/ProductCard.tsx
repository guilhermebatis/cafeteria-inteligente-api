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

interface ProductCardProps {
    product: Product;
    onAddToCart: (productId: number) => void;
}

export default function ProductCard({
    product,
    onAddToCart,
}: ProductCardProps) {

    return (
        <div className="border p-4 rounded-lg">

            <h2 className="text-xl font-semibold">
                {product.name}
            </h2>

            <p>{product.description}</p>

            <p className="font-bold mt-2">
                R$ {product.price}
            </p>

            <p>
                Categoria: {product.category.name}
            </p>

            <button
                onClick={() => onAddToCart(product.id)}
                className="mt-4 border px-4 py-2 rounded"
            >
                Adicionar ao carrinho
            </button>

        </div>
    );
}