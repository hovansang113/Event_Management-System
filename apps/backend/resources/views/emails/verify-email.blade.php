<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
  <div style="max-width:600px; margin:auto; background:white; border-radius:8px; padding:32px;">

    <h2 style="color:#4F46E5;">Xin chào {{ $user->name }}</h2>
    <p>Cảm ơn bạn đã đăng ký tài khoản.</p>
    <p>Nhấn nút bên dưới để xác minh email. ⏰ Link có hiệu lực <strong>24 giờ</strong>.</p>

    <a href="{{ $verifyUrl }}"
       style="display:inline-block; margin:20px 0; padding:12px 28px;
              background:#4F46E5; color:white; border-radius:6px;
              text-decoration:none; font-weight:bold;">
        Xác minh Email
    </a>

    <p style="color:#888; font-size:12px;">
      Nếu bạn không thực hiện đăng ký, hãy bỏ qua email này.
    </p>
  </div>
</body>
</html>