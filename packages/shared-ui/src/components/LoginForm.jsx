import { useState } from "react";
import { useAuthLogin } from "../hooks/useAuthLogin";
import "../style/LoginForm.scss";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

export const LoginForm = ({ role, onSuccess, showRegisterLink = true }) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    formData,
    handleChange,
    handleSubmit,
    loading,
    error,
  } = useAuthLogin(role, onSuccess);

  return (
    <Box className="login-form-container">
      <Paper
        elevation={3}
        className="login-form-paper"
      >
        {/* Brand */}
        <Typography
          variant="h3"
          align="center"
          className="login-form-brand"
        >
          EVENTNOW
        </Typography>

        {/* Title */}
        <Typography
          variant="h4"
          align="center"
          className="login-form-title"
        >
          Đăng nhập
        </Typography>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit}>

          {/* Email */}
          <Typography className="login-form-label">
            Email
          </Typography>

          <TextField
            fullWidth
            name="email"
            type="email"
            placeholder="Nhập địa chỉ email"
            value={formData.email}
            onChange={handleChange}
            className="login-form-input"
          />

          {/* Password */}
          <Typography className="login-form-label">
            Mật khẩu
          </Typography>

          <TextField
            fullWidth
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu"
            value={formData.password}
            onChange={handleChange}
            className="login-form-input"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Error */}
          {error && (
            <Alert severity="error" className="login-form-alert">
              {error}
            </Alert>
          )}

          {/* Button */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            className="login-form-submit-btn"
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Đăng nhập"
            )}
          </Button>

          {/* Register Link */}
          {showRegisterLink && (
            <Typography
              align="center"
              className="login-form-footer"
            >
              Chưa có tài khoản?{" "}
              <Link href="/register" underline="hover">
                Đăng ký ngay
              </Link>
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
