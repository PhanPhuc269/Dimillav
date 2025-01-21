document.getElementById("searchForm").addEventListener("submit", (event) => {
    const searchInput = document.getElementById("search_input").value.trim();

    if (searchInput) {
        // Lấy danh sách lịch sử tìm kiếm từ localStorage
        let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

        // Loại bỏ từ khóa nếu đã tồn tại, sau đó thêm vào đầu danh sách
        searchHistory = searchHistory.filter((keyword) => keyword !== searchInput);
        searchHistory.unshift(searchInput);

        // Giới hạn lịch sử tìm kiếm (chỉ lưu 10 từ khóa gần nhất)
        if (searchHistory.length > 10) {
            searchHistory.pop();
        }

        // Lưu lại danh sách vào localStorage
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }
});

const searchInput = document.getElementById("search_input");
const searchHistoryContainer = document.getElementById("search-history-container");

// Hiển thị lịch sử tìm kiếm khi focus vào ô tìm kiếm
searchInput.addEventListener("focus", () => {
    const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

    if (searchHistory.length > 0) {
        searchHistoryContainer.innerHTML = searchHistory
            .map((keyword) => `<div class="search-history-item">${keyword}</div>`)
            .join("");
        searchHistoryContainer.style.display = "block";
    } else {
        searchHistoryContainer.innerHTML = '<div class="search-history-empty">No recent searches</div>';
        searchHistoryContainer.style.display = "block";
    }
});

// Ẩn lịch sử khi click ra ngoài
document.addEventListener("click", (event) => {
    if (!searchHistoryContainer.contains(event.target) && event.target !== searchInput) {
        searchHistoryContainer.style.display = "none";
    }
});

// Điền từ khóa vào ô tìm kiếm khi chọn từ lịch sử
searchHistoryContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("search-history-item")) {
        searchInput.value = event.target.textContent.trim();
        searchHistoryContainer.style.display = "none";
        document.getElementById("searchForm").submit();
    }
});

// Ẩn lịch sử sau khi mất focus
searchInput.addEventListener("blur", () => {
    setTimeout(() => {
        searchHistoryContainer.style.display = "none";
    }, 200);
});
