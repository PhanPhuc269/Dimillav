# Sử dụng Node.js làm image cơ bản
FROM node:18

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy file package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ code ứng dụng vào container
COPY . .

# Expose cổng mà ứng dụng chạy (thường là 3000)
EXPOSE 3000

# Lệnh để chạy ứng dụng
CMD ["npm", "start"]
