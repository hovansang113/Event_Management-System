import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import LoginPage from "../pages/LoginPage";
import ManageCategories from "../pages/Category";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/admin/dashboard" replace />,
            },
            {
                path: "dashboard",
                element: <div>Dashboard Page (Coming Soon)</div>,
            },
            {
                path: "categories",
                element: <ManageCategories />,
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/login" replace />,
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
