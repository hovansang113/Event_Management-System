// apps/attendee-fe/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import GoogleCallback from "./pages/GoogleCallback";
import HomePage from "./pages/HomePage";
const theme = createTheme();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<GoogleCallback />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}