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
        <Typography
          variant="h3"
          align="center"
          className="register-form-brand"
        >
          EVENTNOW
        </Typography>

        <Typography
          variant="h4"
          align="center"
          className="register-form-title"
        >
          Create Account
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>

          <Typography className="register-form-label">
            Name
          </Typography>

          <TextField
            fullWidth
            name="name"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            className="register-form-input"
          />

          <Typography className="register-form-label">
            Email
          </Typography>

          <TextField
            fullWidth
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="register-form-input"
          />

          <Typography className="register-form-label">
            Password
          </Typography>

          <TextField
            fullWidth
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
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

          <Typography className="register-form-label">
            Confirm Password
          </Typography>

          <TextField
            fullWidth
            name="password_confirmation"
            type={
              showConfirmPassword ? "text" : "password"
            }
            placeholder="Re-enter your password"
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

          {error && (
            <Alert severity="error" className="register-form-alert">
              {error}
            </Alert>
          )}

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
              "Register"
            )}
          </Button>

          <Typography
            align="center"
            className="register-form-footer"
          >
            Already have an account?{" "}
            <Link href="/login" underline="hover">
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
