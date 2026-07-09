"use client";

import NavbarProvider from "@/components/LayoutClient";

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NavbarProvider>
            {children}
        </NavbarProvider>
    );
}