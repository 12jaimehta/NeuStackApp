import { Request, Response } from 'express';
import { addItemToCart, getCart } from './cart.service';
import { AddToCartDto } from './cart.types';
import { sendSuccess } from '../../shared/utils/apiResponse';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../../constants';

export function addToCartController(req: Request, res: Response): void {
  const dto: AddToCartDto = req.body;
  const cart = addItemToCart(dto);
  sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.ITEM_ADDED, cart);
}

export function getCartController(req: Request, res: Response): void {
  const { userId } = req.params;
  const cart = getCart(userId);
  sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.CART_FETCHED, cart);
}
