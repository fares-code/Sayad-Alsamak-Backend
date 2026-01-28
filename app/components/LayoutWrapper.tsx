'use client'
import { usePathname } from "next/navigation";
import NavBar from "@/app/components/NavBar/NavBar";
import Footer from "@/app/components/Footer/Footer";
import { CartProvider } from "@/app/context/CartContext";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // إخفاء الـ Header والـ Footer في صفحات الـ login والـ dashboard
  const isLoginPage = pathname === '/super-admin/login';
  const isDashboardPage = pathname.startsWith('/dashboard');
  
  const hideHeaderFooter = isLoginPage || isDashboardPage;

  return (
    <CartProvider>
      {!hideHeaderFooter && <NavBar />}
      <main className="min-h-screen">{children}</main>
      {!hideHeaderFooter && <Footer />}
    </CartProvider>
  );
}