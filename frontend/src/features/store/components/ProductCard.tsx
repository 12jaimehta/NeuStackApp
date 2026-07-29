import { ShoppingCart, Star, Package, Tag } from 'lucide-react';
import { formatPrice } from '../../../shared/utils/helpers';
import type { Product } from '../../../shared/types/index';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isLoading: boolean;
}

export function ProductCard({ product, onAddToCart, isLoading }: ProductCardProps) {
  const isOutOfStock = product.stock === 0;
  const isLowStock = !isOutOfStock && product.stock <= 10;

  return (
    <div className="bg-white rounded-2xl border border-border shadow-neu-xs hover:shadow-neu-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden group">

      {/* Image area */}
      <div className="relative bg-[#f0f1f4] h-48 flex items-center justify-center p-4 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="max-w-full max-h-full object-contain group-hover:scale-[1.04] transition-transform duration-400"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/320x240/f0f1f4/2563eb?text=${encodeURIComponent(product.name)}`;
          }}
        />
        {/* Category tag */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[1.5px] text-primary bg-primary/7 border border-primary/10 px-2.5 py-1 rounded-full">
            {product.category}
          </span>
        </div>
        {/* Low stock badge */}
        {isLowStock && (
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full">
              {product.stock} left
            </span>
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="text-xs font-bold text-muted-foreground bg-white border border-border px-4 py-1.5 rounded-full shadow-neu-xs">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col p-4 gap-2">
        <h3 className="text-sm font-bold tracking-tight text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Stars */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
            />
          ))}
          <span className="text-[11px] text-muted-foreground ml-1">4.0</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-xl font-extrabold tracking-tight text-foreground">{formatPrice(product.price)}</span>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Package className="w-3 h-3" />
            {product.stock}
          </div>
        </div>

        {/* CTA */}
        <button
          id={`add-to-cart-${product.id}`}
          disabled={isOutOfStock || isLoading}
          onClick={() => onAddToCart(product)}
          className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl
            text-sm font-bold bg-primary text-white
            hover:bg-blue-700 active:scale-[0.98]
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-200 shadow-neu-sm hover:shadow-neu-md hover:-translate-y-px"
        >
          {isLoading ? (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <ShoppingCart className="w-4 h-4" />
          )}
          {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
