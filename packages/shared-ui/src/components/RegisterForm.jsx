import { useAuthRegister } from "../hooks/useAuthRegister";
import "../style/RegisterForm.scss";

export const RegisterForm = ({ role, onSuccess }) => {
  const { formData, handleChange, handleSubmit, loading, error } =
    useAuthRegister(role, onSuccess);

  return (
    <div className="register">
      <h1 className="register__brand">EVENTNOW</h1>
      <h2 className="register__title">Tạo tài khoản</h2>

      <form className="register__form" onSubmit={handleSubmit}>

        <div className="register__field">
          <label className="register__field--label">Tên</label>
          <input
            className="register__field--input"
            name="name"
            type="text"
            placeholder="Nhập tên của bạn"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="register__field">
          <label className="register__field--label">Email</label>
          <input
            className="register__field--input"
            name="email"
            type="email"
            placeholder="Nhập địa chỉ email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="register__field">
          <label className="register__field--label">Mật khẩu</label>
          <input
            className="register__field--input"
            name="password"
            type="password"
            placeholder="Tạo mật khẩu"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="register__field">
          <label className="register__field--label">Xác nhận mật khẩu</label>
          <input
            className="register__field--input"
            name="password_confirmation"
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={formData.password_confirmation}
            onChange={handleChange}
          />
        </div>

        {error && <p className="register__error">{error}</p>}

        <button
          className={`register__button ${loading ? "register__button--loading" : ""}`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </button>

        <p>Đã có tài khoản? <a href="/login">Đăng nhập</a> </p>

      </form>
    </div>
  );
};