

document.addEventListener('DOMContentLoaded', function () {
    const pagination = document.querySelector('.pagination');
    const reviewList = document.getElementById('review-list');
    const productId = reviewList.dataset.productId;

    pagination.addEventListener('click', function (e) {
      e.preventDefault();
      const target = e.target.closest('a');
      if (target && target.dataset.page) {
        const page = target.dataset.page;
        // Bỏ qua dòng const productId = productId;

        fetch(`/reviews?productId=${productId}&page=${page}`)
          .then(response => response.json())
          .then(data => {
            // Cập nhật danh sách đánh giá
            let reviewsHtml = '';
            data.reviews.forEach(review => {
              reviewsHtml += `
                <div class="review_item mb-4">
                  <div class="media">
                    <div class="media-body ml-3">
                      <h4>${review.userId.username}</h4>
                      <div class="rating mb-2">
                        ${renderStars(review.rating)}
                      </div>
                    </div>
                  </div>
                  <p>${review.comment}</p>
                </div>
              `;
            });
            reviewList.innerHTML = reviewsHtml;
  
            // Cập nhật phân trang
            updatePagination(data.currentPage, data.totalPages);
          })
          .catch(error => console.error('Error fetching reviews:', error));
      }
    });
  
    function renderStars(rating) {
      let stars = '';
      for (let i = 1; i <= 5; i++) {
        stars += `<i class="fa ${i <= rating ? 'fa-star checked' : 'fa-star-o'}"></i>`;
      }
      return stars;
    }
  
    function updatePagination(currentPage, totalPages) {
      let paginationHtml = '';
  
      if (currentPage > 1) {
        paginationHtml += `
          <li class="page-item">
            <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
        `;
      }
  
      for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `
          <li class="page-item ${i === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" data-page="${i}">${i}</a>
          </li>
        `;
      }
  
      if (currentPage < totalPages) {
        paginationHtml += `
          <li class="page-item">
            <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        `;
      }
  
      pagination.innerHTML = paginationHtml;
    }
  });