import { Router } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { validateBody } from '../../shared/middleware/validateRequest';
import { CheckoutSchema } from './checkout.types';
import { checkoutController } from './checkout.controller';

const router = Router();

router.post('/', validateBody(CheckoutSchema), asyncHandler(checkoutController));

export default router;
