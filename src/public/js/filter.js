
let filters = {};

// Lấy giá trị ban đầu từ URL
const urlParams = new URLSearchParams(window.location.search);
filters.keyword = urlParams.get('keyword') || '';
filters.type = urlParams.get('type') || '';
filters.brand = urlParams.get('brand') ? urlParams.get('brand').split(',') : [];
filters.color = urlParams.get('color') ? urlParams.get('color').split(',') : [];
filters.minPrice = urlParams.get('minPrice') || '';
filters.maxPrice = urlParams.get('maxPrice') || '';
filters.sort = urlParams.get('sort') || 'default';
filters.page = parseInt(urlParams.get('page')) || 1;
filters.limit = parseInt(urlParams.get('limit')) || 12;

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');    
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get('keyword');
    const searchInput = document.getElementById('search_input');

    if (keyword && searchInput) {
        searchInput.value = keyword;
        filters.keyword = keyword;
    }

    if (filters.type) {
        // Tìm danh mục con tương ứng với giá trị type
        const subcategoryItem = document.querySelector(`[data-type="${filters.type}"]`);

        if (subcategoryItem) {
            // Tô màu danh mục con
            const categoryItem = document.getElementById(filters.type);
            categoryItem.classList.add('active');
            const collapseElement = subcategoryItem.closest('ul.collapse');
            if (collapseElement) {
                collapseElement.classList.add('show'); // Bootstrap class để mở danh mục
            }
        }
    }
    else{
        const categoryItem = document.getElementById('all');
        categoryItem.classList.add('active');
    }
    const typeInput = document.querySelector(`input[name="type"][value="${filters.type}"]`);
    if (typeInput) typeInput.checked = true;

    document.querySelectorAll('input[name="brand"]').forEach(input => {
        input.checked = filters.brand.includes(input.value);
    });

    const colorInput = document.querySelectorAll('input[name="color"]');
    colorInput.forEach(input => {
        input.checked = filters.color.includes(input.value);
    });

    const minPriceElement = document.getElementById('lower-value');
    const maxPriceElement = document.getElementById('upper-value');
    if (minPriceElement) minPriceElement.value = filters.minPrice;
    if (maxPriceElement) maxPriceElement.value = filters.maxPrice;

    const sortSelect = document.getElementById('sort-criteria');
    if (sortSelect) sortSelect.value = filters.sort;
    // Lắng nghe sự kiện submit của form
    searchForm.addEventListener('submit', function(event) {
        const currentUrl = window.location.pathname;
        if (currentUrl.includes('/product/search')) {
            event.preventDefault(); // Ngăn chặn hành vi submit mặc định
            // Lấy giá trị từ ô input
            var keyword = searchInput.value.trim();
            
            // Cập nhật giá trị keyword trong filters
            filters.keyword = keyword;
            filters.page = 1;
            applyFilters();

            // Gửi yêu cầu AJAX nếu đang ở trang tìm kiếm
            fetch(`/product/search?keyword=${encodeURIComponent(filters.keyword)}`, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => {
                console.log('Response received:', response);
                return response.json();
            })
            .then(data => {
                // Xử lý dữ liệu trả về từ server
                console.log(data);
                // Cập nhật giao diện với dữ liệu mới
                // Ví dụ: cập nhật danh sách sản phẩm
                updateProductList(data.products);
            })
            .catch(error => console.error('Error:', error));
        }
        
    });
});
function setTypeFilter(type) {
    filters.type = type;
    filters.page = 1;
    applyFilters();
    setActiveCategory(type);
}

function setActiveCategory(type) {
    const categoryLinks = document.querySelectorAll('.main-nav-list.child a');
    const categoryItem = document.getElementById('all');
    categoryItem.classList.remove('active');
    categoryLinks.forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.getElementById(`${type}`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    if (!type) {
        categoryItem.classList.add('active');
    }
}

function getCheckedValues(name) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

function filterProducts(filters) {
    const query = new URLSearchParams(filters).toString();
    history.pushState(null, '', `?${query}`);

    fetch(`/product/filter?${query}`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            updateProductList(data.products);
            updatePagination(data.currentPage, data.totalPages);
        })
        .catch(error => console.error('Error:', error));
}

function updatePagination(currentPage, totalPages) {
    const paginationContainers = document.querySelectorAll('.pagination');
    paginationContainers.forEach(paginationContainer => {
        paginationContainer.innerHTML = '';

        if (currentPage > 1) {
            paginationContainer.innerHTML += `<a href="#" class="prev-arrow" onclick="changePage(${currentPage - 1})"><i class="fa fa-long-arrow-left" aria-hidden="true"></i></a>`;
        }

        for (let i = 1; i <= totalPages; i++) {
            paginationContainer.innerHTML += `<a href="#" class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</a>`;
        }

        if (currentPage < totalPages) {
            paginationContainer.innerHTML += `<a href="#" class="next-arrow" onclick="changePage(${currentPage + 1})"><i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>`;
        }
    });
    const paginationInfo = document.getElementById('pagination-info');
    if (paginationInfo) {
        paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }
}

