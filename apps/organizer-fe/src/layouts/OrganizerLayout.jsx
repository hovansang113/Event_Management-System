import { Box } from "@mui/material";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/layouts/Sidebar";
import { STORAGE_KEYS } from "../../../../packages/shared-ui/src/constants/storage";

const OrganizerLayout = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (!token) return <Navigate to="/login" replace />;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f3f4f6" }}>
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 3,
          py: 4,
          width: { sm: "calc(100% - 250px)" },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default OrganizerLayout;
