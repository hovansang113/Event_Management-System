# Setup Sau Khi Clone (Chi Tiet)

## 0) Yeu cau moi truong
Can co san tren may:
- Node.js LTS (khuyen nghi 20+)
- pnpm
- PHP 8.3+
- Composer
- MySQL

Kiem tra nhanh:
```bash
node -v
pnpm -v
php -v
composer -V
```

## 1) Clone repo va vao dung thu muc goc
Mo terminal thu 1, chay:
```bash
git clone <repo-url>
cd EventNextDay
```

Luu y: Mọi lenh `pnpm ...` ben duoi deu chay tai thu muc goc `EventNextDay`.

## 2) Cai dependency frontend monorepo
Van o thu muc goc `EventNextDay`, chay:
```bash
pnpm install
```

## 3) Setup backend Laravel (thu muc BackEnd)
Van o `EventNextDay`, tao file env:
```bash
cp BackEnd/.env.example BackEnd/.env
```

Mo file `BackEnd/.env` va sua thong tin DB theo may cua ban:
- `DB_HOST`
- `DB_PORT`
- `DB_DATABASE`
- `DB_USERNAME`
- `DB_PASSWORD`

Sau do chay cac lenh backend (co 2 cach):

Cach A (cd vao BackEnd truoc):
```bash
cd BackEnd
composer install
php artisan key:generate
php artisan jwt:secret
php artisan migrate
cd ..
```

Cach B (khong cd, chay tu root):
```bash
composer install --working-dir=BackEnd
php BackEnd/artisan key:generate
php BackEnd/artisan jwt:secret
php BackEnd/artisan migrate
```

## 4) Chay project
### Terminal 1: chay frontend (3 app cung luc)
Tai `EventNextDay`:
```bash
pnpm dev
```

### Terminal 2: chay Laravel API
Mo terminal moi, chay:
```bash
cd EventNextDay/BackEnd
php artisan serve
```

## 5) URLs thuong dung
- Frontend ports do Vite tu cap (xem log terminal `pnpm dev`)
- Backend mac dinh: `http://127.0.0.1:8000`

## 6) Neu loi dependency, clean va cai lai
Tai `EventNextDay`, chay:
```bash
# Windows PowerShell
Get-ChildItem -Directory -Recurse -Filter node_modules | Remove-Item -Recurse -Force
Get-ChildItem -Recurse -Filter package-lock.json | Remove-Item -Force
pnpm install
```

## 7) Quy uoc lam viec nhom
- Dung `pnpm` (khong dung npm/yarn cho workspace nay)
- Khong commit `node_modules/`
- Khong commit `package-lock.json`
- Giu `pnpm-lock.yaml`
- Moi thanh vien tu quan ly file `BackEnd/.env` tren may minh
