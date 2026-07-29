import { Request, Response } from 'express';
import { store } from '../../shared/store/inMemoryStore';
import { sendSuccess } from '../../shared/utils/apiResponse';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../../constants';

export function getProductsController(_req: Request, res: Response): void {
  const products = store.getProducts();
  sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.PRODUCTS_FETCHED, products);
}
