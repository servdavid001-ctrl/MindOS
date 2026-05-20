import "./globals.css";

export const metadata = {
  title: "MindOS - Sistema de Pensamiento Asistido",
  description: "Espacio de trabajo completo, privado y auto-soberano para tu pensamiento.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}