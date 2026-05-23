import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function AttendeeLayout() {
  return (
    <Box display="flex" flexDirection="column" minHeight="100dvh" bgcolor="#F8F9FA">
      <Header />
      <Outlet />
      <Box sx={{ mt: "auto" }}>
        <Footer />
      </Box>
    </Box>
  );
}
