document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();

        // Lấy thông tin sản phẩm từ các thuộc tính data
        const productSlug = button.getAttribute("data-slug");
        const productName = button.getAttribute("data-name");
        const productPrice = parseFloat(button.getAttribute("data-price"));
        const productImage = button.getAttribute("data-image");

        // Lấy giá trị size từ radio button
        const selectedSize = document.querySelector('input[name="sizeOptions"]:checked');
        const productSize = selectedSize ? selectedSize.value : null;

        // Lấy giá trị color từ radio button
        const selectedColor = document.querySelector('input[name="colorOptions"]:checked');
        const productColor = selectedColor ? selectedColor.value : null;

        // Kiểm tra nếu chưa chọn size hoặc color
        if (!productSize || !productColor) {
            showToast("Vui lòng chọn size và màu sắc trước khi thêm vào giỏ hàng.", 'error', 'Error');
            return;
        }

        // Lấy giá trị số lượng từ input
        const quantityInput = document.getElementById("sst");
        const quantity = parseInt(quantityInput.value) || 1; // Mặc định là 1 nếu không hợp lệ

        // Lấy giỏ hàng từ localStorage hoặc tạo mới nếu chưa có
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
       // const cart =   [];
        // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng hay chưa (dựa trên slug, size, color)
        const existingProduct = cart.find(
            (item) =>
                item.slug === productSlug &&
                item.size === productSize &&
                item.color === productColor
        );

        if (existingProduct) {
            // Nếu sản phẩm đã tồn tại, tăng số lượng
            existingProduct.quantity += quantity;
        } else {
            // Nếu chưa có sản phẩm, tạo mới và thêm vào giỏ hàng
            cart.push({
                slug: productSlug,
                name: productName,
                price: productPrice,
                image: productImage,
                size: productSize,
                color: productColor,
                quantity: quantity,
            });
        }

        // Lưu lại giỏ hàng vào localStorage
        localStorage.setItem("cart", JSON.stringify(cart));

        // Cập nhật lại giao diện giỏ hàng hoặc hiển thị thông báo
        showToast(`${quantity} x ${productName} (Size: ${productSize}, Color: ${productColor}) đã được thêm vào giỏ hàng!`, 'success', 'Success');

        // Cập nhật số lượng hiển thị trên biểu tượng giỏ hàng
        updateCartCount();

        // Gửi sự kiện "add_to_cart" đến Google Analytics
        gtag('event', 'add_to_cart', {
            'currency': 'VND', // Hoặc USD nếu cần
            'value': productPrice * quantity, // Tổng giá trị của sản phẩm trong giỏ
            'items': [{
                'item_name': productName,  // Tên sản phẩm
                'item_id': productSlug,    // ID sản phẩm
                'quantity': quantity,      // Số lượng
                'price': productPrice,     // Giá sản phẩm
                'size': productSize,       // Kích thước
                'color': productColor      // Màu sắc
            }]
        });
    });
});

// Hàm cập nhật số lượng trên biểu tượng giỏ hàng
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        cartCountElement.innerText = totalItems;
    }
}

// Khởi tạo cập nhật số lượng giỏ hàng khi tải trang
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
});
