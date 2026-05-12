<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lỗi xác minh</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); text-align: center; max-width: 400px; width: 100%; }
        .icon { color: #ef4444; font-size: 4rem; margin-bottom: 1rem; }
        h1 { color: #111827; margin-bottom: 0.5rem; }
        p { color: #4b5563; margin-bottom: 1.5rem; }
        .btn { display: inline-block; background-color: #4f46e5; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600; transition: background-color 0.2s; }
        .btn:hover { background-color: #4338ca; }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon">✕</div>
        <h1>Xác minh thất bại</h1>
        <p>{{ $message }}</p>
        <a href="{{ config('app.frontend_url') ?: '#' }}" class="btn">Quay lại trang chủ</a>
    </div>
</body>
</html>
