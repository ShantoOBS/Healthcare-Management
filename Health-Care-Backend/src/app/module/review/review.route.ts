import express from 'express';
import { Role } from '../../../generated/prisma/enums.js';
import { checkAuth } from '../../middleware/checkAuth.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { ReviewController } from './review.controller.js';
import { ReviewValidation } from './review.validation.js';

const router = express.Router();

router.get('/', ReviewController.getAllReviews);

router.post(
    '/',
    checkAuth(Role.PATIENT),
    validateRequest(ReviewValidation.createReviewZodSchema),
    ReviewController.giveReview
);

router.get('/my-reviews', checkAuth(Role.PATIENT, Role.DOCTOR), ReviewController.myReviews);

router.patch('/:id', checkAuth(Role.PATIENT), validateRequest(ReviewValidation.updateReviewZodSchema), ReviewController.updateReview);

router.delete('/:id', checkAuth(Role.PATIENT), ReviewController.deleteReview);




export const ReviewRoutes = router;