import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { Navbar } from './shared/components/Navbar';
import { useCartItemCount } from './features/cart/hooks/useCart';
import StorePage from './pages/StorePage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppShell() {
  const cartCount = useCartItemCount();
  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} />
      <main>
        <Routes>
          <Route path="/" element={<StorePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppShell />
        <Toaster
          position="top-right"
          theme="light"
          closeButton
          richColors
          toastOptions={{
            duration: 3500,
            style: {
              background: 'hsl(0 0% 100%)',
              border: '1px solid hsl(214 20% 88%)',
              color: 'hsl(215 28% 12%)',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
