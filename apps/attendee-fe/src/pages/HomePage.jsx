

import { Box, Typography } from "@mui/material";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function HomePage() {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Trang chủ
        </Typography>
        <Typography variant="body1">
          Chào mừng bạn đến với EventNextDay!
        </Typography>
      </Box>

      <Footer />
    </Box>
  );
}

