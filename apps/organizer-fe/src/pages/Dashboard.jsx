import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
  Button,
} from "@mui/material";
import {
  CalendarMonthOutlined,
  TrendingUp,
  Groups2Outlined,
  EventAvailableOutlined,
  RemoveRedEyeOutlined,
  EditOutlined,
  GroupOutlined,
  SendOutlined,
  CancelOutlined,
} from "@mui/icons-material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../hooks/useDashboard";
import { eventService } from "../services/eventService";
import CreateEventDialog from "../components/CreateEventDialog";

const statusTabs = ["All", "Draft", "Pending", "Published", "Rejected", "Cancelled"];

const cardMeta = [
  { key: "total_events", label: "Total Events", icon: <CalendarMonthOutlined sx={{ color: "#1170e4", fontSize: 20 }} />, bg: "#e8f1ff" },
  { key: "published_count", label: "Published", icon: <TrendingUp sx={{ color: "#16a34a", fontSize: 20 }} />, bg: "#e9f7ec" },
  { key: "total_attendees", label: "Total Attendees", icon: <Groups2Outlined sx={{ color: "#1170e4", fontSize: 20 }} />, bg: "#e8f1ff" },
  { key: "upcoming_events", label: "Upcoming", icon: <EventAvailableOutlined sx={{ color: "#eab308", fontSize: 20 }} />, bg: "#fef6dc" },
];

const statusChipSx = {
  Published: { bgcolor: "#dcfce7", color: "#15803d" },
  Pending: { bgcolor: "#fef3c7", color: "#b45309" },
  Draft: { bgcolor: "#f3f4f6", color: "#4b5563" },
  Rejected: { bgcolor: "#fee2e2", color: "#b91c1c" },
  Cancelled: { bgcolor: "#fee2e2", color: "#b91c1c" },
};

const formatDateTime = (event) => {
  if (!event.event_date) return { date: "-", time: "-" };
  const d = new Date(event.event_date);
  const date = Number.isNaN(d.getTime())
    ? event.event_date
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return { date, time: event.event_time || "-" };
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { stats, events, loading, filters, handleFilterChange, fetchEvents } = useDashboard();
  const [tab, setTab] = useState("All");
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const filteredEvents = useMemo(() => {
    if (tab === "All") return events;
    return events.filter((e) => e.status === tab);
  }, [events, tab]);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
        <Box>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>
            Organizer Dashboard
          </Typography>
          <Typography sx={{ mt: 0.3, color: "#6b7280", fontSize: 13 }}>
            Manage and track your events
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          onClick={() => setOpenCreateDialog(true)}
          sx={{ textTransform: "none", fontWeight: 600, borderRadius: 1.5, boxShadow: "none", fontSize: 13 }}
        >
          + Create Event
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 2, mb: 2.5 }}>
        {cardMeta.map((item) => (
          <Card key={item.key} sx={{ borderRadius: 2, border: "1px solid #e5e7eb", boxShadow: "none" }}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Box sx={{ width: 34, height: 34, borderRadius: 1.5, bgcolor: item.bg, display: "grid", placeItems: "center", mb: 1 }}>
                {item.icon}
              </Box>
              <Typography sx={{ fontSize: 26, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>
                {stats[item.key] ?? 0}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#6b7280", mt: 0.3 }}>{item.label}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Events Table */}
      <Card sx={{ borderRadius: 2, border: "1px solid #e5e7eb", boxShadow: "none" }}>
        <Box sx={{ px: 2, pt: 1, borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Tabs
            value={tab}
            onChange={(_, value) => { setTab(value); handleFilterChange({ status: value }); }}
            sx={{ minHeight: 38, "& .MuiTab-root": { minHeight: 38, textTransform: "none", fontWeight: 600, fontSize: 13, py: 0 } }}
          >
            {statusTabs.map((s) => <Tab key={s} value={s} label={s} />)}
          </Tabs>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <Select
              value={filters.sort}
              onChange={(e) => handleFilterChange({ sort: e.target.value })}
              sx={{ fontSize: 13 }}
            >
              <MenuItem value="newest" sx={{ fontSize: 13 }}>Newest First</MenuItem>
              <MenuItem value="oldest" sx={{ fontSize: 13 }}>Oldest First</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ px: 2, py: 1 }}>
          {/* Table Header */}
          <Box sx={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1.2fr 1fr 0.7fr 0.8fr 1fr", px: 1, py: 0.8, fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: 0.5, textTransform: "uppercase" }}>
            <Box>Event</Box>
            <Box>Date</Box>
            <Box>Location</Box>
            <Box>Registrations</Box>
            <Box>Waitlist</Box>
            <Box>Status</Box>
            <Box>Actions</Box>
          </Box>

          {loading ? (
            <Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            filteredEvents.map((event) => {
              const { date, time } = formatDateTime(event);
              return (
                <Box
                  key={event.id}
                  sx={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1.2fr 1fr 0.7fr 0.8fr 1fr", px: 1, py: 1.2, borderTop: "1px solid #f1f5f9", alignItems: "center" }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>{event.title}</Typography>
                    <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>{event.category_name || "-"}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 13, color: "#374151" }}>{date}</Typography>
                    <Typography sx={{ fontSize: 11, color: "#9ca3af" }}>{time}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 13, color: "#4b5563" }} noWrap>{event.location || "-"}</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                    {event.registrations_count ?? 0}/{event.capacity ?? 0}
                  </Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: (event.waitlist_count ?? 0) > 0 ? "#ca8a04" : "#9ca3af" }}>
                    {event.waitlist_count ?? 0}
                  </Typography>
                  <Chip
                    label={event.status || "Draft"}
                    size="small"
                    sx={{ fontWeight: 600, fontSize: 11, height: 22, ...statusChipSx[event.status] || statusChipSx.Draft }}
                  />
                  <Stack direction="row" spacing={0.3}>
                    <IconButton size="small" sx={{ color: "#1170e4", p: 0.5 }} onClick={() => navigate(`/organizer/events/${event.id}`)}>
                      <RemoveRedEyeOutlined sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "#1170e4", p: 0.5 }} onClick={() => { setEditEventId(event.id); setOpenCreateDialog(true); }}>
                      <EditOutlined sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "#1170e4", p: 0.5 }}>
                      <GroupOutlined sx={{ fontSize: 16 }} />
                    </IconButton>
                    {(event.status === "Rejected" || event.status === "Draft") && (
                      <IconButton size="small" sx={{ color: "#16a34a", p: 0.5 }} onClick={async () => { await eventService.submit(event.id); fetchEvents(); }}>
                        <SendOutlined sx={{ fontSize: 16 }} />
                      </IconButton>
                    )}
                    {event.status === "Published" && (
                      <IconButton size="small" sx={{ color: "#ef4444", p: 0.5 }} onClick={async () => { const reason = window.prompt("Cancellation reason:"); if (reason) { await eventService.cancel(event.id, reason); fetchEvents(); } }}>
                        <CancelOutlined sx={{ fontSize: 16 }} />
                      </IconButton>
                    )}
                  </Stack>
                </Box>
              );
            })
          )}

          {!loading && filteredEvents.length === 0 && (
            <Box sx={{ py: 5, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>No events found.</Box>
          )}
        </Box>
      </Card>

      {/* Create Event Dialog */}
      <CreateEventDialog
        open={openCreateDialog}
        onClose={() => {
          setOpenCreateDialog(false);
          setEditEventId(null);
        }}
        onSuccess={() => {
          fetchEvents();
          setOpenCreateDialog(false);
          setEditEventId(null);
        }}
        eventId={editEventId}
      />
    </Box>
  );
};

export default Dashboard;
