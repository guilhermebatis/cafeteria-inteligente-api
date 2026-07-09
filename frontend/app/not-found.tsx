import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="text-center">

                <h1 className="text-7xl font-bold">
                    404
                </h1>

                <p className="mt-4 text-gray-500">
                    Página não encontrada.
                </p>

                <Link
                    href="/"
                    className="mt-6 inline-block rounded border px-5 py-2"
                >
                    Voltar para Home
                </Link>

            </div>
        </main>
    );
}