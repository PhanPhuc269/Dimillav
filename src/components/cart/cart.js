document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.getElementById("cart-items");

    // let cartUpdateQueue = []; // Queue lưu thay đổi giỏ hàng

    // // Hàm thêm thay đổi vào queue
    // function addToCartQueue(productSlug, quantity, price) {
    //     const existingIndex = cartUpdateQueue.findIndex((item) => item.slug === productSlug);
    //     if (existingIndex > -1) {
    //         cartUpdateQueue[existingIndex] = { productSlug, quantity, price };
    //     } else {
    //         cartUpdateQueue.push({ productSlug, quantity, price });
    //     }
    // }

    // Gửi batch lên server định kỳ
    // async function processCartUpdates() {
    //     if (cartUpdateQueue.length === 0) return;
    //     console.log(cartUpdateQueue);
    //     const updatesToSend = [...cartUpdateQueue];
    //     console.log('update:',updatesToSend);
    //     cartUpdateQueue = []; // Xóa queue sau khi gửi

    //     try {
    //         const response = await fetch('/cart/update-batch', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ updates: updatesToSend }),
    //         });

    //         if (response.ok) {
    //             console.log('Batch cập nhật giỏ hàng thành công!');
    //         } else {
    //             console.error('Lỗi khi batch cập nhật');
    //             cartUpdateQueue = updatesToSend.concat(cartUpdateQueue); // Đẩy lại queue nếu lỗi
    //         }
    //     } catch (error) {
    //         console.error('Lỗi kết nối server:', error);
    //         cartUpdateQueue = updatesToSend.concat(cartUpdateQueue);
    //     }
    // }

    // // Gửi batch mỗi 1 giây
    // setInterval(processCartUpdates, 1000);

    // Hàm cập nhật giao diện giỏ hàng
    function updateCart() {
        cartItemsContainer.innerHTML = "";
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <tr>
                    <td colspan="5">Your cart is empty!</td>
                </tr>`;
            updateTotalPrice(0);
            return;
        }

        cart.forEach((item, index) => {
            const row = document.createElement("tr");
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;

            row.innerHTML = `
                <td>
                    <div class="media">
                        <div class="d-flex">
                            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;">
                        </div>
                        <div class="media-body">
                            <p>${item.name}</p>
                        </div>
                    </div>
                </td>
                <td><h5>$${item.price.toFixed(2)}</h5></td>
                <td>
                    <div class="quantity-controls">
                        <button class="decrease-qty" data-slug="${item.slug}">-</button>
                        <input type="text" value="${item.quantity}" class="qty-input" data-slug="${item.slug}" data-product-id="${item.slug}" data-price="${item.price}" readonly>
                        <button class="increase-qty" data-slug="${item.slug}">+</button>
                    </div>
                </td>
                <td><h5>$${itemTotal.toFixed(2)}</h5></td>
                <td>
                    <button class="btn btn-danger btn-sm remove-item" data-index="${index}">Remove</button>
                </td>
            `;
            cartItemsContainer.appendChild(row);
        });

        const totalRow = document.createElement("tr");
        totalRow.innerHTML = `
            <td colspan="4" class="text-right"><strong>Total Price:</strong></td>
            <td><h5 id="cart-total">$${totalPrice.toFixed(2)}</h5></td>
        `;
        cartItemsContainer.appendChild(totalRow);
    }

    function updateTotalPrice(total) {
        const totalElement = document.getElementById("cart-total");
        if (totalElement) {
            totalElement.innerText = `$${total.toFixed(2)}`;
        }
    }

    // Xử lý sự kiện tăng/giảm số lượng và xóa sản phẩm
    cartItemsContainer.addEventListener("click", (event) => {
        const slug = event.target.getAttribute("data-slug");

        if (event.target.classList.contains("increase-qty")) {
            const product = cart.find((item) => item.slug === slug);
            if (product) {
                product.quantity++;
                localStorage.setItem("cart", JSON.stringify(cart));
             //   addToCartQueue(product.slug, product.quantity, product.price); // Đưa vào queue
                updateCart();
            }
        }

        if (event.target.classList.contains("decrease-qty")) {
            const product = cart.find((item) => item.slug === slug);
            if (product && product.quantity > 1) {
                product.quantity--;
                localStorage.setItem("cart", JSON.stringify(cart));
               // addToCartQueue(product.slug, product.quantity, product.price); // Đưa vào queue
                updateCart();
            }
        }

        if (event.target.classList.contains("remove-item")) {
            const itemIndex = parseInt(event.target.getAttribute("data-index"));
            const product = cart[itemIndex];
            if (product) {
                cart.splice(itemIndex, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
               // addToCartQueue(product.slug, 0, product.price); // Xóa sản phẩm (quantity = 0)
                updateCart();
            }
        }
    });

    // Thêm vào giỏ hàng từ nút "Add to Cart"
    function addToCart(slug, name, price, image, quantity) {
        const existingProduct = cart.find((item) => item.slug === slug);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({ slug, name, price, image, quantity });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
       // addToCartQueue(slug, quantity, price); // Đưa vào queue
        updateCart();
    }

    document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", function () {
            const slug = this.getAttribute("data-slug");
            const name = this.getAttribute("data-name");
            const price = parseFloat(this.getAttribute("data-price"));
            const image = this.getAttribute("data-image");
            const quantityInput = document.getElementById("sst");
            const quantity = parseInt(quantityInput.value) || 1;

            addToCart(slug, name, price, image, quantity);
            showToast(`${quantity} x ${name} added to cart!`, 'success', 'Success');
        });
    });

    // Khởi tạo hiển thị
    updateCart();
});
