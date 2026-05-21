import { Box, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { authService, STORAGE_KEYS } from "@eventnextday/shared-ui";

export default function HomePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || "{}");

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} sx={{ p: 4, textAlign: "center", maxWidth: 400 }}>
        <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
          Chào mừng, {user.name || "Người dùng"}!
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Bạn đã đăng nhập thành công bằng Google vào hệ thống dành cho Attendee.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Email: {user.email}
        </Typography>
        <Button variant="contained" color="error" onClick={handleLogout} fullWidth>
          Đăng xuất
        </Button>
      </Paper>
    </Box>
  );
}
