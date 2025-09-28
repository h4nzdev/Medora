
import express from 'express';
import {
  getReviewsForDoctor,
  createReview,
} from '../controller/reviewController.js';

const router = express.Router();

// @desc    Get all reviews for a specific doctor
// @route   GET /api/reviews/doctor/:doctorId
// @access  Public
router.get('/doctor/:doctorId', getReviewsForDoctor);

// @desc    Create a new review
// @route   POST /api/reviews/
// @access  Private (Patient)
router.post('/', createReview);

export default router;
