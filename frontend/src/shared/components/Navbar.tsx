import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Store, LayoutDashboard, Zap, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../utils/helpers';

interface NavbarProps {
  cartCount: number;
}

const navItems = [
  { to: '/', label: 'Shop', icon: Store },
  { to: '/cart', label: 'Cart', icon: ShoppingCart },
  { to: '/admin', label: 'Admin', icon: LayoutDashboard },
];

export function Navbar({ cartCount }: NavbarProps) {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b border-border"
      style={{ background: 'rgba(247,248,250,0.88)', backdropFilter: 'blur(12px)' }}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="h-16 flex items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mr-10 shrink-0" onClick={() => setMobileOpen(false)}>
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[1.1rem] font-extrabold tracking-[-0.03em] text-foreground">
              shop<span className="text-primary">wave</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden sm:flex items-center gap-0.5 flex-1">
            {navItems.map(({ to, label }) => {
              const isActive = pathname === to;
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={cn(
                      'relative px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
                      isActive
                        ? 'text-primary bg-primary/7'
                        : 'text-muted-foreground hover:text-foreground hover:bg-black/[0.04]',
                    )}
                  >
                    {label}
                    {to === '/cart' && cartCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] rounded-full bg-primary text-white text-[9px] flex items-center justify-center font-bold px-1 shadow-neu-sm">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop CTA */}
          <Link
            to="/cart"
            className="hidden sm:inline-flex items-center gap-2 ml-auto px-5 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-blue-700 transition-all duration-200 shadow-neu-sm hover:shadow-neu-md hover:-translate-y-px"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Cart
            {cartCount > 0 && (
              <span className="ml-1 bg-white/20 rounded-full px-1.5 py-0 text-[10px] font-bold">{cartCount}</span>
            )}
          </Link>

          {/* Mobile */}
          <div className="sm:hidden flex items-center gap-3 ml-auto">
            <Link to="/cart" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-primary text-white text-[9px] flex items-center justify-center font-bold px-1">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            <button
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-black/[0.04]"
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-border py-2 animate-fade-in">
            {navItems.map(({ to, label, icon: Icon }) => {
              const isActive = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors mx-2',
                    isActive
                      ? 'text-primary bg-primary/7'
                      : 'text-muted-foreground hover:text-foreground hover:bg-black/[0.04]',
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  {to === '/cart' && cartCount > 0 && (
                    <span className="ml-auto bg-primary text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-bold px-1">
                      {cartCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </header>
  );
}
