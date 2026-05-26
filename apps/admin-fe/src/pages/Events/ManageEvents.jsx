import { Container, Typography, Alert, Snackbar, Button, Card, Tabs, Tab, FormControl, Select, MenuItem, CircularProgress, TextField, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useManageEvents } from "../../hooks/Events/useManageEvents";
import { StatsSection } from "./components/StatsSection";
import { EventsTable } from "./components/EventsTable";
import { ViewEventModal } from "./components/ViewEventModal";
import { ApproveEventModal } from "./components/ApproveEventModal";
import { RejectEventModal } from "./components/RejectEventModal";

const statusTabs = ["All", "Pending", "Published", "Draft", "Rejected", "Cancelled"];

export default function ManageEvents() {
  const {
    events,
    stats,
    loading,
    error,
    activeTab,
    selectedCategory,
    categories,
    searchTerm,
    viewModalOpen,
    selectedEvent,
    eventDetailLoading,
    approveModalOpen,
    approveLoading,
    rejectModalOpen,
    rejectLoading,
    snackbar,
    setActiveTab,
    setSelectedCategory,
    setSearchTerm,
    setError,
    setViewModalOpen,
    fetchEvents,
    handleViewEvent,
    handleApproveConfirm,
    handleApproveClick,
    handleRejectClick,
    handleRejectConfirm,
    handleDeleteEvent,
    handleSnackbarClose,
    setApproveModalOpen,
    setRejectModalOpen,
  } = useManageEvents();

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 2.5 }}>
        <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>
          Manage Events
        </Typography>
        <Typography sx={{ mt: 0.3, color: "#6b7280", fontSize: 13 }}>
          Review, approve and manage all event submissions
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2.5 }}>
          {error}
        </Alert>
      )}

      {/* Stats Section */}
      <StatsSection stats={stats} />

      {/* Search Bar */}
      <Box sx={{ mb: 2 }}>
        <TextField
          placeholder="Search by event name, organizer or category..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "gray" }} />,
          }}
          fullWidth
        />
      </Box>

      {/* Events Table with Tabs */}
      <Card sx={{ borderRadius: 2, border: "1px solid #e5e7eb", boxShadow: "none" }}>
        <Box sx={{ px: 2, pt: 1.5, pb: 1, borderBottom: "1px solid #e5e7eb" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Tabs
              value={activeTab}
              onChange={(_, value) => setActiveTab(value)}
              sx={{ minHeight: 38, "& .MuiTab-root": { minHeight: 38, textTransform: "none", fontWeight: 600, fontSize: 13, py: 0 } }}
            >
              {statusTabs.map((s) => <Tab key={s} value={s} label={s} />)}
            </Tabs>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                sx={{ fontSize: 13 }}
              >
                <MenuItem value="all" sx={{ fontSize: 13 }}>All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.slug} sx={{ fontSize: 13 }}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ p: 2 }}>
          {loading ? (
            <Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
              <CircularProgress size={24} />
            </Box>
          ) 
          : (
            <EventsTable
              events={events}
              loading={false}
              onView={handleViewEvent}
              onDelete={handleDeleteEvent}
            />
          )
          }
        </Box>
      </Card>

      {/* Modals */}
      <ViewEventModal
        open={viewModalOpen}
        event={selectedEvent}
        loading={eventDetailLoading}
        onClose={() => setViewModalOpen(false)}
        onApprove={handleApproveConfirm}
        onReject={handleRejectConfirm}
        onLoadApprove={handleApproveClick}
        onLoadReject={handleRejectClick}
      />

      <ApproveEventModal
        open={approveModalOpen}
        eventTitle={selectedEvent?.title || ""}
        loading={approveLoading}
        onConfirm={handleApproveConfirm}
        onCancel={() => setApproveModalOpen(false)}
      />

      <RejectEventModal
        open={rejectModalOpen}
        eventTitle={selectedEvent?.title || ""}
        loading={rejectLoading}
        onConfirm={handleRejectConfirm}
        onCancel={() => setRejectModalOpen(false)}
      />

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.type}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
