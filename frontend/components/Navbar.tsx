import Link from "next/link";

interface NavbarProps {
    totalItems: number;
    onLogout: () => void;
}

export default function Navbar({
    totalItems,
    onLogout,
}: NavbarProps) {

    return (
        <div className="flex items-center justify-between mb-10">

            <h1 className="text-3xl font-bold">
                Cafeteria Inteligente
            </h1>



            <div className="flex items-center gap-4">
                <Link
                    href="/"
                    className="border px-4 py-2 rounded"
                >
                    Home
                </Link>


                <Link
                    href="/cart"
                    className="border px-4 py-2 rounded"
                >
                    Carrinho ({totalItems})
                </Link>

                <Link
                    href="/history"
                    className="border px-4 py-2 rounded"
                >
                    Histórico
                </Link>

                <button
                    onClick={onLogout}
                    className="border px-4 py-2 rounded"
                >
                    Logout
                </button>

            </div>

        </div>
    );
}