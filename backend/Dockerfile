#chọn môi trường
FROM node:20-alpine
#tạo thư mục làm việc trong container
WORKDIR /app
#copy file quản lý thư viện vào trước để tận dụng cache của docker
COPY package*.json ./
#cài đặt thư viện
RUN npm install --production
#copy toàn bộ mã nguồn vào container
COPY . .
#expose cổng mà ứng dụng sẽ chạy
EXPOSE 3000
#chạy ứng dụng
CMD ["npx", "ts-node", "src/server.ts"]
