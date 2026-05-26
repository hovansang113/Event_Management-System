import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import OrganizerLayout from "../layouts/OrganizerLayout";
import Dashboard from "../pages/Dashboard";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
    {
        path: "/organizer",
        element: <OrganizerLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/organizer/dashboard" replace />,
            },
            {
                path: "dashboard",
                element: <Dashboard />,
            },
            {
                path: "events",
                element: <div>My Events Page (Coming Soon)</div>,
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/organizer/dashboard" replace />,
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
