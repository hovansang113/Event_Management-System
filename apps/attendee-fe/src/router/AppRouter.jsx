import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import GoogleCallback from "../pages/GoogleCallback";
import HomePage from "../pages/HomePage";
import EventsPage from "../pages/EventsPage";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<GoogleCallback />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
