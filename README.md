# Dimillav Shop 

## Triển khai

### Yêu cầu Cần Thiết

- **Node.js:** v14.x hoặc cao hơn
- **npm:** v6.x hoặc cao hơn
- **MongoDB:** Đảm bảo truy cập vào một instance MongoDB
- **Git:** Đã được cài đặt trên máy tính của bạn
- **Nhà cung cấp Hosting:** (ví dụ: Glitch.me, AWS, DigitalOcean)

### Hướng dẫn Triển khai Bước từng Bước

1. **Clone Repository**

    ```bash
    git clone https://github.com/PhanPhuc269/GA06.git
    cd GA06
    ```

2. **Cài đặt Các dependencies**

    ```bash
    npm install
    ```

3. **Cấu hình Biến Môi trường**

    Tạo một file `.env` trong thư mục gốc và lấy giá trị từ file `.env` mà nhóm đã cung cấp thêm vào file mới tạo.


4. **Chạy Ứng dụng**

    ```bash
    npm start
    ```

5. **Truy cập Ứng dụng**

    Mở trình duyệt và điều hướng đến `http://localhost:3000` hoặc URL host mà bạn đã cấu hình.

6. **Triển khai lên Môi trường Sản Xuất**

    Để triển khai ứng dụng lên máy chủ sản xuất, hãy làm theo các bước sau:

    - **Chọn Nhà cung cấp Hosting:**

        Chọn một nhà cung cấp hosting hỗ trợ ứng dụng Node.js, chẳng hạn như Glitch.me, AWS Elastic Beanstalk, DigitalOcean, v.v.

    - **Thiết lập Môi trường Sản xuất:**

        - **Biến Môi trường:** Đảm bảo tất cả các biến môi trường được thiết lập trong cài đặt cấu hình của nhà cung cấp hosting.
        - **Thiết lập Cơ sở dữ liệu:** Đảm bảo instance MongoDB của bạn có thể truy cập từ máy chủ sản xuất.

    - **Triển khai Ứng dụng:**

        Với Glitch.me:

        1. **Truy cập Glitch:**
        
            Truy cập [Glitch](https://glitch.com/) và đăng nhập hoặc đăng ký tài khoản.

        2. **Tạo Dự Án Mới:**
        
            Nhấp vào "New Project" và chọn "Import from GitHub".

        3. **Nhập URL Repository:**
        
            Nhập URL của repository GitHub: `https://github.com/PhanPhuc269/GA06.git` và nhấn "OK".

        4. **Cấu hình Biến Môi trường:**
        
            Trong phần "Project Settings", thêm các biến môi trường từ file `.env` vào mục "Environment Variables".

        5. **Triển khai Ứng dụng:**
        
            Glitch.me sẽ tự động triển khai ứng dụng của bạn. Bạn có thể truy cập ứng dụng tại URL mà Glitch cung cấp.

        **Lưu ý:** Đảm bảo rằng các biến môi trường được thiết lập chính xác và MongoDB instance của bạn có thể truy cập từ Glitch.me.

        ```bash
        # Không yêu cầu lệnh CLI khi triển khai trên Glitch.me
        ```

    - **Khởi động Ứng dụng:**

        Đảm bảo ứng dụng đang chạy đúng cách trên máy chủ sản xuất bằng cách truy cập vào URL host.

### Khắc phục Sự cố

- **Các Vấn đề Phổ biến:**
    - **Lỗi Kết nối Cơ sở dữ liệu:** Kiểm tra lại `DB_URI` của bạn có chính xác và instance MongoDB đang chạy.
    - **Vấn đề Biến môi trường:** Đảm bảo tất cả các biến môi trường cần thiết được thiết lập và cấu hình đúng cách.
    - **Xung đột Cổng:** Đảm bảo cổng được chỉ định không bị chiếm dụng hoặc được quản lý đúng cách bởi nhà cung cấp hosting.


