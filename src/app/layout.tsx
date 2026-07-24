import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { DashboardProvider } from '@/context/DashboardContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Painel Caixa Ops - Plataforma de Inteligência de Oportunidades Imobiliárias',
  description: 'Dashboard analítico para investimento em imóveis da Caixa Econômica Federal no DF.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark scroll-smooth">
      <body className={`${inter.variable} min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-blue-500 selection:text-white`}>
        <DashboardProvider>{children}</DashboardProvider>
      </body>
    </html>
  );
}
