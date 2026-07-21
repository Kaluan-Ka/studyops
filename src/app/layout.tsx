import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyOps",
  description: "Trilha pessoal para transformar estudos de engenharia de IA em evidencias de portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
