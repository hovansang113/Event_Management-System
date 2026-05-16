import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import CategoryPage from "../pages/Category";
import LoginPage from "../pages/LoginPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route Login - Không dùng AdminLayout */}
        <Route path="/login" element={<LoginPage />} />

        {/* Cấu trúc Nested Routes cho Admin Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Mặc định khi vào /admin sẽ redirect về dashboard */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          
          <Route path="dashboard" element={<div>Trang Dashboard Content</div>} />
          <Route path="events" element={<div>Trang Manage Events Content</div>} />
          <Route path="categories" element={<CategoryPage />} />
        </Route>

        {/* Redirect mặc định */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
