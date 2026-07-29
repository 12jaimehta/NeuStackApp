export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  CART_EMPTY: 'Cart is empty. Please add items before checking out.',
  USER_NOT_FOUND: 'User not found.',
  INVALID_DISCOUNT_CODE: 'Invalid or expired discount code.',
  DISCOUNT_ALREADY_USED: 'This discount code has already been used.',
  NO_DISCOUNT_ELIGIBLE:
    'No discount code can be generated yet. The nth-order threshold has not been reached.',
  INTERNAL_ERROR: 'An internal server error occurred.',
} as const;

export const SUCCESS_MESSAGES = {
  ITEM_ADDED: 'Item added to cart successfully.',
  CHECKOUT_SUCCESS: 'Order placed successfully.',
  DISCOUNT_GENERATED: 'Discount code generated successfully.',
  STATS_FETCHED: 'Statistics fetched successfully.',
  CART_FETCHED: 'Cart fetched successfully.',
  PRODUCTS_FETCHED: 'Products fetched successfully.',
} as const;
