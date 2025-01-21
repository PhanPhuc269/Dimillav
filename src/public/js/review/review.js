document.addEventListener('DOMContentLoaded', function () {
    const reviewForm = document.getElementById('reviewForm');
    const selectedRatingElement = document.getElementById('selected-rating');
    const ratingInput = document.querySelector('input[name="rating"]');

    // Hàm chọn đánh giá
    window.selectRating = function (rating) {
        selectedRatingElement.textContent = `${rating} Star${rating > 1 ? 's' : ''}`;
        ratingInput.value = rating;

        // Cập nhật màu sắc sao
        const stars = reviewForm.querySelectorAll('.fa-star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('checked');
                star.classList.remove('fa-star-o');
            } else {
                star.classList.remove('checked');
                star.classList.add('fa-star-o');
            }
        });
    };

    // Xử lý gửi form
    reviewForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(reviewForm);
        const data = {
            productId: formData.get('productId'),
            rating: formData.get('rating'),
            comment: formData.get('comment'),
            slug: formData.get('slug'),
        };

        fetch('/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Phản hồi JSON:', data);
                if (data.success) {
                    // Cập nhật Overall Rating và Total Reviews
                    document.querySelector('.box_total h4').textContent = data.overallRating;
                    document.querySelector('.box_total h6').textContent = `(${data.totalReviews} Reviews)`;
                    document.querySelector('.rating_list h3').textContent = `Based on ${data.totalReviews} Reviews`;

                    // Cập nhật Rating Breakdown
                    const ratingList = document.querySelector('.rating_list .list');
                    ratingList.innerHTML = '';
                    for (let [rating, info] of Object.entries(data.ratingBreakdown)) {
                        const li = document.createElement('li');
                        li.innerHTML = `
                            <a href="#">
                                ${rating} Star 
                                ${renderStars(rating)}
                                ${info.count}
                            </a>
                        `;
                        ratingList.appendChild(li);
                    }

                    // Cập nhật Review List
                    const reviewList = document.getElementById('review-list');
                    reviewList.innerHTML = '';
                    data.reviews.forEach(review => {
                        const reviewItem = document.createElement('div');
                        reviewItem.classList.add('review_item', 'mb-4');
                        reviewItem.innerHTML = `
                            <div class="media">
                                <div class="media-body ml-3">
                                    <h4>${review.userId.username}</h4>
                                    <div class="rating mb-2">
                                        ${renderStars(review.rating)}
                                    </div>
                                </div>
                            </div>
                            <p>${review.comment}</p>
                        `;
                        reviewList.appendChild(reviewItem);
                    });

                    // Reset form
                    reviewForm.reset();
                    selectedRatingElement.textContent = 'Star';
                    ratingInput.value = 0;
                    const stars = reviewForm.querySelectorAll('.fa-star');
                    stars.forEach(star => {
                        star.classList.remove('checked');
                        star.classList.add('fa-star-o');
                    });

                    // Hiển thị thông báo thành công bằng showToast
                    showToast('Đánh giá đã được gửi thành công!', 'success', 'Thành công');
                } else {
                    // Hiển thị thông báo lỗi bằng showToast
                    showToast(data.message || 'Không thể gửi đánh giá.', 'error', 'Lỗi');
                }
            })
            .catch(error => {
                console.error('Error submitting review:', error);
                // Hiển thị thông báo lỗi bằng showToast
                showToast('Đã xảy ra lỗi khi gửi đánh giá.', 'error', 'Lỗi');
            });
    });

    // Hàm tạo các biểu tượng sao
    function renderStars(rating) {
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                starsHtml += `<i class="fa fa-star checked"></i>`;
            } else {
                starsHtml += `<i class="fa fa-star-o"></i>`;
            }
        }
        return starsHtml;
    }
});
