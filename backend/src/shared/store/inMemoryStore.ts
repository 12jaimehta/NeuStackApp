import { v4 as uuidv4 } from 'uuid';

// Domain Types 
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  discountCode: string | null;
  total: number;
  orderNumber: number;
  createdAt: Date;
}

export interface DiscountCode {
  code: string;
  discountPercent: number;
  isUsed: boolean;
  createdAt: Date;
  usedAt: Date | null;
  usedByOrderId: string | null;
  triggeredByOrderCount: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  stock: number;
}

interface AppStore {
  carts: Map<string, Cart>;
  orders: Order[];
  discountCodes: Map<string, DiscountCode>;
  products: Product[];
}

// Static Product Catalogue 
// In a real system this would come from a DB. Using static data per requirements.

const STATIC_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Wireless Headphones',
    price: 2999,
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life.',
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    stock: 50,
  },
  {
    id: 'prod-002',
    name: 'Mechanical Keyboard',
    price: 4499,
    description: 'RGB mechanical keyboard with Cherry MX switches and USB-C connectivity.',
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&q=80',
    stock: 30,
  },
  {
    id: 'prod-003',
    name: 'Running Shoes',
    price: 3299,
    description: 'Lightweight breathable running shoes with responsive cushioning.',
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    stock: 100,
  },
  {
    id: 'prod-004',
    name: 'Yoga Mat',
    price: 899,
    description: 'Non-slip premium eco-friendly yoga mat, 6mm thick.',
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1601925228836-2f8bbb3a0a27?w=400&q=80',
    stock: 75,
  },
  {
    id: 'prod-005',
    name: 'Coffee Maker',
    price: 5999,
    description: 'Programmable 12-cup coffee maker with thermal carafe and auto-brew.',
    category: 'Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
    stock: 25,
  },
  {
    id: 'prod-006',
    name: 'Laptop Stand',
    price: 1299,
    description: 'Ergonomic aluminium laptop stand with adjustable height (6 levels).',
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80',
    stock: 60,
  },
  {
    id: 'prod-007',
    name: 'Smart Water Bottle',
    price: 1599,
    description: 'Temperature display smart water bottle, keeps drinks cold 24h / hot 12h.',
    category: 'Lifestyle',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80',
    stock: 80,
  },
  {
    id: 'prod-008',
    name: 'Wireless Charger',
    price: 1999,
    description: '15W fast wireless charger, compatible with Qi devices.',
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&q=80',
    stock: 45,
  },
];

//Store Singleton

class InMemoryStore {
  private static instance: InMemoryStore;

  private data: AppStore;

  private constructor() {
    this.data = this.createInitialState();
  }

  private createInitialState(): AppStore {
    return {
      carts: new Map(),
      orders: [],
      discountCodes: new Map(),
      products: STATIC_PRODUCTS,
    };
  }

  static getInstance(): InMemoryStore {
    if (!InMemoryStore.instance) {
      InMemoryStore.instance = new InMemoryStore();
    }
    return InMemoryStore.instance;
  }

  // Cart Operations 
  getCart(userId: string): Cart | undefined {
    return this.data.carts.get(userId);
  }

  // Functional cart update
  upsertCart(userId: string, updater: (cart: Cart) => Cart): Cart {
    const existing: Cart = this.data.carts.get(userId) ?? {
      userId,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updated = updater({ ...existing, updatedAt: new Date() });
    this.data.carts.set(userId, updated);
    return updated;
  }

  clearCart(userId: string): void {
    this.data.carts.delete(userId);
  }

  // Order Operations 
  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order {
    const order: Order = {
      ...orderData,
      id: uuidv4(),
      orderNumber: this.data.orders.length + 1,
      createdAt: new Date(),
    };
    this.data.orders.push(order);
    return order;
  }

  getOrders(): Order[] {
    return [...this.data.orders];
  }

  getTotalOrderCount(): number {
    return this.data.orders.length;
  }

  // Discount Code Operations 
  addDiscountCode(code: DiscountCode): void {
    this.data.discountCodes.set(code.code, code);
  }

  getDiscountCode(code: string): DiscountCode | undefined {
    return this.data.discountCodes.get(code);
  }

  markDiscountCodeUsed(code: string, orderId: string): void {
    const existing = this.data.discountCodes.get(code);
    if (existing) {
      this.data.discountCodes.set(code, {
        ...existing,
        isUsed: true,
        usedAt: new Date(),
        usedByOrderId: orderId,
      });
    }
  }

  getAllDiscountCodes(): DiscountCode[] {
    return Array.from(this.data.discountCodes.values());
  }

  getGeneratedDiscountCodeCount(): number {
    return this.data.discountCodes.size;
  }

  // Product Operations 
  getProducts(): Product[] {
    return [...this.data.products];
  }

  getProductById(id: string): Product | undefined {
    return this.data.products.find((p) => p.id === id);
  }

  // Computed Stats 
  getStats() {
    const orders = this.getOrders();
    const discountCodes = this.getAllDiscountCodes();

    const totalItemsPurchased = orders.reduce(
      (sum, order) => sum + order.items.reduce((s, item) => s + item.quantity, 0),
      0,
    );
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalDiscountGiven = orders.reduce((sum, order) => sum + order.discountAmount, 0);

    return {
      totalOrders: orders.length,
      totalItemsPurchased,
      totalRevenue,
      totalDiscountGiven,
      totalDiscountCodesGenerated: discountCodes.length,
      totalDiscountCodesUsed: discountCodes.filter((dc) => dc.isUsed).length,
      discountCodes: discountCodes.map((dc) => ({
        code: dc.code,
        discountPercent: dc.discountPercent,
        isUsed: dc.isUsed,
        createdAt: dc.createdAt,
        usedAt: dc.usedAt,
      })),
    };
  }

  // Test Utilities 
  // Resets the store to its initial state.
  resetForTesting(): void {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('resetForTesting() is only available in NODE_ENV=test');
    }
    this.data = this.createInitialState();
  }
}
export const store = InMemoryStore.getInstance();
