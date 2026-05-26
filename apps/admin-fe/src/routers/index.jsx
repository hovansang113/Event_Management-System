import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import ManageCategories from "../pages/Category";
import ManageEvents from "../pages/Events/ManageEvents";

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
                element: <Dashboard />,
            },
            {
                path: "categories",
                element: <ManageCategories />,
            },
            {
                path: "events",
                element: <ManageEvents />,
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