function changePage(page) {
    filters.page = page;
    applyFilters();
}

function formatCurrencyVND(amount) {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

function updateProductList(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Xóa danh sách sản phẩm cũ

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('col-lg-4', 'col-md-6');
        productItem.innerHTML = `
            <div class="single-product">
                <a href="/product/product-details/${product.slug}">
                    <img class="img-fluid" src="${product.images[0]}" alt="${product.name}">
                </a>
                <div class="product-details">
                    <a href="/product/product-details/${product.slug}">
                        <h6>${product.name}</h6>
                    </a>
                    <div class="price">
                        <h6>${formatCurrencyVND(product.salePrice)}</h6>
                          <h6 class="l-through">${formatCurrencyVND(product.originalPrice)}</h6>
                    </div>
                   
                </div>
            </div>
        `;

        productList.appendChild(productItem);
    });

   
}

function updateItemsPerPage(limit) {
    filters.limit = parseInt(limit);
    filters.page = 1;

        
    // Đồng bộ giá trị dropdown trên giao diện
    const selectTop = document.querySelector('#items-per-page');
    const selectBottom = document.querySelector('#items-per-page-bottom');

    selectTop.value = limit; 
    selectBottom.value = limit;

        // Cập nhật giao diện tùy chỉnh của nice-select
    const niceSelectCurrent = selectTop.nextElementSibling.querySelector('.current');
    if (niceSelectCurrent) {
        niceSelectCurrent.textContent = `Show ${limit}`;
    }
        // Cập nhật giao diện tùy chỉnh của nice-select
    const niceSelectCurrentBottom = selectBottom.nextElementSibling.querySelector('.current');
    if (niceSelectCurrentBottom) {
        niceSelectCurrentBottom.textContent = `Show ${limit}`;
    }
    
    applyFilters();
}

function applySort(sort) {
    filters.sort = sort;
    filters.page = 1;
    applyFilters();
}

function applyFilters() {
    filters.brand = getCheckedValues('brand');
    filters.color = getCheckedValues('color');


    const minPrice = parseCurrencyVND(document.getElementById('lower-value')?.textContent);
    const maxPrice = parseCurrencyVND(document.getElementById('upper-value')?.textContent);

    if (minPrice) filters.minPrice = minPrice;
    if (maxPrice) filters.maxPrice = maxPrice;

    const query = new URLSearchParams(filters).toString();
    history.pushState(null, '', `?${query}`);

    filterProducts(filters);
}

function parseCurrencyVND(currencyStr) {
    // Loại bỏ các ký tự không phải số và chuyển đổi về số nguyên
    return parseInt(currencyStr.replace(/[^\d]/g, ''), 10);
}
document.addEventListener('DOMContentLoaded', function () {
    const sortSelect = document.querySelector('#sort-criteria');
    if (sortSelect) {
        sortSelect.value = filters.sort;
        sortSelect.addEventListener('change', () => applySort(sortSelect.value));
    }

    const selectLimitTop = document.querySelector('#items-per-page');
    const selectLimitBottom = document.querySelector('#items-per-page-bottom');

    selectLimitTop.value = filters.limit;
    selectLimitBottom.value = filters.limit;

    selectLimitTop.addEventListener('change', (e) => updateItemsPerPage(e.target.value));
    selectLimitBottom.addEventListener('change', (e) => updateItemsPerPage(e.target.value));

    document.querySelectorAll('input[name="type"], input[name="brand"], input[name="color"]').forEach(input => {
        input.addEventListener('change', () => { 
            filters.page = 1;
            applyFilters();
        });
    });

});
function resetFilters() {
    // Reset filters object
    filters = {
        keyword: '',
        type: '',
        brand: [],
        color: [],
        minPrice: '',
        maxPrice: '',
        sort: 'default',
        page: 1,
        limit: 12
    };

    // Reset UI elements
    document.getElementById('search_input').value = '';
    document.querySelectorAll('input[name="brand"]').forEach(input => input.checked = false);
    document.querySelectorAll('input[name="color"]').forEach(input => input.checked = false);

    const lowerValueElement = document.getElementById('lower-value');
    const upperValueElement = document.getElementById('upper-value');
    if (lowerValueElement) lowerValueElement.textContent = '';
    if (upperValueElement) upperValueElement.textContent = '';

    const sortSelect = document.getElementById('sort-criteria');
    if (sortSelect) sortSelect.value = 'default';

    const selectLimitTop = document.querySelector('#items-per-page');
    const selectLimitBottom = document.querySelector('#items-per-page-bottom');
    if (selectLimitTop) selectLimitTop.value = 12;
    if (selectLimitBottom) selectLimitBottom.value = 12;

    // Clear active category
    setActiveCategory('');

    // Apply filters
    applyFilters();
}
