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
        <Typography
          variant="h3"
          align="center"
          className="login-form-brand"
        >
          EVENTNOW
        </Typography>

        <Typography
          variant="h4"
          align="center"
          className="login-form-title"
        >
          Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>

          <Typography className="login-form-label">
            Email
          </Typography>

          <TextField
            fullWidth
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="login-form-input"
          />

          <Typography className="login-form-label">
            Password
          </Typography>

          <TextField
            fullWidth
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
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

          {error && (
            <Alert severity="error" className="login-form-alert">
              {error}
            </Alert>
          )}

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
              "Login"
            )}
          </Button>

          {showRegisterLink && (
            <Typography
              align="center"
              className="login-form-footer"
            >
              Don't have an account?{" "}
              <Link href="/register" underline="hover">
                Register now
              </Link>
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
