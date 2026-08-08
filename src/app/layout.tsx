import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

import { AuthControl } from "@/components/AuthControl";
import { AuthProvider } from "@/components/AuthProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "StudyOps",
  description: "Trilha pessoal para transformar estudos de engenharia de IA em evidências de portfólio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <AuthControl />
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
