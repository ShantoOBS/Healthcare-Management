import express from 'express';
import { Role } from '../../../generated/prisma/browser.js';
import { checkAuth } from '../../middleware/checkAuth.js';
import { StatsController } from './stats.controller.js';

const router = express.Router();

router.get(
    '/',
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.PATIENT),
    StatsController.getDashboardStatsData
)


export const StatsRoutes = router;