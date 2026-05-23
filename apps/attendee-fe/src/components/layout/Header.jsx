import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Container,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const isEvents = pathname.startsWith("/events");

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "#FFFFFF",
        borderBottom: "1px solid #E0E0E0",
        height: "70px",
        justifyContent: "center",
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: "none", px: { xs: 1, md: 0.5 } }}>
        <Toolbar sx={{ minHeight: "70px !important", py: 0, gap: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: 20, lineHeight: 1 }} color="#007BFF">
                <Box component="span" sx={{ color: "#111827", letterSpacing: "0.02em" }}>
                  EVENT
                </Box>
                <Box component="span" sx={{ color: "#007BFF", letterSpacing: "0.02em", ml: 0.2 }}>
                  NOW
                </Box>
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Button
              component={RouterLink}
              to="/"
              variant={isHome ? "contained" : "text"}
              size="medium"
              sx={{
                textTransform: "none",
                color: isHome ? "#007BFF" : "#666666",
                bgcolor: isHome ? "#eef4ff" : "transparent",
                borderRadius: "12px",
                px: 3,
                fontWeight: 600,
                fontSize: 14,
                boxShadow: "none",
                "&:hover": {
                  bgcolor: isHome ? "#e6f0ff" : "#F8F9FA",
                },
              }}
            >
              Home
            </Button>

            <Button
              component={RouterLink}
              to="/events"
              variant={isEvents ? "contained" : "text"}
              size="medium"
              sx={{
                textTransform: "none",
                color: isEvents ? "#007BFF" : "#666666",
                bgcolor: isEvents ? "#eef4ff" : "transparent",
                borderRadius: "12px",
                px: 3,
                fontWeight: isEvents ? 600 : 500,
                fontSize: 14,
                boxShadow: "none",
                "&:hover": {
                  bgcolor: isEvents ? "#e6f0ff" : "#F8F9FA",
                },
              }}
            >
              Events
            </Button>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 1.5,
            }}
          >
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              sx={{
                textTransform: "none",
                borderRadius: "14px",
                px: { xs: 2, sm: 3 },
                borderColor: "#E0E0E0",
                color: "#333333",
                fontSize: 14,
              }}
            >
              Login
            </Button>

            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              sx={{
                textTransform: "none",
                borderRadius: "14px",
                px: { xs: 2, sm: 3 },
                bgcolor: "#007BFF",
                fontSize: 14,
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#0056B3",
                  boxShadow: "none",
                },
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
