export interface GenerateDiscountResult {
  code: string;
  discountPercent: number;
  triggeredByOrderCount: number;
  createdAt: Date;
}

export interface DiscountEligibility {
  eligible: boolean;
  codesEligible: number;
  codesGenerated: number;
}
