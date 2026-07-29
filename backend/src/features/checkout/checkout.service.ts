import { store } from '../../shared/store/inMemoryStore';
import { CheckoutDto, CheckoutResult } from './checkout.types';
import { createError } from '../../shared/middleware/errorHandler';
import { HTTP_STATUS, ERROR_MESSAGES } from '../../constants';

export function processCheckout(dto: CheckoutDto): CheckoutResult {
  const cart = store.getCart(dto.userId);
  if (!cart || cart.items.length === 0) {
    throw createError(ERROR_MESSAGES.CART_EMPTY, HTTP_STATUS.BAD_REQUEST);
  }

  let discountPercent = 0;

  if (dto.discountCode) {
    const code = store.getDiscountCode(dto.discountCode);

    if (!code) {
      throw createError(ERROR_MESSAGES.INVALID_DISCOUNT_CODE, HTTP_STATUS.BAD_REQUEST);
    }
    if (code.isUsed) {
      throw createError(ERROR_MESSAGES.DISCOUNT_ALREADY_USED, HTTP_STATUS.BAD_REQUEST);
    }
    discountPercent = code.discountPercent;
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const total = subtotal - discountAmount;

  const order = store.createOrder({
    userId: dto.userId,
    items: [...cart.items],
    subtotal,
    discountAmount,
    discountCode: dto.discountCode ?? null,
    total,
  });

  if (dto.discountCode) {
    store.markDiscountCodeUsed(dto.discountCode, order.id);
  }

  store.clearCart(dto.userId);
  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    userId: order.userId,
    items: order.items,
    subtotal: order.subtotal,
    discountPercent,
    discountAmount: order.discountAmount,
    discountCode: order.discountCode,
    total: order.total,
    createdAt: order.createdAt,
  };
}
