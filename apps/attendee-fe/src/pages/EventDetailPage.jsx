import { Box, Container, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useEventDetails } from "../hooks/useEventDetails";

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

  return (
    <Box component="main" sx={{ flexGrow: 1, pt: "70px", pb: 6 }}>
      <Box
        component="img"
        src={event.image || "https://via.placeholder.com/1600x500"}
        alt={event.title}
        sx={{ width: "100%", height: { xs: 220, md: 320 }, objectFit: "cover" }}
      />

      <Container maxWidth={false} sx={{ maxWidth: "1200px", px: "24px", pt: 4 }}>
        <Typography sx={{ fontSize: { xs: 34, md: 44 }, fontWeight: 800, color: "#333333", mb: 2 }}>
          {event.title}
        </Typography>
        <Typography sx={{ color: "#666666", mb: 1 }}>
          Organized by {event.organizer?.name || "Unknown Organizer"}
        </Typography>
        <Typography sx={{ fontWeight: 700, mb: 3 }}>
          {eventStats.rating} ({eventStats.reviews} reviews)
        </Typography>

        <Box sx={{ bgcolor: "#fff", border: "1px solid #E0E0E0", borderRadius: "12px", p: 3, mb: 3 }}>
          <Typography>Date: {event.date}</Typography>
          <Typography>Time: {event.time}</Typography>
          <Typography>Location: {event.location}</Typography>
          <Typography>Capacity: {eventStats.capacity} spots</Typography>
          <Typography>Available: {eventStats.available} spots</Typography>
        </Box>

        <Box sx={{ bgcolor: "#fff", border: "1px solid #E0E0E0", borderRadius: "12px", p: 3 }}>
          <Typography sx={{ fontSize: 22, fontWeight: 700, mb: 2 }}>About This Event</Typography>
          <Typography sx={{ color: "#444", lineHeight: 1.7 }}>
            {event.description || "No description available."}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
