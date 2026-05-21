import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Divider,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Event as EventIcon,
  Category as CategoryIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { STORAGE_KEYS } from "@eventnextday/shared-ui";

const drawerWidth = 250;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || "{}");

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon fontSize="small" />, path: "/admin/dashboard" },
    { text: "Manage Events", icon: <EventIcon fontSize="small" />, path: "/admin/events" },
    { text: "Categories", icon: <CategoryIcon fontSize="small" />, path: "/admin/categories" },
  ];

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    navigate("/login");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid #e5e7eb",
          backgroundColor: "#ffffff",
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 2.5, height: 56, display: "flex", alignItems: "center" }}>
        <Typography sx={{ fontSize: 18, letterSpacing: 1, fontWeight: 800, color: "#1170e4" }}>
          EVENTNOW
        </Typography>
      </Box>

      <Divider />

      {/* User Info */}
      <Box sx={{ px: 2.5, py: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar sx={{ width: 34, height: 34, border: "1px solid #d1d5db", bgcolor: "#fff" }} />
        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#1f2937", lineHeight: 1.2 }}>
            {user.name || "Admin User"}
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#6b7280", lineHeight: 1.2 }}>
            Admin
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Menu */}
      <Box sx={{ flexGrow: 1, p: 1.5 }}>
        <List disablePadding>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{ borderRadius: 2, minHeight: 42, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 30, color: location.pathname === item.path ? "#1170e4" : "#111827" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: 15,
                  fontWeight: location.pathname === item.path ? 700 : 500,
                  color: location.pathname === item.path ? "#1170e4" : "#374151",
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Divider />

      {/* Logout */}
      <List sx={{ p: 1.5 }}>
        <ListItemButton onClick={handleLogout} sx={{ color: "#ef4444", borderRadius: 2 }}>
          <ListItemIcon sx={{ minWidth: 30, color: "inherit" }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ fontWeight: 700, fontSize: 15 }}
          />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
