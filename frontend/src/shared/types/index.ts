export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  stock: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartPayload {
  userId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CheckoutPayload {
  userId: string;
  discountCode?: string;
}

export interface CheckoutResult {
  orderId: string;
  orderNumber: number;
  userId: string;
  items: CartItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  discountCode: string | null;
  total: number;
  createdAt: string;
}

export interface DiscountCodeInfo {
  code: string;
  discountPercent: number;
  isUsed: boolean;
  createdAt: string;
  usedAt: string | null;
}

export interface AdminStats {
  totalOrders: number;
  totalItemsPurchased: number;
  totalRevenue: number;
  totalDiscountGiven: number;
  totalDiscountCodesGenerated: number;
  totalDiscountCodesUsed: number;
  discountCodes: DiscountCodeInfo[];
  discountConfig: {
    everyNOrders: number;
    discountPercent: number;
  };
  discountEligibility: {
    canGenerateNewCode: boolean;
    codesEligible: number;
    codesGenerated: number;
    nextCodeAt: number | null;
  };
}

export interface GenerateDiscountResult {
  code: string;
  discountPercent: number;
  triggeredByOrderCount: number;
  createdAt: string;
}
