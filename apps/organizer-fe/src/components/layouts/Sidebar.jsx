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
import { DashboardOutlined, LogoutOutlined } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { STORAGE_KEYS } from "@eventnextday/shared-ui";

const drawerWidth = 250;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || "{}");

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
      <Box sx={{ px: 2.5, height: 56, display: "flex", alignItems: "center" }}>
        <Typography sx={{ fontSize: 19, fontWeight: 800, letterSpacing: 0.5 }}>
          <Box component="span" sx={{ color: "#111827" }}>EVENT</Box>
          <Box component="span" sx={{ color: "#007BFF" }}>NOW</Box>
        </Typography>
      </Box>

      <Divider />

      <Box sx={{ px: 2.5, py: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar sx={{ width: 34, height: 34, border: "1px solid #d1d5db", bgcolor: "#fff" }} />
        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#1f2937", lineHeight: 1.2 }}>
            {user.name || "Hồ văn sang"}
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#6b7280", lineHeight: 1.2 }}>
            Organizer
          </Typography>
        </Box>
      </Box>

      <Divider />

      <Box sx={{ flexGrow: 1, p: 1.5 }}>
        <List>
          <ListItemButton
            selected={location.pathname === "/organizer/dashboard"}
            onClick={() => navigate("/organizer/dashboard")}
            sx={{ borderRadius: 2, minHeight: 42 }}
          >
            <ListItemIcon sx={{ minWidth: 30, color: "#111827" }}>
              <DashboardOutlined fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Dashboard"
              primaryTypographyProps={{ fontWeight: 700, fontSize: 15 }}
            />
          </ListItemButton>
        </List>
      </Box>

      <Divider />

      <List sx={{ p: 1.5 }}>
        <ListItemButton onClick={handleLogout} sx={{ color: "#ef4444", borderRadius: 2 }}>
          <ListItemIcon sx={{ minWidth: 30, color: "inherit" }}>
            <LogoutOutlined fontSize="small" />
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
