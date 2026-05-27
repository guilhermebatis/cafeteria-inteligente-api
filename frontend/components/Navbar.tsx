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

                <p>
                    Carrinho: {totalItems}
                </p>

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