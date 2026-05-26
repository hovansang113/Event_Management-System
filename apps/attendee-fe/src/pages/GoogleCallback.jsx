import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService, STORAGE_KEYS } from "../../../../packages/shared-ui/src";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");

      if (token) {
        try {
          console.log("Token detected, saving to storage...");
          localStorage.setItem(STORAGE_KEYS.TOKEN, token);

          // 2. Lấy thông tin user profile
          console.log("Fetching user profile...");
          const response = await authService.getMe();
          console.log("Profile response:", response);
          
          if (response.data) {
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data));
            console.log("Success! Redirecting to /");
            navigate("/");
          } else {
            console.error("No user data in response");
            navigate("/login?error=no_user_data");
          }
        } catch (error) {
          console.error("Lỗi xử lý Google Callback chi tiết:", error.response?.data || error.message);
          navigate("/login?error=auth_failed");
        }
      } else {
        navigate("/login?error=no_token");
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <CircularProgress size={60} sx={{ mb: 2 }} />
      <Typography variant="h6">Đang xác thực với Google...</Typography>
    </Box>
  );
}
