document.addEventListener("DOMContentLoaded", () => {
    console.log('cc: ', localStorage.getItem("cart"))
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.getElementById("cart-items");
    const proceedButton = document.getElementById("proceed-button"); // Nút Proceed

    // Hàm định dạng tiền VND
    function formatCurrencyVND(value) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    }

    // Hàm cập nhật giao diện giỏ hàng
    function updateCart() {
        cartItemsContainer.innerHTML = "";
        let totalPrice = 0;
        let totalQuantity = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">Your cart is empty!</td>
                </tr>`;
            updateTotalPrice(0);
            updateCartCount(0);

            // Disable proceed button when cart is empty
            if (proceedButton) {
                proceedButton.href = "#"; // Không dẫn đến đâu
                proceedButton.classList.add("disabled");
                proceedButton.setAttribute("disabled", "disabled");
            }
            return;
        }

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            totalQuantity += item.quantity;

            const row = `
                <tr>
                    <td>
                        <div class="media">
                            <a href="/product/product-details/${item.slug}">
                                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;" class="img-fluid mr-3">
                            </a>
                            <div class="media-body">
                                <a href="/product/product-details/${item.slug}">
                                    <p>${item.name}</p>
                                </a>
                                <small>Size: ${item.size} | Color: ${item.color}</small>
                            </div>
                        </div>
                    </td>
                    <td>${formatCurrencyVND(item.price)}</td>
                    <td>
                        <div class="quantity-controls">
                            <button class="decrease-qty btn btn-sm btn-outline-secondary" data-slug="${item.slug}" data-size="${item.size}" data-color="${item.color}">-</button>
                            <input type="text" value="${item.quantity}" class="qty-input text-center" readonly style="width: 40px;">
                            <button class="increase-qty btn btn-sm btn-outline-secondary" data-slug="${item.slug}" data-size="${item.size}" data-color="${item.color}">+</button>
                        </div>
                        <small class="text-muted stock-info" id="stock-info-${index}">Loading stock...</small>
                    </td>
                    <td>${formatCurrencyVND(itemTotal)}</td>
                    <td>
                        <button class="btn btn-danger btn-sm remove-item" data-index="${index}">Remove</button>
                    </td>
                </tr>`;
            cartItemsContainer.insertAdjacentHTML("beforeend", row);

            // Fetch stock info for each item
            fetchStockInfo(item.slug, item.size, item.color, index);
        });

        const totalRow = `
            <tr>
                <td colspan="4" class="text-right"><strong>Total Price:</strong></td>
                <td><h5 id="cart-total">${formatCurrencyVND(totalPrice)}</h5></td>
            </tr>`;
        cartItemsContainer.insertAdjacentHTML("beforeend", totalRow);

        updateTotalPrice(totalPrice);
        updateCartCount(totalQuantity);

        // Enable proceed button when cart has items
        if (proceedButton) {
            proceedButton.href = "/order/checkout"; // Liên kết tới checkout
            proceedButton.classList.remove("disabled");
            proceedButton.removeAttribute("disabled");
        }
    }

    function fetchStockInfo(slug, size, color, index) {
        fetch(`/product/stock?slug=${slug}&size=${size}&color=${color}`)
            .then(response => response.json())
            .then(data => {
                const stockInfoElement = document.getElementById(`stock-info-${index}`);
                if (data.quantity >= 0) {
                    stockInfoElement.innerText = `Stock: ${data.quantity}`;
                    stockInfoElement.dataset.maxStock = data.quantity;
                } else {
                    stockInfoElement.innerText = `Out of stock`;
                }
            })
            .catch(error => {
                console.error('Error fetching stock info:', error);
            });
    }

    function updateCartCount(count) {
        const cartCountElement = document.getElementById("cart-count");
        if (cartCountElement) cartCountElement.innerText = count;
    }

    function updateTotalPrice(total) {
        const totalElement = document.getElementById("cart-total");
        if (totalElement) totalElement.innerText = formatCurrencyVND(total);
    }

    cartItemsContainer.addEventListener("click", (event) => {
        const slug = event.target.getAttribute("data-slug");
        const size = event.target.getAttribute("data-size");
        const color = event.target.getAttribute("data-color");

        if (event.target.classList.contains("increase-qty")) {
            const product = cart.find((item) => item.slug === slug && item.size === size && item.color === color);
            const stockInfoElement = document.querySelector(`#stock-info-${cart.indexOf(product)}`);
            const maxStock = parseInt(stockInfoElement.dataset.maxStock);

            if (product && product.quantity < maxStock) {
                product.quantity++;
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCart();
            }
        }

        if (event.target.classList.contains("decrease-qty")) {
            const product = cart.find((item) => item.slug === slug && item.size === size && item.color === color);
            if (product && product.quantity > 1) {
                product.quantity--;
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCart();
            }
        }

        if (event.target.classList.contains("remove-item")) {
            const itemIndex = parseInt(event.target.getAttribute("data-index"));
            cart.splice(itemIndex, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCart();
        }
    });

    // Khởi tạo hiển thị
    updateCart();
});
