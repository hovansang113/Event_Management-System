import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Stack,
  Avatar,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import { eventService } from "../services/eventService";
import { useAuth } from "@eventnextday/shared-ui";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import HistoryIcon from "@mui/icons-material/History";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import { Link as RouterLink } from "react-router-dom";

// --- Design Components ---

const SidebarItem = ({ icon, label, active, count, onClick }) => (
  <Button
    onClick={onClick}
    fullWidth
    startIcon={icon}
    sx={{
      justifyContent: "space-between",
      px: 2,
      py: 1.2,
      borderRadius: "8px",
      textTransform: "none",
      color: active ? "#0F172A" : "#64748B",
      bgcolor: active ? "#FFFFFF" : "transparent",
      fontWeight: active ? 700 : 500,
      fontSize: "0.9rem",
      boxShadow: active ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
      border: active ? "1px solid #E2E8F0" : "1px solid transparent",
      "& .MuiButton-startIcon": { color: active ? "#007BFF" : "inherit" },
      "&:hover": { bgcolor: active ? "#FFFFFF" : "#F1F5F9", color: "#0F172A" },
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
      {label}
    </Box>
    {count > 0 && (
      <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: active ? "#007BFF" : "#94A3B8" }}>
        {count}
      </Typography>
    )}
  </Button>
);

const StatMini = ({ label, value }) => (
  <Box>
    <Typography sx={{ fontSize: "0.7rem", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px" }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A" }}>
      {value}
    </Typography>
  </Box>
);

