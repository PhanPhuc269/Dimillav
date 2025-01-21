async function syncCartWithServer() {
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
   // console.log('Giỏ hàng local trước khi đồng bộ:', localCart);

    try {
        const itemsToSync = localCart.map(item => ({
            slug: item.slug,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
        }));

        // Gửi yêu cầu đồng bộ giỏ hàng lên server
        const response = await fetch('/cart/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: itemsToSync }),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.cart) {
                // Cập nhật lại giỏ hàng trong localStorage
                //localStorage.setItem('cart', JSON.stringify(data.cart));
               // console.log('Giỏ hàng đồng bộ thành công từ server:', data.cart);
              //  showToast('Giỏ hàng đồng bộ thành công!', 'success', 'Success');
            } else {
                console.warn('Đồng bộ giỏ hàng thành công nhưng không có dữ liệu trả về.');
                showToast('Đồng bộ giỏ hàng thành công nhưng không có dữ liệu trả về.', 'warning', 'Warning');
            }
        } else {
            const errorData = await response.json();
            console.error('Lỗi khi đồng bộ giỏ hàng:', errorData.message || 'Unknown error');

            if (errorData.errors && errorData.errors.length > 0) {
                // Hiển thị lỗi cụ thể từng sản phẩm
                errorData.errors.forEach(error => {
                    showToast(error, 'error', 'Error');
                });
            } else {
                showToast('Lỗi không xác định khi đồng bộ giỏ hàng.', 'error', 'Error');
            }

            // Quay lại trang trước đó nếu có lỗi
           // window.history.back();
        }
    } catch (error) {
        console.error('Lỗi kết nối đến server:', error.message);
        showToast('Không thể kết nối đến máy chủ. Vui lòng thử lại!', 'error', 'Error');

        // Quay lại trang trước đó nếu không thể kết nối
      //  window.history.back();
    }
}

// Gọi hàm đồng bộ khi đăng nhập thành công
syncCartWithServer();
