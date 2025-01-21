const Review = require('../models/Review');

class ReviewService {
  static async getReviewsByProductId(productId, page = 1, limit = 5) {
    const skip = (page - 1) * limit;
    const totalReviews = await Review.countDocuments({ productId });

    const reviews = await Review.find({ productId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalReviews / limit);

    return {
      reviews,
      totalReviews,
      totalPages,
      currentPage: page,
    };
  }

  static async submitReview(data) {
    const { productId, rating, comment, userId } = data;

    const review = new Review({
      productId,
      userId,
      rating,
      comment,
    });

    await review.save();
    return;
  }

  static async getOverallRating(productId) {
    console.log('sp trước: ',productId);
    const result = await Review.aggregate([
      { $match: { productId } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } },
    ]);
    console.log('result:', result); // Log để kiểm tra kết quả truy vấn
    return result.length > 0 ? result[0].averageRating.toFixed(1) : 0;
  }

  static async getRatingBreakdown(productId) {
    const result = await Review.aggregate([
      { $match: { productId } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
    ]);
    const breakdown = { "5": { count: 0 }, "4": { count: 0 }, "3": { count: 0 }, "2": { count: 0 }, "1": { count: 0 } };
    result.forEach(item => {
      breakdown[item._id] = { count: item.count };
    });
    return breakdown;
  }

  static async fetchReviews(productId, page = 1, limit = 5) {
    const skip = (page - 1) * limit;

    const totalReviews = await Review.countDocuments({ productId });
    const reviews = await Review.find({ productId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalPages = Math.ceil(totalReviews / limit);

    return {
      reviews,
      totalReviews,
      totalPages,
      currentPage: parseInt(page),
    };
  }

  static async getAllReviewsByProductId(productId) {
    

    const reviews = await Review.find({ productId });
      

    

    return {
      reviews,
     
    };
  }

}

module.exports = ReviewService;