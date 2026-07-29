import { store, DiscountCode } from '../../shared/store/inMemoryStore';
import { config } from '../../config';
import { createError } from '../../shared/middleware/errorHandler';
import { HTTP_STATUS, ERROR_MESSAGES } from '../../constants';
import { generateCouponCode } from '../../shared/utils/generateCode';
import { GenerateDiscountResult, DiscountEligibility } from './discount.types';

// Determines whether a new discount code can be generated.
export function canGenerateDiscountCode(): DiscountEligibility {
  const totalOrders = store.getTotalOrderCount();
  const { everyNOrders } = config.discount;

  const codesEligible = Math.floor(totalOrders / everyNOrders);
  const codesGenerated = store.getGeneratedDiscountCodeCount();

  return {
    eligible: codesEligible > codesGenerated,
    codesEligible,
    codesGenerated,
  };
}

/*Generates a new discount code if the nth-order condition is satisfied.*/
export function generateDiscountCode(): GenerateDiscountResult {
  const { eligible } = canGenerateDiscountCode();

  if (!eligible) {
    throw createError(ERROR_MESSAGES.NO_DISCOUNT_ELIGIBLE, HTTP_STATUS.CONFLICT);
  }

  const discountCode: DiscountCode = {
    code: generateCouponCode(),
    discountPercent: config.discount.percent,
    isUsed: false,
    createdAt: new Date(),
    usedAt: null,
    usedByOrderId: null,
    triggeredByOrderCount: store.getTotalOrderCount(),
  };

  store.addDiscountCode(discountCode);

  return {
    code: discountCode.code,
    discountPercent: discountCode.discountPercent,
    triggeredByOrderCount: discountCode.triggeredByOrderCount,
    createdAt: discountCode.createdAt,
  };
}

export function validateDiscountCode(codeString: string): { code: string; discountPercent: number } {
  const code = store.getDiscountCode(codeString);

  if (!code) {
    throw createError(ERROR_MESSAGES.INVALID_DISCOUNT_CODE, HTTP_STATUS.BAD_REQUEST);
  }
  if (code.isUsed) {
    throw createError(ERROR_MESSAGES.DISCOUNT_ALREADY_USED, HTTP_STATUS.BAD_REQUEST);
  }

  return {
    code: code.code,
    discountPercent: code.discountPercent,
  };
}
