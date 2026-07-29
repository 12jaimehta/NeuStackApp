import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, SearchX, Ticket, ShieldCheck, Truck, Star } from 'lucide-react';
import { useProducts, useAddToCart } from '../features/store/hooks/useStore';
import { ProductCard } from '../features/store/components/ProductCard';
import { LoadingSkeleton, ErrorState, EmptyState } from '../shared/components/States';
import type { Product } from '../shared/types/index';

const CATEGORIES = ['All', 'Electronics', 'Sports', 'Kitchen', 'Accessories', 'Lifestyle'];

const TRUST_ITEMS = [
  { icon: Truck, label: 'Free Shipping' },
  { icon: ShieldCheck, label: 'Secure Payments' },
  { icon: Star, label: 'Top-Rated Gear' },
  { icon: Ticket, label: 'Rewards Every 3rd Order' },
];

export default function StorePage() {
  const { data: products, isLoading, error } = useProducts();
  const addToCartMutation = useAddToCart();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = (products ?? []).filter((p: Product) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 sm:py-20">
          <div className="max-w-2xl">

            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.05] tracking-[-0.04em] text-foreground mb-6">
              Products you'll <br className="hidden sm:block" />
              actually want.
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg leading-[1.75] max-w-xl mb-8">
              Curated electronics, sports gear, kitchen essentials, and lifestyle products — all in one place.
            </p>

            {/* Hero Actions */}
            <div className="flex flex-wrap gap-3 mb-8 sm:mb-0">
              <a href="#products" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-neu-sm hover:shadow-neu-md hover:-translate-y-px">
                Browse Products →
              </a>
              <Link to="/admin" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-foreground text-sm font-bold border border-border hover:border-gray-300 shadow-neu-xs hover:shadow-neu-sm transition-all">
                View Rewards
              </Link>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div className="border-t border-border bg-[#f7f8fa]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3.5">
            <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide">
              {TRUST_ITEMS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 shrink-0 text-xs font-semibold text-muted-foreground">
                  <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products  */}
      <section id="products" className="max-w-7xl mx-auto px-6 lg:px-12 py-10 sm:py-14">

        {/* Filter + Search bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                id={`filter-${cat.toLowerCase()}`}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 shrink-0 border
                  ${category === cat
                    ? 'bg-primary text-white border-primary shadow-neu-sm'
                    : 'bg-white text-muted-foreground border-border hover:border-gray-300 hover:text-foreground'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <input
              id="product-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 h-9 rounded-xl border border-border bg-white text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-neu-xs"
            />
          </div>
        </div>

        {/* Count */}
        {!isLoading && !error && filtered.length > 0 && (
          <p className="text-xs font-semibold text-muted-foreground mb-5 uppercase tracking-widest">
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
            {category !== 'All' && <> · <span className="text-primary">{category}</span></>}
          </p>
        )}

        {/* Grid */}
        {isLoading && <LoadingSkeleton count={8} />}
        {error && <ErrorState message={(error as Error).message} />}
        {!isLoading && !error && filtered.length === 0 && (
          <EmptyState
            icon={<SearchX className="w-8 h-8" />}
            title="No products found"
            description="Try adjusting your search or selecting a different category."
          />
        )}
        {!isLoading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(p) => addToCartMutation.mutate(p)}
                isLoading={addToCartMutation.isPending && addToCartMutation.variables?.id === product.id}
              />
            ))}
          </div>
        )}
      </section>

      {/* Rewards Banner */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-16">
        <div className="bg-white rounded-2xl border border-border shadow-neu-sm p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="section-label">Rewards Programme</div>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground mb-2">Earn on every 3rd order.</h2>
          </div>
          <Link
            to="/admin"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-neu-sm hover:shadow-neu-md hover:-translate-y-px whitespace-nowrap"
          >
            View Admin Panel →
          </Link>
        </div>
      </section>
    </div>
  );
}
