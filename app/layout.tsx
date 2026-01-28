import type { Metadata } from "next";
import { Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./components/LayoutWrapper";
import ReactQueryProvider from '@/lib/reactQueryProvider';
import { Toaster } from "react-hot-toast";
const notoKufi = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-kufi",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "صياد السمك | Sayad Alsamak",
  description: "متجر صياد السمك للمنتجات الطازجة - منتجات عضوية وطبيعية 100%",
  keywords: ["صياد السمك", "منتجات طازجة", "أسماك", "مأكولات بحرية"],
  authors: [{ name: "Sayad Alsamak" }],
  themeColor: "#C41E3A",
  icons: {
    icon: "/sayad-icon.png",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" className={notoKufi.variable}>
      <body className="font-noto-kufi antialiased">
        <ReactQueryProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
          <Toaster position="top-center" />
        </ReactQueryProvider>
      </body>
    </html>
  );
}