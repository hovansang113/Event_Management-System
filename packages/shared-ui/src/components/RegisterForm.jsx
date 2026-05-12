import { useState } from "react";
import { useAuthRegister } from "../hooks/useAuthRegister";

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
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        p: { xs: 1, sm: 2 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 450,
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
        }}
      >
        {/* Brand */}
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: "bold",
            color: "#0057c2",
            mb: 1,
            fontSize: { xs: "24px", sm: "32px" },
          }}
        >
          EVENTNOW
        </Typography>

        {/* Title */}
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: "bold",
            mb: 4,
            fontSize: { xs: "20px", sm: "28px" },
          }}
        >
          Tạo tài khoản
        </Typography>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit}>

          {/* Name */}
          <Typography sx={{ mb: 1, fontWeight: 600 }}>
            Tên
          </Typography>

          <TextField
            fullWidth
            name="name"
            type="text"
            placeholder="Nhập tên của bạn"
            value={formData.name}
            onChange={handleChange}
            sx={{ mb: 3 }}
          />

          {/* Email */}
          <Typography sx={{ mb: 1, fontWeight: 600 }}>
            Email
          </Typography>

          <TextField
            fullWidth
            name="email"
            type="email"
            placeholder="Nhập địa chỉ email"
            value={formData.email}
            onChange={handleChange}
            sx={{ mb: 3 }}
          />

          {/* Password */}
          <Typography sx={{ mb: 1, fontWeight: 600 }}>
            Mật khẩu
          </Typography>

          <TextField
            fullWidth
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Tạo mật khẩu"
            value={formData.password}
            onChange={handleChange}
            sx={{ mb: 3 }}
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
          <Typography sx={{ mb: 1, fontWeight: 600 }}>
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
            sx={{ mb: 3 }}
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
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Button */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: "bold",
              textTransform: "none",
              fontSize: 16,
            }}
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
            sx={{
              mt: 3,
              color: "#666",
            }}
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