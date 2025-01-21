//selected-product.js
document.addEventListener('DOMContentLoaded', function () {
    const colorOptions = document.querySelectorAll('input[name="colorOptions"]');
    const sizeOptions = document.querySelectorAll('input[name="sizeOptions"]');
    const stockQuantitySpan = document.getElementById('stock-quantity');
    const quantityInput = document.getElementById('sst'); // Added reference to quantity input
    const productStock = JSON.parse(document.getElementById('product-stock-data').textContent);

    function getSizesForColor(stock, color) {
        return [...new Set(stock.filter(item => item.color === color).map(item => item.size))];
    }

    function getColorsForSize(stock, size) {
        return [...new Set(stock.filter(item => item.size === size).map(item => item.color))];
    }

    function updateOptions() {
        const selectedColor = document.querySelector('input[name="colorOptions"]:checked')?.value;
        const selectedSize = parseInt(document.querySelector('input[name="sizeOptions"]:checked')?.value);

        // Enable/disable options based on selection
        colorOptions.forEach(option => {
            // Reset disabled state
            option.disabled = false;
            // Nếu có size được chọn, disable các màu không hợp lệ
            if (selectedSize) {
                option.disabled = !getColorsForSize(productStock, selectedSize).includes(option.value);
            }
            option.nextElementSibling.style.display = 'inline-block'; // Luôn hiển thị label
        });

        sizeOptions.forEach(option => {
            const sizeValue = parseInt(option.value);
            // Reset disabled state
            option.disabled = false;
            // Nếu có màu được chọn, disable các size không hợp lệ
            if (selectedColor) {
                option.disabled = !getSizesForColor(productStock, selectedColor).includes(sizeValue);
            }
            option.nextElementSibling.style.display = 'inline-block'; // Luôn hiển thị label
        });

        // Update stock quantity display and set max for quantity input
        const totalStock = getTotalStock(selectedColor, selectedSize);
        stockQuantitySpan.textContent = `${totalStock} sản phẩm có sẵn`;
        quantityInput.max = totalStock; // Set max attribute
        if (parseInt(quantityInput.value) > totalStock) {
            quantityInput.value = totalStock;
        }
    }

    function getTotalStock(selectedColor, selectedSize) {
        let totalStock = 0;
        if (selectedColor && !isNaN(selectedSize)) {
            const item = productStock.find(item => item.color === selectedColor && item.size === selectedSize);
            totalStock = item ? item.quantity : 0;
        } else if (selectedColor) {
            totalStock = productStock.filter(item => item.color === selectedColor).reduce((sum, item) => sum + item.quantity, 0);
        } else if (!isNaN(selectedSize)) {
            totalStock = productStock.filter(item => item.size === selectedSize).reduce((sum, item) => sum + item.quantity, 0);
        } else {
            totalStock = productStock.reduce((sum, item) => sum + item.quantity, 0);
        }
        return totalStock;
    }

    function handleOptionDoubleClick(event) {
        const label = event.target; // Lấy label được double click
        const input = label.previousElementSibling; // Lấy input radio

        // Bỏ chọn input
        input.checked = false;
        // Cập nhật lại options
        updateOptions();
    }

    // Handle quantity increase
    document.querySelector('.increase.items-count').addEventListener('click', function (e) {
        e.preventDefault();
        let current = parseInt(quantityInput.value);
        const max = parseInt(quantityInput.max);
        if (!isNaN(current) && current < max) {
            quantityInput.value = current + 1;
        }
    });

    // Handle quantity decrease
    document.querySelector('.reduced.items-count').addEventListener('click', function (e) {
        e.preventDefault();
        let current = parseInt(quantityInput.value);
        if (!isNaN(current) && current >= 1) {
            quantityInput.value = current - 1;
        }
    });

    // Validate manual input
    quantityInput.addEventListener('input', function () {
        let value = parseInt(this.value);
        const max = parseInt(this.max);
        if (isNaN(value) || value < 1) {
            this.value = 1;
        } else if (value > max) {
            this.value = max;
        }
    });


    // Initial update and attach event listeners
    updateOptions();
    // Gắn sự kiện 'change' cho các input radio để khi chọn bằng cách click thông thường
    colorOptions.forEach(option => option.addEventListener('change', updateOptions));
    sizeOptions.forEach(option => option.addEventListener('change', updateOptions));

    // Gắn sự kiện 'dblclick' cho các label
    colorOptions.forEach(option => option.nextElementSibling.addEventListener('dblclick', handleOptionDoubleClick));
    sizeOptions.forEach(option => option.nextElementSibling.addEventListener('dblclick', handleOptionDoubleClick));
});