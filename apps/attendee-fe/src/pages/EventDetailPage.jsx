import {
  Avatar,
  Box,
  Button,
  Container,
  LinearProgress,
  Rating,
  Typography,
} from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import { useParams } from "react-router-dom";
import { useEventDetails } from "../hooks/useEventDetails";

const formatDate = (value) => {
  if (!value) return "TBD";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const DetailItem = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
    <Box sx={{ color: "#007BFF", display: "flex", pt: 0.2 }}>{icon}</Box>
    <Box>
      <Typography sx={{ color: "#666666", fontSize: 12, mb: 0.6 }}>{label}</Typography>
      <Typography sx={{ color: "#111827", fontSize: 14, fontWeight: 700 }}>{value || "TBD"}</Typography>
    </Box>
  </Box>
);

export default function EventDetailPage() {
  const { id } = useParams();
  const { event, error, eventStats } = useEventDetails(id);

  if (error) {
    return (
      <Box component="main" sx={{ flexGrow: 1, pt: "70px", pb: 6 }}>
        <Container maxWidth={false} sx={{ maxWidth: "1200px", px: "24px", pt: 4 }}>
          <Typography color="error">{error}</Typography>
        </Container>
      </Box>
    );
  }

  if (!event) {
    return (
      <Box component="main" sx={{ flexGrow: 1, pt: "70px", pb: 6 }}>
        <Container maxWidth={false} sx={{ maxWidth: "1200px", px: "24px", pt: 4 }}>
          <Typography sx={{ color: "#666666" }}>Loading event...</Typography>
        </Container>
      </Box>
    );
  }

  const organizerName = event.organizer?.name || "Unknown Organizer";

  return (
    <Box component="main" sx={{ flexGrow: 1, pt: "70px", pb: 6, bgcolor: "#F8F9FA" }}>
      <Box
        component="img"
        src={event.image || "https://via.placeholder.com/1600x500"}
        alt={event.title}
        sx={{ width: "100%", height: { xs: 220, md: 250 }, objectFit: "cover", display: "block" }}
      />

      <Container maxWidth={false} sx={{ maxWidth: "1370px", px: { xs: "20px", md: "48px" }, pt: 3.5 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 350px" }, gap: { xs: 3, lg: 4 }, alignItems: "start" }}>
          <Box>
            <Typography sx={{ fontSize: { xs: 34, md: 42 }, lineHeight: 1.15, fontWeight: 800, color: "#202633", mb: 3 }}>
              {event.title}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Avatar sx={{ width: 42, height: 42, bgcolor: "#DCEAFE", color: "#0F172A", fontWeight: 800 }}>
                {organizerName.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography sx={{ color: "#666666", fontSize: 12 }}>Organized by</Typography>
                <Typography sx={{ color: "#111827", fontSize: 14, fontWeight: 700 }}>{organizerName}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <Rating value={Number(eventStats.rating)} precision={0.5} readOnly size="small" />
              <Typography sx={{ color: "#111827", fontSize: 14, fontWeight: 700 }}>{eventStats.rating}</Typography>
              <Typography sx={{ color: "#4B5563", fontSize: 14 }}>({eventStats.reviews} reviews)</Typography>
            </Box>

            <Box sx={{ bgcolor: "#fff", border: "1px solid #DADDE3", borderRadius: "10px", p: { xs: 2.5, md: 3 }, mb: 3 }}>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: { xs: 2.5, md: 3.2 } }}>
                <DetailItem icon={<CalendarMonthOutlinedIcon fontSize="small" />} label="Date" value={formatDate(event.date)} />
                <DetailItem icon={<AccessTimeOutlinedIcon fontSize="small" />} label="Time" value={event.time} />
                <DetailItem icon={<PlaceOutlinedIcon fontSize="small" />} label="Location" value={event.location} />
                <DetailItem icon={<GroupsOutlinedIcon fontSize="small" />} label="Capacity" value={`${eventStats.capacity} spots`} />
              </Box>
            </Box>

            <Box sx={{ bgcolor: "#fff", border: "1px solid #DADDE3", borderRadius: "10px", p: { xs: 2.5, md: 3 } }}>
              <Typography sx={{ color: "#111827", fontSize: 22, fontWeight: 800, mb: 2 }}>
                About This Event
              </Typography>
              <Typography sx={{ color: "#374151", fontSize: 14, lineHeight: 1.75 }}>
                {event.description || "No description available."}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ bgcolor: "#fff", border: "1px solid #DADDE3", borderRadius: "10px", p: 2.5, mt: { xs: 0, lg: 3.5 }, boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography sx={{ color: "#111827", fontSize: 14, fontWeight: 700 }}>Availability</Typography>
              <Typography sx={{ color: "#16A34A", fontSize: 14, fontWeight: 800 }}>
                {eventStats.available}/{eventStats.capacity}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={eventStats.progress}
              sx={{ height: 6, borderRadius: 999, bgcolor: "#E5E7EB", mb: 1.1, "& .MuiLinearProgress-bar": { bgcolor: "#28A745" } }}
            />
            <Typography sx={{ color: "#4B5563", fontSize: 12, mb: 2.5 }}>
              {eventStats.available} spots available
            </Typography>

            <Box sx={{ bgcolor: "#FFF4CC", border: "1px solid #F6B300", borderRadius: "8px", px: 1.5, py: 1.2, mb: 2.5 }}>
              <Typography sx={{ color: "#7A4B00", fontSize: 13, fontWeight: 700 }}>
                {eventStats.waitlistCount} people waiting
              </Typography>
            </Box>

            <Button fullWidth variant="contained" sx={{ bgcolor: "#007BFF", borderRadius: "6px", py: 1.25, mb: 3, textTransform: "none", fontWeight: 800, "&:hover": { bgcolor: "#0056B3" } }}>
              Login to Register
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
