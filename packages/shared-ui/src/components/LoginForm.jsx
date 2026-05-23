import { useState } from "react";
import { useAuthLogin } from "../hooks/useAuthLogin";
import "../style/LoginForm.scss";
import { API_ENDPOINTS } from "../constants/api";

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
  Divider,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  Google,
} from "@mui/icons-material";

const loginRoleCopy = {
  attendee: {
    label: "Attendee access",
    title: "Welcome back",
    backdropTitle: "Find your next event",
    backdropText: "A focused space for discovering, saving, and joining events.",
  },
  organizer: {
    label: "Organizer access",
    title: "Manage your events",
    backdropTitle: "Build memorable event days",
    backdropText: "Tools for publishing events, tracking status, and managing audiences.",
  },
  admin: {
    label: "Admin access",
    title: "Admin sign in",
    backdropTitle: "Platform control center",
    backdropText: "Secure access for reviewing activity and keeping operations consistent.",
  },
};

export const LoginForm = ({ role, onSuccess, showRegisterLink = true }) => {
  const [showPassword, setShowPassword] = useState(false);
  const roleCopy = loginRoleCopy[role] || loginRoleCopy.attendee;

  const {
    formData,
    handleChange,
    handleSubmit,
    loading,
    error,
  } = useAuthLogin(role, onSuccess);

  const handleGoogleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
    window.location.href = `${apiUrl}/${API_ENDPOINTS.AUTH.GOOGLE}`;
  };

  return (
    <Box
      className={`login-form-container auth-shell auth-shell--${role}`}
      data-auth-role={roleCopy.label}
    >
      <Box className="auth-backdrop-copy">
        <Typography className="auth-backdrop-kicker">
          <Box component="span" className="auth-brand-word">
            EVENT
          </Box>
          <Box component="span" className="auth-brand-word auth-brand-word--now">
            NOW
          </Box>
        </Typography>
        <Typography component="h1" className="auth-backdrop-title">
          {roleCopy.backdropTitle}
        </Typography>
        <Typography className="auth-backdrop-text">
          {roleCopy.backdropText}
        </Typography>
      </Box>

      <Paper
        elevation={3}
        className="login-form-paper"
      >
        <Typography className="auth-role-chip" align="center">
          {roleCopy.label}
        </Typography>

        <Typography
          variant="h3"
          align="center"
          className="login-form-brand"
        >
          <Box component="span" className="auth-brand-word">
            EVENT
          </Box>
          <Box component="span" className="auth-brand-word auth-brand-word--now">
            NOW
          </Box>
        </Typography>

        <Typography
          variant="h4"
          align="center"
          className="login-form-title"
        >
          {roleCopy.title}
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

          {role === 'attendee' && (
            <>
              <Divider sx={{ my: 2 }}>OR</Divider>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Google />}
                onClick={handleGoogleLogin}
                sx={{ mb: 2, py: 1.2, textTransform: 'none', fontSize: '1rem' }}
              >
                Continue with Google
              </Button>
            </>
          )}

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
