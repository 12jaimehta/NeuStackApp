import { Router } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { generateDiscountController, validateDiscountController } from './discount.controller';

const router = Router();

router.post('/generate', asyncHandler(generateDiscountController));

router.post('/validate', asyncHandler(validateDiscountController));

export default router;
