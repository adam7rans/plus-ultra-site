import { Outlet, useLocation } from "react-router";
import { Helmet } from "react-helmet-async";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { CartDrawer } from "./components/CartDrawer";
import { AnalyticsProvider, AnalyticsDevMonitor } from "./components/Analytics";
import { SITE_STRUCTURED_DATA } from "./components/SEO";

export function Root() {
  const { pathname } = useLocation();
  return (
    <CartProvider>
      {/* Site-wide JSON-LD (Organization + WebSite + App) */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(SITE_STRUCTURED_DATA)}
        </script>
      </Helmet>

      {/* Plausible script injector + SPA route tracking */}
      <AnalyticsProvider />

      <div className="min-h-screen flex flex-col">
        {pathname !== "/docs" && <Navbar />}
        <main className={`flex-1${pathname === "/docs" ? "" : " pt-16"}`}>
          <Outlet />
        </main>
        {pathname !== "/" && pathname !== "/docs" && <Footer />}
        <CartDrawer />
      </div>

      {/* Dev-only analytics event monitor (hidden in production) */}
      <AnalyticsDevMonitor />
    </CartProvider>
  );
}