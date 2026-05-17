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

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Manage Events", icon: <EventIcon />, path: "/admin/events" },
    { text: "Categories", icon: <CategoryIcon />, path: "/admin/categories" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      {/* Phần thông tin user */}
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1, marginBottom: 5, color: "primary.main" }}>
          EVEMTNOW
        </Typography>
        <Avatar
          sx={{ width: 64, height: 64, mb: 1 }}
        />
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Admin User
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Admin
        </Typography>
      </Box>

      <Divider />

      {/* Menu navigation */}
      <Box sx={{ flexGrow: 1 }}>
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? "primary.main" : "inherit" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  color: location.pathname === item.path ? "primary.main" : "inherit",
                  fontWeight: location.pathname === item.path ? "bold" : "normal"
                }} 
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Divider />

      {/* Nút Logout */}
      <List>
        <ListItemButton sx={{ color: "error.main" }} onClick={() => navigate("/login")}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
