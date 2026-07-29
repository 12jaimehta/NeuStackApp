import { Request, Response } from 'express';
import { getAdminStats } from './admin.service';
import { sendSuccess } from '../../shared/utils/apiResponse';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../../constants';

export function getStatsController(_req: Request, res: Response): void {
  const stats = getAdminStats();
  sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.STATS_FETCHED, stats);
}
