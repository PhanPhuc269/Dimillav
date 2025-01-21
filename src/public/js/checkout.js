document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const orderItemsContainer = document.getElementById("order-items");
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");
    const shippingCost = 0; // Flat shipping rate
    let subtotal = 0;

    // Xóa dữ liệu cũ trong danh sách sản phẩm
    orderItemsContainer.innerHTML = "";

    // Hàm định dạng tiền VND với phân cách ngàn
    function formatCurrencyVND(value) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    }

    // Hiển thị danh sách sản phẩm từ giỏ hàng
    cart.forEach((item) => {
        const productTotal = item.price * item.quantity;
        subtotal += productTotal;

        const productItem = document.createElement("div");
        productItem.classList.add("order-item");
        productItem.style.padding = "15px";
        productItem.style.borderBottom = "1px solid #ddd";
        productItem.style.display = "flex";
        productItem.style.alignItems = "center";
        productItem.style.justifyContent = "space-between";

        productItem.innerHTML = `
            <div style="display: flex; align-items: center;">
                <a href="/product/product-details/${item.slug}" style="text-decoration: none;">
                    <img src="${item.image}" alt="${item.name}" style="width: 70px; height: 70px; margin-right: 15px; border: 1px solid #ddd; border-radius: 5px;">
                </a>
                <div>
                    <a href="/product/product-details/${item.slug}" style="text-decoration: none; color: #333;">
                        <h5 style="margin: 0; font-size: 16px; font-weight: bold;">${item.name}</h5>
                    </a>
                    <p style="margin: 5px 0 0; font-size: 14px; color: #555;">Size: ${item.size}, Color: ${item.color}</p>
                    <p style="margin: 5px 0 0; font-size: 14px; color: #555;">Quantity: ${item.quantity}</p>
                </div>
            </div>
            <div style="text-align: right;">
                <span style="font-size: 16px; font-weight: bold; color: #333;">${formatCurrencyVND(productTotal)}</span>
            </div>
        `;

        orderItemsContainer.appendChild(productItem);
    });

    // Cập nhật Subtotal và Total
    const total = subtotal + shippingCost;
    subtotalElement.textContent = formatCurrencyVND(subtotal);
    totalElement.textContent = formatCurrencyVND(total);
});

document.addEventListener("DOMContentLoaded", () => {
    const checkoutForm = document.getElementById("checkout-form");

    checkoutForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Ngăn form tự động gửi đi
        const formData = new FormData(checkoutForm);

        // Chuẩn bị dữ liệu đơn hàng
        const orderData = {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            phoneNumber: formData.get("phoneNumber"),
            email: formData.get("email"),
            addressLine1: formData.get("addressLine1"),
            city: formData.get("city"),
            district: formData.get("district"),
            zip: formData.get("zip"),
            orderNotes: formData.get("orderNotes"),
           
        };
console.log('form',orderData)
        try {
            // Gửi dữ liệu đơn hàng đến server
            const response = await fetch("/order/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",

                },
                body: JSON.stringify(orderData),
            });

            const result = await response.json();
          
            if (response.ok) {
                // Xóa giỏ hàng trong localStorage
                //localStorage.removeItem("cart");

                // Xóa giỏ hàng trong database
                await fetch("/cart/clear", {
                    method: "DELETE",
                });

                // Hiển thị thông báo thành công và chuyển hướng
                showToast('Your order has been placed successfully!', 'success', 'Create order completed',3000);
              
                window.location.href = "/order/list"; // Điều hướng đến trang xác nhận
            } else {
                showToast(result.message || "Failed to place the order. Please try again.", 'error', 'Error',3000);
               
            }
        } catch (error) {
            console.error("Error placing the order:", error);
            showToast("An error occurred while placing your order. Please try again.", 'error', 'Error',3000);
           
        }
    });
});
