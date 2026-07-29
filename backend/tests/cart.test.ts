
import { store } from '../src/shared/store/inMemoryStore';
import { addItemToCart, getCart } from '../src/features/cart/cart.service';
import { beforeEach, describe, it } from 'node:test';

process.env.NODE_ENV = 'test';

const TEST_USER = 'cart-test-user-1';

describe('Cart Service', () => {
  beforeEach(() => {
    store.resetForTesting();
  });


  describe('addItemToCart()', () => {
    it('should add a new item to an empty cart', () => {
      const cart = addItemToCart({
        userId: TEST_USER,
        productId: 'prod-001',
        name: 'Wireless Headphones',
        price: 2999,
        quantity: 1,
      });

      expect(cart.userId).toBe(TEST_USER);
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0]).toMatchObject({
        productId: 'prod-001',
        name: 'Wireless Headphones',
        price: 2999,
        quantity: 1,
      });
    });

    it('should increment quantity when same product is added again', () => {
      addItemToCart({ userId: TEST_USER, productId: 'prod-001', name: 'A', price: 100, quantity: 2 });
      const cart = addItemToCart({ userId: TEST_USER, productId: 'prod-001', name: 'A', price: 100, quantity: 3 });

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(5); // 2 + 3
    });

    it('should add multiple different products as separate line items', () => {
      addItemToCart({ userId: TEST_USER, productId: 'prod-001', name: 'Product A', price: 100, quantity: 1 });
      const cart = addItemToCart({ userId: TEST_USER, productId: 'prod-002', name: 'Product B', price: 200, quantity: 2 });

      expect(cart.items).toHaveLength(2);
    });

    it('should not share cart state between different users', () => {
      addItemToCart({ userId: 'user-A', productId: 'prod-001', name: 'A', price: 100, quantity: 1 });
      const cartB = getCart('user-B');
      expect(cartB.items).toHaveLength(0);
    });

    it('should update the updatedAt timestamp on each change', () => {
      const cart1 = addItemToCart({ userId: TEST_USER, productId: 'prod-001', name: 'A', price: 100, quantity: 1 });
      const originalTimestamp = cart1.updatedAt;

      const cart2 = addItemToCart({ userId: TEST_USER, productId: 'prod-001', name: 'A', price: 100, quantity: 1 });

      expect(cart2.updatedAt.getTime()).toBeGreaterThanOrEqual(originalTimestamp.getTime());
    });
  });


  describe('getCart()', () => {
    it('should return an empty cart stub for a new user', () => {
      const cart = getCart('brand-new-user');
      expect(cart.userId).toBe('brand-new-user');
      expect(cart.items).toHaveLength(0);
    });

    it('should return the populated cart for an existing user', () => {
      addItemToCart({ userId: TEST_USER, productId: 'prod-001', name: 'A', price: 100, quantity: 3 });
      const cart = getCart(TEST_USER);
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(3);
    });
  });
});
