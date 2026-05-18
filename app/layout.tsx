import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

const geistSans = GeistSans({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "MindOS - Sistema de Pensamiento Asistido",
  description: "Espacio de trabajo completo, privado y auto-soberano para tu pensamiento.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable}`}>
      <body className="antialiased min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}