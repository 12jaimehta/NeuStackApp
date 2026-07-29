import { Router } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { getProductsController } from './product.controller';

const router = Router();

router.get('/', asyncHandler(getProductsController));
export default router;
