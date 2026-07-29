import { Request, Response } from 'express';
import { processCheckout } from './checkout.service';
import { CheckoutDto } from './checkout.types';
import { sendSuccess } from '../../shared/utils/apiResponse';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../../constants';

export function checkoutController(req: Request, res: Response): void {
  const dto: CheckoutDto = req.body;
  const result = processCheckout(dto);
  sendSuccess(res, HTTP_STATUS.CREATED, SUCCESS_MESSAGES.CHECKOUT_SUCCESS, result);
}
