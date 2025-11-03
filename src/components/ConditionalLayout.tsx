import React from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const isDappRoute = location.pathname.startsWith('/app');

    return (
        <>
            {!isDappRoute && <Header />}
            <main className="w-full relative isolate overflow-hidden">
                {children}
            </main>
            {!isDappRoute && <Footer />}
        </>
    );
}



