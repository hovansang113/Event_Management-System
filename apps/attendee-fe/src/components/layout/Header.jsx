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
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Fade,
} from "@mui/material";
import {
  Menu as MenuIcon,
  HomeOutlined as HomeIcon,
  EventOutlined as EventIcon,
  Login as LoginIcon,
  PersonAddOutlined as PersonAddIcon,
  Close as CloseIcon,
  LogoutOutlined as LogoutIcon,
  AccountCircleOutlined as ProfileIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from "@mui/icons-material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@eventnextday/shared-ui";

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { isLoggedIn, user, logout } = useAuth();

  const isHome = pathname === "/";
  const isEvents = pathname.startsWith("/events");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    navigate("/");
  };

  const navItems = [
    { label: "Home", path: "/", icon: <HomeIcon />, active: isHome },
    { label: "Events", path: "/events", icon: <EventIcon />, active: isEvents },
  ];

  const drawer = (
    <Box sx={{ width: 280, height: "100%", bgcolor: "#FFFFFF", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography sx={{ fontWeight: 800, fontSize: 20 }} color="#007BFF">
          <Box component="span" sx={{ color: "#111827" }}>EVENT</Box> NOW
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ bgcolor: "#F3F4F6" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Divider />
      
      {isLoggedIn && (
        <Box sx={{ p: 2, bgcolor: "#F9FAFB" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <Avatar 
              sx={{ 
                width: 45, 
                height: 45, 
                bgcolor: "#007BFF", 
                fontSize: 18, 
                fontWeight: 700,
                boxShadow: "0 4px 12px rgba(0,123,255,0.2)"
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{user?.name}</Typography>
              <Typography sx={{ fontSize: 12, color: "#6B7280" }}>{user?.email}</Typography>
            </Box>
          </Box>
        </Box>
      )}

      <List sx={{ px: 2, py: 2, flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: "12px",
                bgcolor: item.active ? "#EEF4FF" : "transparent",
                color: item.active ? "#007BFF" : "#4B5563",
                "&:hover": { bgcolor: "#F3F4F6" },
              }}
            >
              <ListItemIcon sx={{ color: item.active ? "#007BFF" : "#4B5563", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ fontWeight: item.active ? 700 : 500, fontSize: 15 }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 2, borderTop: "1px solid #E5E7EB" }}>
        {isLoggedIn ? (
          <Button
            fullWidth
            onClick={handleLogout}
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            sx={{
              py: 1.2,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              borderWidth: "2px",
              "&:hover": { borderWidth: "2px" }
            }}
          >
            Logout
          </Button>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Button
              fullWidth
              component={RouterLink}
              to="/login"
              onClick={handleDrawerToggle}
              variant="outlined"
              sx={{
                py: 1.2,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 700,
                borderColor: "#E5E7EB",
                color: "#374151",
                "&:hover": { borderColor: "#D1D5DB", bgcolor: "#F9FAFB" }
              }}
            >
              Login
            </Button>
            <Button
              fullWidth
              component={RouterLink}
              to="/register"
              onClick={handleDrawerToggle}
              variant="contained"
              sx={{
                py: 1.2,
                borderRadius: "10px",
                textTransform: "none",
                bgcolor: "#007BFF",
                boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
                fontWeight: 700,
                "&:hover": { bgcolor: "#0062CC", boxShadow: "0 6px 20px rgba(0,118,255,0.23)" }
              }}
            >
              Create Account
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #F1F5F9",
          height: { xs: "64px", md: "80px" },
          justifyContent: "center",
          zIndex: (theme) => theme.zIndex.drawer + 1,
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
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.02)" }
                }}
              >
                <Typography sx={{ fontWeight: 900, fontSize: { xs: 20, md: 24 }, letterSpacing: "-0.5px" }}>
                  <Box component="span" sx={{ color: "#0F172A" }}>EVENT</Box>
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
                gap: 1.5,
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    textTransform: "none",
                    color: item.active ? "#007BFF" : "#64748B",
                    bgcolor: item.active ? "rgba(0, 123, 255, 0.08)" : "transparent",
                    borderRadius: "12px",
                    px: 3,
                    py: 1,
                    fontWeight: 700,
                    fontSize: 15,
                    transition: "all 0.2s",
                    "&:hover": { 
                      bgcolor: item.active ? "rgba(0, 123, 255, 0.12)" : "#F1F5F9",
                      color: item.active ? "#007BFF" : "#0F172A"
                    },
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
                gap: { xs: 1, md: 2 },
              }}
            >
              {isLoggedIn ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Tooltip title="Account settings">
                    <Button
                      onClick={handleOpenUserMenu}
                      sx={{
                        p: 0.5,
                        pr: 1.5,
                        borderRadius: "50px",
                        bgcolor: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        textTransform: "none",
                        transition: "all 0.2s",
                        "&:hover": { 
                          bgcolor: "#F1F5F9",
                          borderColor: "#CBD5E1"
                        }
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          width: 36, 
                          height: 36, 
                          bgcolor: "#007BFF", 
                          fontSize: 14, 
                          fontWeight: 700,
                          mr: 1.2
                        }}
                      >
                        {user?.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography
                        sx={{
                          display: { xs: "none", lg: "block" },
                          color: "#1E293B",
                          fontWeight: 700,
                          fontSize: 14,
                          mr: 0.5
                        }}
                      >
                        {user?.name?.split(" ")[0]}
                      </Typography>
                      <ArrowDownIcon sx={{ color: "#64748B", fontSize: 18 }} />
                    </Button>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseUserMenu}
                    TransitionComponent={Fade}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 8px 24px rgba(0,0,0,0.12))",
                        mt: 1.5,
                        minWidth: 200,
                        borderRadius: "12px",
                        border: "1px solid #F1F5F9",
                        "& .MuiMenuItem-root": {
                          px: 2,
                          py: 1.2,
                          borderRadius: "8px",
                          mx: 1,
                          my: 0.5,
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#475569",
                          "&:hover": { bgcolor: "#F1F5F9", color: "#0F172A" },
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <Box sx={{ px: 2, py: 1.5, mb: 0.5 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: 14, color: "#0F172A" }}>{user?.name}</Typography>
                      <Typography sx={{ fontSize: 12, color: "#94A3B8" }}>{user?.email}</Typography>
                    </Box>
                    <Divider sx={{ my: 0.5, mx: 1 }} />
                    <MenuItem onClick={handleCloseUserMenu} component={RouterLink} to="/dashboard">
                      <ListItemIcon><ProfileIcon fontSize="small" /></ListItemIcon>
                      My Dashboard
                    </MenuItem>
                    <Divider sx={{ my: 0.5, mx: 1 }} />
                    <MenuItem onClick={handleLogout} sx={{ color: "#EF4444 !important", "&:hover": { bgcolor: "#FEF2F2 !important" } }}>
                      <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: "#EF4444" }} /></ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="text"
                    sx={{
                      textTransform: "none",
                      color: "#64748B",
                      fontWeight: 700,
                      fontSize: 15,
                      px: 2.5,
                      borderRadius: "10px",
                      transition: "all 0.2s",
                      "&:hover": { bgcolor: "#F1F5F9", color: "#0F172A" },
                    }}
                  >
                    Sign In
                  </Button>

                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    sx={{
                      display: { xs: "none", sm: "flex" },
                      textTransform: "none",
                      borderRadius: "12px",
                      px: 3.5,
                      py: 1,
                      bgcolor: "#007BFF",
                      fontWeight: 700,
                      fontSize: 15,
                      boxShadow: "0 4px 14px 0 rgba(0,118,255,0.3)",
                      transition: "all 0.3s",
                      "&:hover": { 
                        bgcolor: "#0062CC", 
                        boxShadow: "0 6px 20px rgba(0,118,255,0.4)",
                        transform: "translateY(-1px)"
                      },
                    }}
                  >
                    Join for Free
                  </Button>
                </>
              )}

              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ 
                  display: { md: "none" },
                  color: "#0F172A",
                  bgcolor: "#F1F5F9",
                  p: 1,
                  borderRadius: "10px",
                  "&:hover": { bgcolor: "#E2E8F0" }
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
          "& .MuiDrawer-paper": { 
            boxSizing: "border-box", 
            width: 280, 
            border: "none",
            boxShadow: "-10px 0 25px rgba(0,0,0,0.05)"
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
