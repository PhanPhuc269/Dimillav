document.addEventListener("DOMContentLoaded", () => {
    const cartCountElement = document.getElementById("cart-count");

    // Kiểm tra nếu phần tử đếm số lượng giỏ hàng tồn tại
    if (!cartCountElement) {
        console.warn("Cart count element not found.");
        return;
    }

    // Hàm tính tổng số lượng sản phẩm trong giỏ
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        // Tính tổng số lượng từ tất cả các sản phẩm (bao gồm cả size và color)
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }

    // Cập nhật số lượng khi trang được tải
    updateCartCount();

    // Để sử dụng lại hàm này trong các file khác, đảm bảo bạn gọi đúng `updateCartCount` sau mỗi thao tác thay đổi giỏ hàng.
});
