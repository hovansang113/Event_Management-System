import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Container,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";

export default function Header() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "#fff",
        borderBottom: "1px solid #eee",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box component={RouterLink} to="/" sx={{ textDecoration: "none" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "12px",
                    bgcolor: "#0d6efd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  ✨
                </Box>
                <Typography
                  fontWeight={700}
                  fontSize={24}
                  color="#0d6efd"
                >
                  EVENTNOW
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <Button
                component={RouterLink}
                to="/"
                variant="contained"
                size="medium"
                sx={{
                  textTransform: "none",
                  color: "#0d6efd",
                  bgcolor: "#eef4ff",
                  borderRadius: "12px",
                  px: 3,
                  fontWeight: 600,
                  boxShadow: "none",
                }}
              >
                Home
              </Button>

              <Button
                component={RouterLink}
                to="/events"
                variant="text"
                size="medium"
                sx={{
                  textTransform: "none",
                  color: "#555",
                  fontWeight: 500,
                }}
              >
                Events
              </Button>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Button
              component="a"
              href="#"
              startIcon={<ExploreOutlinedIcon />}
              sx={{
                textTransform: "none",
                color: "#333",
                fontWeight: 500,
              }}
            >
              Explore
            </Button>

            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              sx={{
                textTransform: "none",
                borderRadius: "14px",
                px: 3,
                borderColor: "#ddd",
                color: "#333",
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
                px: 3,
                bgcolor: "#0d6efd",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#0b5ed7",
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