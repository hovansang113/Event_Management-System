import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  LinearProgress,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { useNavigate } from "react-router-dom";
import { eventService } from "../../services/eventService";
import { useState } from "react";

export default function EventCard({ event }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const safeCapacity = event.capacity > 0 ? event.capacity : 1;
  const progress = Math.min(100, Math.round((event.registered / safeCapacity) * 100));
  const full = event.registered >= safeCapacity;
  const isPast = new Date(event.date) < new Date();

  const goToDetail = () => {
    eventService.seedDetail(event);
    navigate(`/events/${event.id}`, { state: { event } });
  };

  const handleRegister = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await eventService.register(event.id);
      alert(full ? "Joined waitlist successfully!" : "Registered successfully!");
    } catch (err) {
      alert("Failed to register: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        fontFamily: "inherit",
        borderRadius: "16px",
        boxShadow: "none",
        border: "1px solid #E0E0E0",
        "& .MuiTypography-root, & .MuiButton-root, & .MuiChip-label": {
          fontFamily: "inherit",
        },
        transition: "transform 220ms ease, box-shadow 220ms ease",
        "&:hover": {
          transform: "translateY(-2px) scale(1.02)",
          boxShadow: "0 18px 32px rgba(16,24,40,0.18)",
        },
        "&:hover .event-card-image": {
          transform: "scale(1.04)",
        },
        cursor: "pointer",
      }}
      onClick={goToDetail}
    >
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <CardMedia
          className="event-card-image"
          component="img"
          height="150"
          image={event.image}
          alt={event.title}
          sx={{ transition: "transform 280ms ease" }}
        />
        <Chip
          label={event.category}
          size="small"
          sx={{ position: "absolute", top: 8, left: 8, bgcolor: "#e8f0ff", color: "#0d6efd", fontWeight: 600, fontSize: 10.5 }}
        />
      </Box>

      <CardContent sx={{ p: 1.6 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 0.3, color: "#1f2937", lineHeight: 1.3 }}>{event.title}</Typography>
        <Typography sx={{ fontSize: 12.5, color: "#667085", mb: 1.1 }}>by {event.author}</Typography>

        <Stack spacing={0.65}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarMonthOutlinedIcon sx={{ fontSize: 15, color: "#0d6efd" }} />
            <Typography sx={{ fontSize: 12, color: "#344054" }}>{event.date}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PlaceOutlinedIcon sx={{ fontSize: 15, color: "#0d6efd" }} />
            <Typography sx={{ fontSize: 12, color: "#344054" }}>{event.location}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 0.2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
              <Rating value={Number(event.rating) || 0} precision={0.5} size="small" readOnly />
              <Typography sx={{ fontSize: 12, color: "#111827" }}>
                {Number(event.rating || 0).toFixed(1)}
                <Typography component="span" sx={{ color: "#6b7280", fontSize: 11 }}> ({event.reviews})</Typography>
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 12, color: "#1d4ed8", fontWeight: 600 }}>{event.registered} / {event.capacity}</Typography>
          </Box>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 3.5, borderRadius: 999, bgcolor: "#e5e7eb", my: 1.2, "& .MuiLinearProgress-bar": { bgcolor: event.progressColor } }}
        />

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.2 }}>
          <Button variant="outlined" onClick={goToDetail} sx={{ textTransform: "none", borderRadius: 2, fontSize: 12, fontWeight: 600 }}>View</Button>
          {isPast ? (
            <Button
              variant="contained"
              disabled
              sx={{ textTransform: "none", borderRadius: 2, fontSize: 12, fontWeight: 600, bgcolor: "#E2E8F0", color: "#94A3B8", boxShadow: "none" }}
            >
              Finished
            </Button>
          ) : (
            <Button
              variant="contained"
              disabled={loading}
              onClick={handleRegister}
              sx={{ textTransform: "none", borderRadius: 2, fontSize: 12, fontWeight: 600 }}
            >
              {loading ? "Processing..." : (full ? "Join Waitlist" : "Register")}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
