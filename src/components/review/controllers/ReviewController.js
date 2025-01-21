const ReviewService = require('.././services/ReviewService');

class ReviewController {
  static async getReviewsByProductId(productId, page = 1, limit = 5) {
    return await ReviewService.getReviewsByProductId(productId, page, limit);
  }

  static async submitReview(req, res, next) {
    try {
        const { productId, rating, comment, slug } = req.body;
        const userId = req.user._id;

        const ratingNumber = parseInt(rating, 10);

        await ReviewService.submitReview({ productId, rating: ratingNumber, comment, userId });
        console.log('Review submitted successfully.');

        if (req.xhr) {
            // If AJAX request, send JSON response
            const data = await ReviewService.getReviewsByProductId(productId, 1, 5);
           
         const allData=await ReviewService.getAllReviewsByProductId(productId)
        //  Tính overallRating từ data
        const reviews = allData.reviews || [];
      
        const overallRating = reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1): 0;
        
        
            const ratingBreakdown = await ReviewService.getRatingBreakdown(productId);
            console.log('Fetched Rating Breakdown:', ratingBreakdown);
            console.log('dl: ',data.reviews)
            res.json({
                success: true,
                reviews: data.reviews,
                currentPage: data.currentPage,
                totalPages: data.totalPages,
                overallRating,
                ratingBreakdown,
                totalReviews: data.totalReviews,
            });
        } else {
            // Regular form submission
            res.redirect(`/product/product-details/${slug}`);
        }
    } catch (error) {
        if (req.xhr) {
            res.status(500).json({ success: false, message: 'Error submitting review', error });
        } else {
            next(error);
        }
    }
  }

  static async getOverallRating(productId) {
    return await ReviewService.getOverallRating(productId);
  }

  static async getRatingBreakdown(productId) {
    return await ReviewService.getRatingBreakdown(productId);
  }

  static async fetchReviews(req, res, next) {
    try {
      const { productId, page = 1, limit = 5 } = req.query;

      const data = await ReviewService.fetchReviews(productId, page, limit);
      res.json(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ message: 'Error fetching reviews', error });
    }
  }
}

module.exports = ReviewController;