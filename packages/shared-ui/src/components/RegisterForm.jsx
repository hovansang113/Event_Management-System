import { useState } from "react";
import { useAuthRegister } from "../hooks/useAuthRegister";
import "../style/RegisterForm.scss";

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

export const RegisterForm = ({ role, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    formData,
    handleChange,
    handleSubmit,
    loading,
    error,
  } = useAuthRegister(role, onSuccess);



  return (
    <Box className="register-form-container">
      <Paper
        elevation={3}
        className="register-form-paper"
      >
        {/* Brand */}
        <Typography
          variant="h3"
          align="center"
          className="register-form-brand"
        >
          EVENTNOW
        </Typography>

        {/* Title */}
        <Typography
          variant="h4"
          align="center"
          className="register-form-title"
        >
          Tạo tài khoản
        </Typography>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit}>

          {/* Name */}
          <Typography className="register-form-label">
            Tên
          </Typography>

          <TextField
            fullWidth
            name="name"
            type="text"
            placeholder="Nhập tên của bạn"
            value={formData.name}
            onChange={handleChange}
            className="register-form-input"
          />

          {/* Email */}
          <Typography className="register-form-label">
            Email
          </Typography>

          <TextField
            fullWidth
            name="email"
            type="email"
            placeholder="Nhập địa chỉ email"
            value={formData.email}
            onChange={handleChange}
            className="register-form-input"
          />

          {/* Password */}
          <Typography className="register-form-label">
            Mật khẩu
          </Typography>

          <TextField
            fullWidth
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Tạo mật khẩu"
            value={formData.password}
            onChange={handleChange}
            className="register-form-input"
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

          {/* Confirm Password */}
          <Typography className="register-form-label">
            Xác nhận mật khẩu
          </Typography>

          <TextField
            fullWidth
            name="password_confirmation"
            type={
              showConfirmPassword ? "text" : "password"
            }
            placeholder="Nhập lại mật khẩu"
            value={formData.password_confirmation}
            onChange={handleChange}
            className="register-form-input"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword ? (
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
            <Alert severity="error" className="register-form-alert">
              {error}
            </Alert>
          )}

          {/* Button */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            className="register-form-submit-btn"
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Đăng ký"
            )}
          </Button>

          {/* Login */}
          <Typography
            align="center"
            className="register-form-footer"
          >
            Đã có tài khoản?{" "}
            <Link href="/login" underline="hover">
              Đăng nhập
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};