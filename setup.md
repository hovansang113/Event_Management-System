# Hướng dẫn Setup Dự án EventNextDay

Tài liệu này hướng dẫn chi tiết các bước để cài đặt và chạy dự án EventNextDay cho các thành viên mới.

## 1. Yêu cầu hệ thống (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các công cụ sau:

- **Node.js**: Phiên bản 18.x hoặc 20.x (khuyên dùng v20 LTS).
- **PNPM**: Phiên bản 10.x (Dự án sử dụng pnpm workspace).
- **PHP**: Phiên bản ^8.3.
- **Composer**: Phiên bản 2.x.
- **Cơ sở dữ liệu**: MySQL hoặc MariaDB.
- **Git**: Để clone source code.

## 2. Các bước cài đặt

### Bước 1: Clone dự án
```bash
git clone <url-cua-repo>
cd EventNextDay
```

### Bước 2: Cài đặt Dependencies cho toàn bộ dự án (Monorepo)
Tại thư mục gốc của dự án, chạy lệnh:
```bash
pnpm install
```
Lệnh này sẽ tự động cài đặt tất cả dependencies cho các ứng dụng trong `apps/` và các gói trong `packages/`.

### Bước 3: Cấu hình Backend (Laravel)
Di chuyển vào thư mục backend:
```bash
cd apps/backend
```

1. **Cài đặt PHP dependencies:**
   ```bash
   composer install
   ```

2. **Tạo file môi trường (.env):**
   ```bash
   cp .env.example .env
   ```

3. **Cấu hình Cơ sở dữ liệu:**
   Mở file `.env` vừa tạo và chỉnh sửa các thông số kết nối database:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=backend
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```
   *Lưu ý: Hãy tạo sẵn một database trống tên là `backend` trong MySQL của bạn.*

4. **Tạo App Key:**
   ```bash
   php artisan key:generate
   ```

5. **Tạo JWT Secret Key:**
   ```bash
   php artisan jwt:secret
   ```

6. **Chạy Migration và Seeder:**
   Để tạo các bảng và dữ liệu mẫu (admin test):
   ```bash
   php artisan migrate --seed
   ```

## 3. Cách chạy dự án

Dự án này sử dụng **TurboRepo** để quản lý việc chạy đồng thời nhiều ứng dụng.

### Cách 1: Chạy tất cả cùng lúc (Khuyên dùng)
Tại thư mục gốc của dự án, chạy:
```bash
pnpm dev
```
Lệnh này sẽ khởi động:
- Backend: `http://localhost:8000` (Laravel Server)
- Admin Frontend: `http://localhost:5173` (hoặc port khác tùy máy)
- Attendee Frontend
- Organizer Frontend

### Cách 2: Chạy riêng lẻ từng ứng dụng
Nếu bạn chỉ muốn tập trung làm việc trên một phần nhất định:

- **Chạy Backend:**
  ```bash
  cd apps/backend
  php artisan serve
  ```

- **Chạy Admin Frontend:**
  ```bash
  cd apps/admin-fe
  pnpm dev
  ```

- **Chạy Attendee Frontend:**
  ```bash
  cd apps/attendee-fe
  pnpm dev
  ```

- **Chạy Organizer Frontend:**
  ```bash
  cd apps/organizer-fe
  pnpm dev
  ```

## 4. Cấu trúc dự án
- `apps/backend`: API Laravel.
- `apps/admin-fe`: Giao diện dành cho Admin.
- `apps/attendee-fe`: Giao diện dành cho người tham gia.
- `apps/organizer-fe`: Giao diện dành cho người tổ chức.
- `packages/shared-ui`: Chứa các component, hooks, style dùng chung cho cả 3 frontend.

## 5. Lưu ý quan trọng
- Khi thêm một thư viện mới vào frontend, hãy dùng `pnpm add <package-name>` tại thư mục của ứng dụng đó hoặc dùng `-filter` từ thư mục gốc.
- Luôn kiểm tra file `.env` của backend nếu gặp lỗi kết nối API.
- Nếu `shared-ui` có thay đổi, Turbo sẽ tự động phát hiện và build lại khi bạn chạy lệnh dev.
