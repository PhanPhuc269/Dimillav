// Lắng nghe sự kiện nhấn vào chi tiết sản phẩm
document.querySelectorAll('.product-detail').forEach((element) => {
    element.addEventListener('click', (event) => {
        event.preventDefault(); // Ngăn chặn hành động mặc định để xử lý sự kiện trước

        // Lấy thông tin sản phẩm từ các thuộc tính data-*
        const productSlug = element.getAttribute('data-slug');
        const productName = element.getAttribute('data-name');
        const productCategory = element.getAttribute('data-category');
        console.log('sp su kien: ',productName);

        // Gửi sự kiện tới Google Analytics
        gtag('event', 'view_product', {
            'event_category': 'Product',
            'event_label': productName,
            'value': productSlug,
            'product_category': productCategory,
        });

        // Điều hướng tới trang chi tiết sản phẩm
        //window.location.href = `/product/product-details/${productSlug}`;
    });
});
