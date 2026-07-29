import { Router } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { validateBody } from '../../shared/middleware/validateRequest';
import { AddToCartSchema } from './cart.types';
import { addToCartController, getCartController } from './cart.controller';

const router = Router();

router.post('/add', validateBody(AddToCartSchema), asyncHandler(addToCartController));


router.get('/:userId', asyncHandler(getCartController));

export default router;
