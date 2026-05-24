import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  HomeOutlined as HomeIcon,
  EventOutlined as EventIcon,
  Login as LoginIcon,
  PersonAddOutlined as PersonAddIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Link as RouterLink, useLocation } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = pathname === "/";
  const isEvents = pathname.startsWith("/events");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: "Home", path: "/", icon: <HomeIcon />, active: isHome },
    { label: "Events", path: "/events", icon: <EventIcon />, active: isEvents },
  ];

  const drawer = (
    <Box sx={{ width: 280, height: "100%", bgcolor: "#FFFFFF" }}>
      <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography sx={{ fontWeight: 800, fontSize: 20 }} color="#007BFF">
          <Box component="span" sx={{ color: "#111827" }}>EVENT</Box> NOW
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 1 }} />
      <List sx={{ px: 2 }}>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: "12px",
                bgcolor: item.active ? "#eef4ff" : "transparent",
                color: item.active ? "#007BFF" : "#4B5563",
                "&:hover": { bgcolor: "#f3f4f6" },
              }}
            >
              <ListItemIcon sx={{ color: item.active ? "#007BFF" : "#4B5563", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ fontWeight: item.active ? 600 : 500 }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, p: 2, borderTop: "1px solid #E5E7EB" }}>
        <Button
          fullWidth
          component={RouterLink}
          to="/register"
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleDrawerToggle}
          sx={{
            py: 1.5,
            borderRadius: "12px",
            textTransform: "none",
            bgcolor: "#007BFF",
            boxShadow: "none",
            fontWeight: 600,
          }}
        >
          Create Account
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #E5E7EB",
          height: { xs: "64px", md: "72px" },
          justifyContent: "center",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 0, md: 2 }, gap: 2 }}>
            {/* Logo Section */}
            <Box sx={{ flex: { xs: 1, md: "0 0 auto" } }}>
              <Box
                component={RouterLink}
                to="/"
                sx={{
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontWeight: 800, fontSize: { xs: 20, md: 22 } }}>
                  <Box component="span" sx={{ color: "#111827" }}>EVENT</Box>
                  <Box component="span" sx={{ color: "#007BFF" }}>NOW</Box>
                </Typography>
              </Box>
            </Box>

            {/* Desktop Navigation */}
            <Box
              sx={{
                flex: 1,
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    textTransform: "none",
                    color: item.active ? "#007BFF" : "#4B5563",
                    bgcolor: item.active ? "#eef4ff" : "transparent",
                    borderRadius: "10px",
                    px: 2.5,
                    fontWeight: 600,
                    fontSize: 15,
                    "&:hover": { bgcolor: "#f3f4f6" },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Auth Actions */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: { xs: 1, md: 1.5 },
              }}
            >
              <Button
                component={RouterLink}
                to="/login"
                variant="text"
                startIcon={<LoginIcon sx={{ display: { xs: "none", sm: "block" } }} />}
                sx={{
                  textTransform: "none",
                  color: "#374151",
                  fontWeight: 600,
                  fontSize: { xs: 14, md: 15 },
                  px: { xs: 1, md: 2 },
                  "&:hover": { bgcolor: "#f3f4f6" },
                }}
              >
                Login
              </Button>

              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                sx={{
                  display: { xs: "none", md: "flex" },
                  textTransform: "none",
                  borderRadius: "10px",
                  px: 3,
                  bgcolor: "#007BFF",
                  fontWeight: 600,
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#0056B3", boxShadow: "none" },
                }}
              >
                Sign Up
              </Button>

              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ 
                  display: { md: "none" },
                  color: "#111827",
                  bgcolor: "#f3f4f6",
                  ml: 0.5,
                  "&:hover": { bgcolor: "#e5e7eb" }
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280, border: "none" },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
