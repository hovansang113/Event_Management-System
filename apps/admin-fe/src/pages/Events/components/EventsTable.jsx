import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { format } from "date-fns";

const getStatusColor = (status) => {
  const statusMap = {
    Published: { bgcolor: "#dcfce7", color: "#15803d" },
    Pending: { bgcolor: "#fef3c7", color: "#b45309" },
    Draft: { bgcolor: "#f3f4f6", color: "#4b5563" },
    Rejected: { bgcolor: "#fee2e2", color: "#b91c1c" },
    Cancelled: { bgcolor: "#fee2e2", color: "#b91c1c" },
  };
  return statusMap[status] || statusMap.Draft;
};

const getCapacityColor = (filled) => {
  if (filled < 70) return "#28A745"; // Green
  if (filled < 90) return "#FFC107"; // Orange
  return "#DC3545"; // Red
};

export const EventsTable = ({
  events = [],
  loading = false,
  onView,
  onDelete,
}) => {
  if (loading) {
    return <LinearProgress />;
  }

  if (events.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography color="textSecondary">No events found</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, border: "1px solid #e5e7eb", boxShadow: "none" }}>
      <Table sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f9fafb" }}>
            <TableCell sx={{ fontWeight: 700, fontSize: 11, color: "#9ca3af", letterSpacing: 0.5, textTransform: "uppercase", width: "20%" }}>EVENT</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: 11, color: "#9ca3af", letterSpacing: 0.5, textTransform: "uppercase", width: "15%" }}>ORGANIZER</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: 11, color: "#9ca3af", letterSpacing: 0.5, textTransform: "uppercase", width: "20%" }}>
              DATE & LOCATION
            </TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: 11, color: "#9ca3af", letterSpacing: 0.5, textTransform: "uppercase", width: "12%" }}>CAPACITY</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: 11, color: "#9ca3af", letterSpacing: 0.5, textTransform: "uppercase", width: "12%" }}>STATUS</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: 11, color: "#9ca3af", letterSpacing: 0.5, textTransform: "uppercase", width: "21% " }}>ACTIONS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => {
            const filledPercentage =
              (event.registered / event.capacity) * 100;
            const statusColor = getStatusColor(event.status);

            return (
              <TableRow
                key={event.id}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f9fafb",
                  },
                  borderBottom: "1px solid #f1f5f9",
                  height: 80,
                }}
              >
                {/* EVENT COLUMN */}
                <TableCell>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Avatar
                      src={event.image || "https://via.placeholder.com/60x60?text="}
                      variant="rounded"
                      sx={{ width: 60, height: 60, bgcolor: "#f3f4f6" }}
                    />
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, fontSize: 13, color: "#111827", mb: 0.5 }}
                      >
                        {event.title}
                      </Typography>
                      <Chip
                        label={event.category?.name || "Uncategorized"}
                        size="small"
                        sx={{ fontSize: 11, height: 20, bgcolor: "#f3f4f6", color: "#6b7280" }}
                      />
                    </Box>
                  </Box>
                </TableCell>

                {/* ORGANIZER COLUMN */}
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>
                      {event.organizer?.name || "Unknown"}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: 12, color: "#9ca3af" }}>
                      {event.organizer?.email || "N/A"}
                    </Typography>
                  </Box>
                </TableCell>

                {/* DATE & LOCATION COLUMN */}
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontSize: 13, color: "#374151" }}>
                      📅 {format(new Date(event.date), "MMM dd, yyyy")}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: 11, color: "#9ca3af" }}>
                      📍 {event.location || "No location"}
                    </Typography>
                  </Box>
                </TableCell>

                {/* CAPACITY COLUMN */}
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13, color: "#111827", mb: 0.5 }}>
                      👥 {event.registered}/{event.capacity}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(filledPercentage, 100)}
                      sx={{
                        backgroundColor: "#e5e7eb",
                        height: 6,
                        borderRadius: 1,
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: getCapacityColor(filledPercentage),
                          borderRadius: 1,
                        },
                      }}
                    />
                    <Typography variant="caption" sx={{ fontSize: 11, color: "#9ca3af" }}>
                      {filledPercentage.toFixed(0)}% filled
                    </Typography>
                  </Box>
                </TableCell>

                {/* STATUS COLUMN */}
                <TableCell>
                  <Chip
                    label={event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}
                    size="small"
                    sx={{
                      ...statusColor,
                      fontWeight: 600,
                      fontSize: 11,
                      height: 22,
                      mb: 1,
                    }}
                  />
                  {event.status === "published" && event.rating && (
                    <Box>
                      <Typography variant="caption">
                        ⭐ {event.rating} ({event.reviews} reviews)
                      </Typography>
                    </Box>
                  )}
                </TableCell>

                {/* ACTIONS COLUMN */}
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => onView(event.id)}
                        sx={{
                          color: "#1170e4",
                          p: 0.5,
                          "&:hover": { backgroundColor: "#e8f1ff" },
                        }}
                      >
                        <VisibilityIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>

                    {(event.status === "draft" || event.status === "rejected") && (
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => onDelete(event.id)}
                          sx={{
                            color: "#ef4444",
                            p: 0.5,
                            "&:hover": {
                              backgroundColor: "#fee2e2",
                            },
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title="More Options">
                      <IconButton
                        size="small"
                        sx={{
                          color: "#6b7280",
                          p: 0.5,
                          "&:hover": { backgroundColor: "#f3f4f6" },
                        }}
                      >
                        <MoreVertIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
