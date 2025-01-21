// src/components/review/reviewRoutes.js

const express = require('express');
const router = express.Router();
const ReviewController = require('./controllers/ReviewController');
const { ensureAuthenticated } = require('../../middlewares/AuthMiddleware');

// Route to handle review submission
router.post('/', ensureAuthenticated, ReviewController.submitReview);

// Route to fetch reviews for AJAX
router.get('/', ReviewController.fetchReviews);

// Export the router
module.exports = router;