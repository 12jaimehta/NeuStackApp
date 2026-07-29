
import { store } from '../src/shared/store/inMemoryStore';
import { addItemToCart } from '../src/features/cart/cart.service';
import { processCheckout } from '../src/features/checkout/checkout.service';
import {
  canGenerateDiscountCode,
  generateDiscountCode,
} from '../src/features/discount/discount.service';

process.env.NODE_ENV = 'test';

function placeOrder(tag: string) {
  const userId = `order-user-${tag}-${Math.random()}`;
  addItemToCart({ userId, productId: 'prod-001', name: 'Item', price: 500, quantity: 1 });
  return processCheckout({ userId });
}

describe('Discount Service', () => {
  beforeEach(() => {
    store.resetForTesting();
  });

  describe('nth-order threshold math', () => {
    it('floor(0/3) = 0  → 0 orders, not eligible', () => {
      expect(Math.floor(0 / 3)).toBe(0);
    });
    it('floor(1/3) = 0  → 1 order, not eligible', () => {
      expect(Math.floor(1 / 3)).toBe(0);
    });
    it('floor(2/3) = 0  → 2 orders, not eligible', () => {
      expect(Math.floor(2 / 3)).toBe(0);
    });
    it('floor(3/3) = 1  → 3rd order unlocks one code', () => {
      expect(Math.floor(3 / 3)).toBe(1);
    });
    it('floor(6/3) = 2  → 6th order unlocks a second code', () => {
      expect(Math.floor(6 / 3)).toBe(2);
    });
    it('floor(9/3) = 3  → 9th order unlocks a third code', () => {
      expect(Math.floor(9 / 3)).toBe(3);
    });
  });

  describe('canGenerateDiscountCode()', () => {
    it('should NOT be eligible with 0 orders', () => {
      const { eligible } = canGenerateDiscountCode();
      expect(eligible).toBe(false);
    });

    it('should NOT be eligible after 1 order (n=3)', () => {
      placeOrder('a');
      expect(canGenerateDiscountCode().eligible).toBe(false);
    });

    it('should NOT be eligible after 2 orders (n=3)', () => {
      placeOrder('a'); placeOrder('b');
      expect(canGenerateDiscountCode().eligible).toBe(false);
    });

    it('should be ELIGIBLE after 3 orders (n=3)', () => {
      placeOrder('a'); placeOrder('b'); placeOrder('c');
      expect(canGenerateDiscountCode().eligible).toBe(true);
    });

    it('should NOT be eligible again after generating the code for the 3rd order', () => {
      placeOrder('a'); placeOrder('b'); placeOrder('c');
      generateDiscountCode();
      expect(canGenerateDiscountCode().eligible).toBe(false);
    });

    it('should be eligible again after 6 orders', () => {
      for (let i = 0; i < 6; i++) placeOrder(`bulk-${i}`);
      generateDiscountCode();
      expect(canGenerateDiscountCode().eligible).toBe(true);
    });
  });


  describe('generateDiscountCode()', () => {
    it('should throw when condition is not met', () => {
      expect(() => generateDiscountCode()).toThrow();
    });

    it('should generate a code with correct DISC-XXXX-XXXX format', () => {
      placeOrder('a'); placeOrder('b'); placeOrder('c');
      const result = generateDiscountCode();
      expect(result.code).toMatch(/^DISC-[0-9A-F]{4}-[0-9A-F]{4}$/);
    });

    it('should set the correct discount percent from config', () => {
      placeOrder('a'); placeOrder('b'); placeOrder('c');
      const result = generateDiscountCode();
      expect(result.discountPercent).toBe(10);
    });

    it('should persist the code in the store', () => {
      placeOrder('a'); placeOrder('b'); placeOrder('c');
      const { code } = generateDiscountCode();
      const stored = store.getDiscountCode(code);
      expect(stored).toBeDefined();
      expect(stored?.isUsed).toBe(false);
    });

    it('should not generate duplicate codes for the same milestone', () => {
      placeOrder('a'); placeOrder('b'); placeOrder('c');
      generateDiscountCode();
      expect(() => generateDiscountCode()).toThrow();
    });
  });
});