export default function DashboardPage() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0); // 0: Upcoming, 1: Waitlist, 2: Past
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialog, setCancelDialog] = useState({ open: false, id: null });
  const [cancelling, setCancelling] = useState(false);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await eventService.getMyRegistrations();
      setRegistrations(response.data || []);
    } catch (err) {
      console.error("Failed to fetch registrations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const now = new Date();
  
  const upcomingRegs = registrations.filter(r => r.status === 'Confirmed' && new Date(r.event.date) >= now);
  const waitlistRegs = registrations.filter(r => r.status === 'Waitlist' && new Date(r.event.date) >= now);
  const pastRegs = registrations.filter(r => new Date(r.event.date) < now && r.status !== 'Cancelled');

  const filteredData = tabValue === 0 ? upcomingRegs : tabValue === 1 ? waitlistRegs : pastRegs;

  const handleConfirmCancel = async () => {
    setCancelling(true);
    try {
      await eventService.cancel(cancelDialog.id);
      fetchRegistrations();
      setCancelDialog({ open: false, id: null });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <Box sx={{ pt: "110px", pb: 8, minHeight: "100vh", bgcolor: "#F8FAFC" }}>
      <Container maxWidth="xl">
        {/* The Master Frame */}
        <Box sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", md: "row" },
          bgcolor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
          overflow: "hidden",
          minHeight: "750px"
        }}>
          
          {/* Framed Sidebar */}
          <Box sx={{ 
            width: { xs: "100%", md: 280 }, 
            flexShrink: 0, 
            bgcolor: "#F9FAFB", 
            borderRight: { md: "1px solid #F1F5F9" },
            p: 4
          }}>
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ fontSize: "1.35rem", fontWeight: 900, color: "#0F172A", mb: 0.5, letterSpacing: "-0.5px" }}>
                My Events
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 500 }}>
                Manage your schedule
              </Typography>
            </Box>

            <Stack spacing={0.5}>
              <SidebarItem 
                icon={<GridViewOutlinedIcon sx={{ fontSize: 20 }} />} 
                label="Upcoming" 
                active={tabValue === 0} 
                count={upcomingRegs.length}
                onClick={() => setTabValue(0)}
              />
              <SidebarItem 
                icon={<AssignmentTurnedInOutlinedIcon sx={{ fontSize: 20 }} />} 
                label="Waitlist" 
                active={tabValue === 1} 
                count={waitlistRegs.length}
                onClick={() => setTabValue(1)}
              />
              <SidebarItem 
                icon={<HistoryIcon sx={{ fontSize: 20 }} />} 
                label="History" 
                active={tabValue === 2} 
                count={pastRegs.length}
                onClick={() => setTabValue(2)}
              />
            </Stack>

            <Box sx={{ mt: "auto", pt: 6 }}>
              <Divider sx={{ mb: 4, borderColor: "#EEF2F6" }} />
              <Typography sx={{ fontSize: "0.65rem", fontWeight: 800, color: "#94A3B8", mb: 2.5, textTransform: "uppercase", letterSpacing: "1px" }}>
                Your Statistics
              </Typography>
              <Stack spacing={3}>
                <StatMini label="Successful Bookings" value={registrations.filter(r => r.status === 'Confirmed').length} />
                <StatMini label="Member Tier" value="Standard" />
              </Stack>
            </Box>
          </Box>

          {/* Framed Content Area */}
          <Box sx={{ flexGrow: 1, p: { xs: 3, md: 5 }, bgcolor: "#FFFFFF" }}>
            {loading ? (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 20, gap: 2 }}>
                <CircularProgress size={28} thickness={6} sx={{ color: "#0F172A" }} />
                <Typography sx={{ color: "#94A3B8", fontSize: "0.875rem", fontWeight: 600 }}>Syncing events...</Typography>
              </Box>
            ) : (
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 5 }}>
                  <Box>
                    <Typography sx={{ fontSize: "1.25rem", fontWeight: 900, color: "#0F172A", mb: 0.5 }}>
                      {tabValue === 0 ? "Upcoming Adventures" : tabValue === 1 ? "Waitlist Queue" : "Completed Events"}
                    </Typography>
                    <Typography sx={{ fontSize: "0.85rem", color: "#94A3B8", fontWeight: 500 }}>
                      You have {filteredData.length} {tabValue === 0 ? "confirmed" : tabValue === 1 ? "pending" : "past"} registrations
                    </Typography>
                  </Box>
                  <Button 
                    component={RouterLink} 
                    to="/events" 
                    variant="contained" 
                    size="small"
                    sx={{ bgcolor: "#0F172A", textTransform: "none", fontWeight: 700, borderRadius: "8px", px: 2.5, py: 1, boxShadow: "none", "&:hover": { bgcolor: "#334155", boxShadow: "none" } }}
                  >
                    Find More Events
                  </Button>
                </Box>

                {filteredData.length > 0 ? (
                  <Stack spacing={1.5}>
                    {filteredData.map(reg => (
                      <EventRow 
                        key={reg.id} 
                        reg={reg} 
                        type={tabValue} 
                        onCancel={() => setCancelDialog({ open: true, id: reg.id })} 
                      />
                    ))}
                  </Stack>
                ) : (
                  <Box sx={{ py: 15, textAlign: "center", bgcolor: "#FAFBFC", borderRadius: "12px", border: "1px dashed #E2E8F0" }}>
                    <Box sx={{ p: 2, bgcolor: "#FFFFFF", borderRadius: "50%", display: "inline-flex", mb: 2, border: "1px solid #F1F5F9" }}>
                        <GridViewOutlinedIcon sx={{ color: "#CBD5E1", fontSize: 32 }} />
                    </Box>
                    <Typography sx={{ color: "#1E293B", fontSize: "1rem", fontWeight: 700, mb: 1 }}>
                      No results found
                    </Typography>
                    <Typography sx={{ color: "#64748B", fontSize: "0.875rem", mb: 3 }}>
                      Try adjusting your filters or browsing new events.
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Container>

      {/* Modern Confirmation Dialog */}
      <Dialog 
        open={cancelDialog.open} 
        onClose={() => setCancelDialog({ open: false, id: null })}
        PaperProps={{ elevation: 0, sx: { borderRadius: "16px", border: "1px solid #E2E8F0", maxWidth: 400, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: "1.35rem", letterSpacing: "-0.5px" }}>Cancel Registration</DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Typography sx={{ color: "#64748B", fontSize: "0.95rem", lineHeight: 1.6 }}>
            Are you sure you want to cancel? This will immediately free up your spot for someone else.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
          <Button onClick={() => setCancelDialog({ open: false, id: null })} sx={{ color: "#64748B", textTransform: "none", fontWeight: 700 }}>Stay</Button>
          <Button 
            onClick={handleConfirmCancel} 
            variant="contained" 
            disabled={cancelling}
            sx={{ bgcolor: "#EF4444", "&:hover": { bgcolor: "#DC2626" }, textTransform: "none", fontWeight: 800, borderRadius: "10px", px: 3, boxShadow: "none" }}
          >
            {cancelling ? "Processing..." : "Confirm Cancel"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

const EventRow = ({ reg, type, onCancel }) => (
  <Card 
    elevation={0}
    sx={{ 
      display: "flex", 
      alignItems: "center", 
      p: 2, 
      borderRadius: "12px", 
      border: "1px solid #F1F5F9",
      transition: "all 0.2s ease",
      "&:hover": { borderColor: "#CBD5E1", bgcolor: "#FAFAFA", transform: "translateX(4px)" }
    }}
  >
    <Avatar 
      variant="rounded" 
      src={reg.event.image} 
      sx={{ width: 60, height: 60, mr: 2.5, borderRadius: "10px", border: "1px solid #F1F5F9" }} 
    />
    
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
        <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.2px" }}>
          {reg.event.title}
        </Typography>
        {type === 1 && (
          <Chip 
            label={`Pos: #${reg.position_in_waitlist}`} 
            size="small" 
            sx={{ height: 18, fontSize: "0.65rem", fontWeight: 900, bgcolor: "#FEF3C7", color: "#92400E", borderRadius: "4px" }} 
          />
        )}
      </Stack>
      
      <Stack direction="row" spacing={2.5} sx={{ color: "#94A3B8" }}>
        <Typography sx={{ fontSize: "0.75rem", display: "flex", alignItems: "center", gap: 0.6, fontWeight: 600 }}>
          <CalendarTodayOutlinedIcon sx={{ fontSize: 13, color: "#64748B" }} /> {new Date(reg.event.date).toLocaleDateString('en-GB')}
        </Typography>
        <Typography sx={{ fontSize: "0.75rem", display: "flex", alignItems: "center", gap: 0.6, fontWeight: 600 }}>
          <LocationOnOutlinedIcon sx={{ fontSize: 13, color: "#64748B" }} /> {reg.event.location}
        </Typography>
      </Stack>
    </Box>

    <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
      <Button 
        component={RouterLink} 
        to={`/events/${reg.event.id}`}
        variant="text" 
        size="small" 
        sx={{ textTransform: "none", color: "#0F172A", fontWeight: 800, fontSize: "0.8rem" }}
      >
        Details
      </Button>
      
      {new Date(reg.event.date) < new Date() ? (
        <Button 
          variant="outlined" 
          size="small" 
          disabled
          sx={{ textTransform: "none", color: "#94A3B8", borderColor: "#E2E8F0", fontWeight: 800, fontSize: "0.8rem", borderRadius: "8px", px: 2 }}
        >
          Finished
        </Button>
      ) : type !== 2 ? (
        <Button 
          onClick={onCancel}
          variant="text" 
          size="small" 
          sx={{ textTransform: "none", color: "#EF4444", fontWeight: 800, fontSize: "0.8rem", "&:hover": { bgcolor: "#FEF2F2" } }}
        >
          Cancel
        </Button>
      ) : (
        <Button 
          variant="outlined" 
          size="small" 
          sx={{ textTransform: "none", color: "#0F172A", borderColor: "#E2E8F0", fontWeight: 800, fontSize: "0.8rem", borderRadius: "8px", px: 2 }}
        >
          Review
        </Button>
      )}
    </Stack>
  </Card>
);
