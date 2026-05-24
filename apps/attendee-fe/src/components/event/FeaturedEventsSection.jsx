import { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { eventService } from "../../services/eventService";
import EventCard from "./EventCard";

const mapEventData = (apiEvent) => {
  return {
    id: apiEvent.id,
    title: apiEvent.title || apiEvent.name || "",
    author: apiEvent.organizer?.name || apiEvent.author || "Unknown",
    date: apiEvent.event_date || apiEvent.date || "",
    location: apiEvent.location || apiEvent.venue || "",
    category: apiEvent.category?.name || apiEvent.category || "General",
    image: apiEvent.image || apiEvent.image_url || "https://via.placeholder.com/500x300",
    rating: Number(apiEvent.rating || 0),
    reviews: Number(apiEvent.reviews || apiEvent.review_count || 0),
    registered: Number(apiEvent.confirmed_count || apiEvent.registered || 0),
    capacity: Number(apiEvent.capacity || 100),
    progressColor: "#10b981"
  };
};

const featuredEventFilters = { sort: "newest" };

const getInitialEvents = () => {
  const cached = eventService.peekAll(featuredEventFilters);
  const data = cached?.data?.data || cached?.data || [];
  return Array.isArray(data) ? data.map(mapEventData) : [];
};

export default function FeaturedEventsSection() {
  const [events, setEvents] = useState(getInitialEvents);
  const [loading, setLoading] = useState(events.length === 0);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        if (events.length === 0) setLoading(true);
        const response = await eventService.getAll(featuredEventFilters);
        const data = response?.data?.data || response?.data || [];
        const mappedEvents = Array.isArray(data) ? data.map(mapEventData) : [];
        setEvents(mappedEvents);
      } catch (error) {
        console.error("Failed to load events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [events.length]);

  return (
    <Box sx={{ bgcolor: "#fff", py: { xs: "48px", md: "64px" }, px: { xs: "18px", sm: "24px" } }}>
      <Container maxWidth={false} sx={{ maxWidth: "1200px", px: 0 }}>
        <Box>
          <Box sx={{ mb: 2.5 }}>
            <Typography sx={{ fontSize: { xs: 30, md: 36 }, lineHeight: 1.15, fontWeight: 700, color: "#333333" }}>
              Featured Events
            </Typography>
            <Typography sx={{ color: "#666666", fontSize: 14, mt: 0.7 }}>
              Discover the most popular events happening near you
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
              gap: "24px"
            }}
          >
            {loading ? (
              <Typography sx={{ gridColumn: "1 / -1", textAlign: "center", color: "#667085", py: 4 }}>
                Loading events...
              </Typography>
            ) : events.length > 0 ? (
              events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <Typography sx={{ gridColumn: "1 / -1", textAlign: "center", color: "#667085", py: 4 }}>
                No events available
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
