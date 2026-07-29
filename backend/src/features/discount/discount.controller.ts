import { Request, Response } from 'express';
import { generateDiscountCode, validateDiscountCode } from './discount.service';
import { sendSuccess } from '../../shared/utils/apiResponse';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../../constants';

export function generateDiscountController(_req: Request, res: Response): void {
  const result = generateDiscountCode();
  sendSuccess(res, HTTP_STATUS.CREATED, SUCCESS_MESSAGES.DISCOUNT_GENERATED, result);
}

export function validateDiscountController(req: Request, res: Response): void {
  const { code } = req.body;
  if (!code || typeof code !== 'string') {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: 'Discount code is required',
    });
    return;
  }
  const result = validateDiscountCode(code);
  sendSuccess(res, HTTP_STATUS.OK, 'Discount code is valid', result);
}
