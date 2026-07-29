import { store } from '../../shared/store/inMemoryStore';
import { config } from '../../config';
import { canGenerateDiscountCode } from '../discount/discount.service';

export function getAdminStats() {
  const stats = store.getStats();
  const eligibility = canGenerateDiscountCode();

  return {
    ...stats,
    discountConfig: {
      everyNOrders: config.discount.everyNOrders,
      discountPercent: config.discount.percent,
    },
    discountEligibility: {
      canGenerateNewCode: eligibility.eligible,
      codesEligible: eligibility.codesEligible,
      codesGenerated: eligibility.codesGenerated,
      nextCodeAt:
        !eligibility.eligible
          ? (eligibility.codesGenerated + 1) * config.discount.everyNOrders
          : null,
    },
  };
}
