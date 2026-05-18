<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Error</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
        .icon { font-size: 60px; color: #f44336; margin-bottom: 20px; }
        h1 { color: #333; margin-bottom: 10px; }
        p { color: #666; margin-bottom: 30px; line-height: 1.5; }
        .btn { display: inline-block; background-color: #007bff; color: white !important; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold; transition: background 0.3s; }
        .btn:hover { background-color: #0056b3; }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon">✕</div>
        <h1>Verification Failed</h1>
        <p>{{ $message ?? 'The verification link is invalid or has expired.' }}</p>
        <a href="{{ config('app.frontend_url') ?: '#' }}" class="btn">Back to Home</a>
    </div>
</body>
</html>
