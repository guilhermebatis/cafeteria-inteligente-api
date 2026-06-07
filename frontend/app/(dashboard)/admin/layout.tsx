import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (

        <main className="flex min-h-screen">

            <AdminSidebar />

            <div className="flex-1 p-10">

                {children}

            </div>

        </main>

    );
}