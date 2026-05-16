import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layouts/sidebar";

const AdminLayout = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar cố định - Chỉ render 1 lần */}
      <Sidebar />

      {/* Main Content thay đổi dựa theo Route */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: "background.default",
          width: { sm: `calc(100% - 240px)` },
        }}
      >
        <Outlet /> {/* Đây là nơi các trang con (Dashboard, Categories...) sẽ hiển thị */}
      </Box>
    </Box>
  );
};

export default AdminLayout;
