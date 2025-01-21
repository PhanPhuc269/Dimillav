function selectRating(rating) {
    document.getElementById('selected-rating').innerText = rating + ' Star' + (rating > 1 ? 's' : '');
    document.querySelector('input[name="rating"]').value = rating;
}

document.getElementById('reviewForm').addEventListener('submit', function(event) {
    var rating = document.querySelector('input[name="rating"]').value;
    if (rating === "0") { 
        alert("Vui lòng chọn đánh giá trước khi thêm.");
        event.preventDefault(); 
    } else {
        // Nếu form được submit thành công (bạn cần xử lý logic này ở phía server)
        // Hiển thị thông báo cho người dùng
        //alert("Cảm ơn bạn đã đánh giá!"); 
    }
});