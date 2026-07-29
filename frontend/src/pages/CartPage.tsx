import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trash2, ArrowRight, ShoppingBag, Receipt,
  ShoppingCart, Minus, Plus, CheckCircle2, Lock
} from 'lucide-react';
import { useCart, useCheckout, useValidateDiscount } from '../features/cart/hooks/useCart';
import { useUpdateCartQuantity } from '../features/store/hooks/useStore';
import { LoadingSpinner, ErrorState, EmptyState } from '../shared/components/States';
import { formatPrice } from '../shared/utils/helpers';
import type { CheckoutResult } from '../shared/types/index';

export default function CartPage() {
  const { data: cart, isLoading, error } = useCart();
  const checkoutMutation = useCheckout();
  const updateCart = useUpdateCartQuantity();
  const validateMutation = useValidateDiscount();
  const [discountCode, setDiscountCode] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [lastOrder, setLastOrder] = useState<CheckoutResult | null>(null);

  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handleApplyCode() {
    if (!discountCode.trim()) return;
    const code = discountCode.trim().toUpperCase();
    try {
      const data = await validateMutation.mutateAsync(code);
      setAppliedCode(data.code);
      setDiscountPercent(data.discountPercent);
    } catch (err) {
      setAppliedCode('');
      setDiscountPercent(0);
    }
  }

  async function handleCheckout() {
    const result = await checkoutMutation.mutateAsync(appliedCode || undefined);
    setLastOrder(result);
    setAppliedCode('');
    setDiscountCode('');
    setDiscountPercent(0);
  }

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState message={(error as Error).message} />;

  // Order Confirmed
  if (lastOrder) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <div className="section-label justify-center flex">Order confirmed</div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">You're all set!</h1>
        <p className="text-muted-foreground mb-8">
          Order <span className="font-bold text-primary">#{lastOrder.orderNumber}</span> has been placed.
        </p>

        <div className="bg-white rounded-2xl border border-border shadow-neu-sm p-6 text-left mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Receipt</p>
          <div className="space-y-3">
            {lastOrder.items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-foreground font-medium">{item.name}</span>
                <span className="text-muted-foreground">{item.quantity} × {formatPrice(item.price)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(lastOrder.subtotal)}</span>
            </div>
            {lastOrder.discountAmount > 0 && (
              <div className="flex justify-between text-sm text-success font-medium">
                <span>Discount ({lastOrder.discountPercent}% off)</span>
                <span>−{formatPrice(lastOrder.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold tracking-tight pt-1">
              <span>Total</span>
              <span className="text-primary">{formatPrice(lastOrder.total)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setLastOrder(null)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all shadow-neu-sm"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </button>
          <Link
            to="/admin"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-foreground font-bold text-sm border border-border hover:border-gray-300 shadow-neu-xs hover:shadow-neu-sm transition-all"
          >
            <Receipt className="w-4 h-4" /> Admin Panel
          </Link>
        </div>
      </div>
    );
  }

  // Empty 
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-8">Shopping Cart</h1>
        <EmptyState
          icon={<ShoppingCart className="w-8 h-8" />}
          title="Your cart is empty"
          description="You haven't added anything yet. Go explore our products!"
        />
        <div className="mt-6 flex justify-center">
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all shadow-neu-sm">
            <ShoppingBag className="w-4 h-4" /> Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // Cart 
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <div className="section-label">Checkout</div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Shopping Cart
          <span className="ml-3 text-base font-semibold text-muted-foreground tracking-normal">
            ({items.reduce((s, i) => s + i.quantity, 0)} {items.reduce((s, i) => s + i.quantity, 0) === 1 ? 'item' : 'items'})
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-2xl border border-border shadow-neu-xs p-4 sm:p-5 flex gap-4 animate-slide-in-right"
            >
              {/* Thumbnail */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl bg-[#f0f1f4] flex items-center justify-center overflow-hidden">
                <img
                  src={`https://placehold.co/200x200/f0f1f4/2563eb?text=${encodeURIComponent(item.name.slice(0, 6))}`}
                  alt={item.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <p className="font-bold text-sm sm:text-base text-foreground tracking-tight leading-snug line-clamp-2 mb-0.5">
                    {item.name}
                  </p>
                  <p className="text-xs font-semibold text-success">In Stock</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                  {/* Stepper */}
                  <div className="flex items-center border border-border rounded-xl overflow-hidden shadow-neu-xs bg-white">
                    <button
                      onClick={() => updateCart.mutate({ productId: item.productId, name: item.name, price: item.price, delta: -1 })}
                      disabled={updateCart.isPending}
                      className="w-9 h-9 flex items-center justify-center hover:bg-[#f0f1f4] transition-colors text-foreground disabled:opacity-40"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-foreground bg-white border-x border-border py-2">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCart.mutate({ productId: item.productId, name: item.name, price: item.price, delta: 1 })}
                      disabled={updateCart.isPending}
                      className="w-9 h-9 flex items-center justify-center hover:bg-[#f0f1f4] transition-colors text-foreground disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Price + Delete */}
                  <div className="flex items-center gap-4">
                    <span className="text-base font-extrabold tracking-tight text-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => updateCart.mutate({ productId: item.productId, name: item.name, price: item.price, delta: -item.quantity })}
                      disabled={updateCart.isPending}
                      className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-blue-700 font-semibold transition-colors mt-1">
            ← Continue Shopping
          </Link>
        </div>

        {/*  Sticky Summary*/}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            {/* Promo Code */}
            <div className="bg-white rounded-2xl border border-border shadow-neu-xs p-5">
              <div className="section-label">Promo Code</div>
              <div className="flex gap-2">
                <input
                  id="discount-code-input"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyCode()}
                  placeholder="DISC-XXXX"
                  className="flex-1 h-10 px-3 rounded-xl border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-background"
                />
                <button
                  onClick={handleApplyCode}
                  disabled={validateMutation.isPending}
                  className="px-4 h-10 rounded-xl bg-primary/7 text-primary font-bold text-sm hover:bg-primary/12 disabled:opacity-50 transition-colors border border-primary/10 flex items-center justify-center min-w-[72px]"
                >
                  {validateMutation.isPending ? (
                    <svg className="animate-spin w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : (
                    'Apply'
                  )}
                </button>
              </div>
              {appliedCode && (
                <div className="mt-2 flex items-center gap-2 text-xs text-success font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Code <span className="font-mono">{appliedCode}</span> applied
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-border shadow-neu-xs p-5">
              <div className="section-label">Order Summary</div>

              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">
                    Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                  </span>
                  <span className="font-bold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Shipping</span>
                  <span className="text-success font-bold">FREE</span>
                </div>
                {appliedCode && (
                  <div className="flex justify-between text-success font-semibold">
                    <span>Promo code ({discountPercent}% off)</span>
                    <span className="font-mono text-xs bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">{appliedCode}</span>
                  </div>
                )}
                <div className="border-t border-border pt-3 flex justify-between font-extrabold text-base tracking-tight">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(subtotal - (subtotal * discountPercent) / 100)}</span>
                </div>
              </div>

              <button
                id="checkout-button"
                onClick={handleCheckout}
                disabled={checkoutMutation.isPending}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-bold text-sm
                  hover:bg-blue-700 active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200 shadow-neu-sm hover:shadow-neu-md hover:-translate-y-px"
              >
                {checkoutMutation.isPending ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                {checkoutMutation.isPending ? 'Placing Order…' : 'Place Order'}
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-medium">
                <Lock className="w-3 h-3" /> Secure & encrypted checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
