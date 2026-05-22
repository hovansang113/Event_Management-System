import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Chip,
  Avatar,
  CircularProgress,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import StarIcon from "@mui/icons-material/Star";
import { format } from "date-fns";

const getStatusConfig = (status) => {
  const statusMap = {
    Published: { label: "Published", color: "#10b981" },
    Pending: { label: "Pending", color: "#f59e0b" },
    Draft: { label: "Draft", color: "#6b7280" },
    Rejected: { label: "Rejected", color: "#ef4444" },
    Cancelled: { label: "Cancelled", color: "#ef4444" },
  };
  return statusMap[status] || statusMap.Draft;
};

export const ViewEventModal = ({
  open,
  event,
  loading,
  onClose,
  onLoadApprove,
  onLoadReject,
}) => {
  if (!event) return null;

  const statusConfig = getStatusConfig(event.status);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, maxWidth: 600 },
      }}
    >
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DialogContent sx={{ p: 0, position: "relative" }}>
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              bgcolor: "rgba(255, 255, 255, 0.9)",
              zIndex: 1,
              "&:hover": { bgcolor: "rgba(255, 255, 255, 1)" },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Header */}
          <Box sx={{ p: 3, pb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 20 }}>
              Event Details
            </Typography>
          </Box>

          {/* Event Image */}
          {event.image ? (
            <Box
              component="img"
              src={event.image}
              sx={{
                width: "100%",
                height: 240,
                objectFit: "cover",
              }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: 240,
                bgcolor: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ color: "#9ca3af" }}>No Image</Typography>
            </Box>
          )}

          {/* Content */}
          <Box sx={{ p: 3 }}>
            {/* Status & Category */}
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <Chip
                label={statusConfig.label}
                size="small"
                sx={{
                  bgcolor: statusConfig.color,
                  color: "white",
                  fontWeight: 600,
                  fontSize: 11,
                  height: 24,
                }}
              />
              <Chip
                label={event.category?.name || "Uncategorized"}
                size="small"
                sx={{
                  bgcolor: "#f3f4f6",
                  color: "#6b7280",
                  fontWeight: 500,
                  fontSize: 11,
                  height: 24,
                }}
              />
            </Box>

            {/* Title */}
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, fontSize: 24 }}>
              {event.title}
            </Typography>

            {/* Description */}
            {event.description && (
              <Typography
                variant="body2"
                sx={{ color: "#6b7280", lineHeight: 1.6, mb: 3 }}
              >
                {event.description}
              </Typography>
            )}

            {/* Date & Location Row */}
            <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
              {/* Date */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <CalendarTodayIcon sx={{ fontSize: 18, color: "#3b82f6" }} />
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, color: "#6b7280", fontSize: 11 }}
                  >
                    Date
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
                  {format(new Date(event.date), "EEEE, MMMM dd, yyyy")}
                </Typography>
                {event.time && (
                  <Typography variant="caption" sx={{ color: "#6b7280" }}>
                    {event.time}
                  </Typography>
                )}
              </Box>

              {/* Location */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <LocationOnIcon sx={{ fontSize: 18, color: "#3b82f6" }} />
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, color: "#6b7280", fontSize: 11 }}
                  >
                    Location
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
                  {event.location || "No location"}
                </Typography>
              </Box>
            </Box>

            {/* Capacity & Rating Row */}
            <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
              {/* Capacity */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <PeopleIcon sx={{ fontSize: 18, color: "#3b82f6" }} />
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, color: "#6b7280", fontSize: 11 }}
                  >
                    Capacity
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
                  {event.registered} / {event.capacity} registered
                </Typography>
              </Box>

              {/* Rating */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <StarIcon sx={{ fontSize: 18, color: "#3b82f6" }} />
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, color: "#6b7280", fontSize: 11 }}
                  >
                    Rating
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
                  {event.rating || "N/A"} ★ ({event.reviews || 0} reviews)
                </Typography>
              </Box>
            </Box>

            {/* Organizer */}
            <Box
              sx={{
                border: "1px solid #e5e7eb",
                borderRadius: 2,
                p: 2,
                mb: 3,
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: "#6b7280", fontSize: 11, mb: 1, display: "block" }}
              >
                Organizer
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar
                  src={event.organizer?.avatar}
                  sx={{ width: 40, height: 40 }}
                />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 14 }}>
                    {event.organizer?.name || "Unknown"}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#6b7280", fontSize: 12 }}>
                    {event.organizer?.email || "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Action Buttons */}
            {event.status === "Pending" && (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => onLoadReject(event.id)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderColor: "#ef4444",
                    color: "#ef4444",
                    "&:hover": {
                      borderColor: "#dc2626",
                      bgcolor: "#fef2f2",
                    },
                  }}
                >
                  Reject
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => onLoadApprove(event.id)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    bgcolor: "#10b981",
                    "&:hover": { bgcolor: "#059669" },
                  }}
                >
                  Approve
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
      )}
    </Dialog>
  );
};
