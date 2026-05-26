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

const registerRoleCopy = {
  attendee: {
    label: "Attendee Sign Up",
    title: "Create attendee account",
    backdropTitle: "Start joining events",
    backdropText: "Create a personal account for browsing, registering, and following event updates.",
  },
  organizer: {
    label: "Organizer Sign Up",
    title: "Create organizer account",
    backdropTitle: "Launch your event space",
    backdropText: "Set up an organizer profile for creating events and managing registrations.",
  },
};

export const RegisterForm = ({ role, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const roleCopy = registerRoleCopy[role] || registerRoleCopy.attendee;

  const {
    formData,
    handleChange,
    handleSubmit,
    loading,
    error,
  } = useAuthRegister(role, onSuccess);

  return (
    <Box
      className={`register-form-container auth-shell auth-shell--${role}`}
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
        className="register-form-paper"
      >
        <Typography className="auth-role-chip" align="center">
          {roleCopy.label}
        </Typography>

        <Typography
          variant="h3"
          align="center"
          className="register-form-brand"
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
          className="register-form-title"
        >
          {roleCopy.title}
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
              "Sign Up"
            )}
          </Button>

          <Typography
            align="center"
            className="register-form-footer"
          >
            Already have an account?{" "}
            <Link href="/login" underline="hover">
              Sign In
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
