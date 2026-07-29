import { Router } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { getStatsController } from './admin.controller';
import discountRoutes from '../discount/discount.routes';

const router = Router();

router.get('/stats', asyncHandler(getStatsController));

router.use('/discount', discountRoutes);

export default router;
