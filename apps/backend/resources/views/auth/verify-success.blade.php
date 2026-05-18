<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Successful</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
        .icon { font-size: 60px; color: #4CAF50; margin-bottom: 20px; }
        h1 { color: #333; margin-bottom: 10px; }
        p { color: #666; margin-bottom: 30px; line-height: 1.5; }
        .btn { display: inline-block; background-color: #4CAF50; color: white !important; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold; transition: background 0.3s; }
        .btn:hover { background-color: #45a049; }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon">✓</div>
        <h1>Verification Successful!</h1>
        <p>Congratulations! Your account has been successfully activated. You can now log in to the application.</p>
        <a href="{{ config('app.frontend_url') ?: '#' }}" class="btn">Go to Login</a>
    </div>
</body>
</html>
