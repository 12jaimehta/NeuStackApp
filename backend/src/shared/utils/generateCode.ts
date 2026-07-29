import { randomBytes } from 'crypto';


// Format:  DISC-XXXX-XXXX  (prefix + two 4-char alphanumeric segments)
// Example: DISC-A3BF-9K2M

export function generateCouponCode(): string {
  const segment = (): string =>
    randomBytes(4)
      .toString('hex')
      .toUpperCase()
      .slice(0, 4);

  return `DISC-${segment()}-${segment()}`;
}
