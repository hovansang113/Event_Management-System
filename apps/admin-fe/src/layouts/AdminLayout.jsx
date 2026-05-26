import { Box } from "@mui/material";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/layouts/sidebar";
import { STORAGE_KEYS } from "@eventnextday/shared-ui";

const AdminLayout = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (!token) return <Navigate to="/login" replace />;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: "background.default",
          width: { sm: `calc(100% - 240px)` },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
