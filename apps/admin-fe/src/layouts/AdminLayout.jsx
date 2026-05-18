import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layouts/sidebar";

const AdminLayout = () => {
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
