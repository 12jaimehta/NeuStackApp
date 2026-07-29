
import { store } from '../src/shared/store/inMemoryStore';
import { addItemToCart } from '../src/features/cart/cart.service';
import { processCheckout } from '../src/features/checkout/checkout.service';
import { DiscountCode } from '../src/shared/store/inMemoryStore';

process.env.NODE_ENV = 'test';

const USER = 'checkout-test-user';
function seedCart(userId = USER) {
  addItemToCart({ userId, productId: 'prod-001', name: 'Headphones', price: 1000, quantity: 2 });
}

describe('Checkout Service', () => {
  beforeEach(() => {
    store.resetForTesting();
  });

  it('should create an order and return correct totals (no discount)', () => {
    seedCart();
    const result = processCheckout({ userId: USER });

    expect(result.subtotal).toBe(2000);
    expect(result.discountAmount).toBe(0);
    expect(result.discountPercent).toBe(0);
    expect(result.total).toBe(2000);
    expect(result.discountCode).toBeNull();
    expect(result.orderId).toBeDefined();
    expect(result.orderNumber).toBe(1);
  });

  it('should apply a valid discount code and compute correct totals', () => {
    const testCode: DiscountCode = {
      code: 'DISC-TEST-CODE',
      discountPercent: 20,
      isUsed: false,
      createdAt: new Date(),
      usedAt: null,
      usedByOrderId: null,
      triggeredByOrderCount: 0,
    };
    store.addDiscountCode(testCode);

    seedCart();
    const result = processCheckout({ userId: USER, discountCode: 'DISC-TEST-CODE' });

    expect(result.discountPercent).toBe(20);
    expect(result.discountAmount).toBe(400);
    expect(result.total).toBe(1600);
    expect(result.discountCode).toBe('DISC-TEST-CODE');
  });


  it('should clear the cart after successful checkout', () => {
    seedCart();
    processCheckout({ userId: USER });
    expect(store.getCart(USER)).toBeUndefined();
  });

  it('should persist the order in the store', () => {
    seedCart();
    processCheckout({ userId: USER });
    expect(store.getTotalOrderCount()).toBe(1);
  });

  it('should mark the discount code as used after checkout', () => {
    const testCode: DiscountCode = {
      code: 'DISC-MARK-USED',
      discountPercent: 10,
      isUsed: false,
      createdAt: new Date(),
      usedAt: null,
      usedByOrderId: null,
      triggeredByOrderCount: 0,
    };
    store.addDiscountCode(testCode);

    seedCart();
    processCheckout({ userId: USER, discountCode: 'DISC-MARK-USED' });

    const code = store.getDiscountCode('DISC-MARK-USED');
    expect(code?.isUsed).toBe(true);
    expect(code?.usedByOrderId).toBeDefined();
  });


  it('should throw when cart is empty', () => {
    expect(() => processCheckout({ userId: USER })).toThrow('Cart is empty');
  });

  it('should throw when discount code does not exist', () => {
    seedCart();
    expect(() =>
      processCheckout({ userId: USER, discountCode: 'INVALID-XXXX-CODE' }),
    ).toThrow('Invalid or expired discount code');
  });

  it('should throw when discount code has already been used', () => {
    const usedCode: DiscountCode = {
      code: 'DISC-ALREADY-USED',
      discountPercent: 10,
      isUsed: true,
      createdAt: new Date(),
      usedAt: new Date(),
      usedByOrderId: 'some-order-id',
      triggeredByOrderCount: 3,
    };
    store.addDiscountCode(usedCode);

    seedCart();
    expect(() =>
      processCheckout({ userId: USER, discountCode: 'DISC-ALREADY-USED' }),
    ).toThrow('already been used');
  });

  it('should correctly round discount amounts for non-integer results', () => {
    const code: DiscountCode = {
      code: 'DISC-ROUND-TEST',
      discountPercent: 15,
      isUsed: false,
      createdAt: new Date(),
      usedAt: null,
      usedByOrderId: null,
      triggeredByOrderCount: 0,
    };
    store.addDiscountCode(code);
    addItemToCart({ userId: USER, productId: 'prod-x', name: 'Item', price: 999, quantity: 1 });

    const result = processCheckout({ userId: USER, discountCode: 'DISC-ROUND-TEST' });
    expect(result.discountAmount).toBe(150);
    expect(result.total).toBe(849);
  });
});
