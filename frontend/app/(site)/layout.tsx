"use client";
import NavbarProvider from "@/components/LayoutClient";


export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {


    return (
        <main className="flex flex-col min-h-screen">
            <NavbarProvider>
                <div className="flex-1 p-10">
                    {children}
                </div>
            </NavbarProvider>
        </main>
    );
}