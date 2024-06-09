import "./globals.css";

import { Inter, Roboto_Mono } from "next/font/google";

import Header from "@/components/header";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Primal To Dual Converter",
    description: "An applet made to convert an LP from it's primal form to it's dual form",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={clsx(inter.className, "")}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange>
                    <Header />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
