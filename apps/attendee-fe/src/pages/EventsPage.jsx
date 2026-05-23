import { useEffect, useMemo, useState } from "react";
import { Box, Button, Container, Pagination, Typography } from "@mui/material";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { eventService } from "../services/eventService";
import { categoryService } from "../services/categoryService";
import { BrowseEventCard, EventsFilterSidebar, EventsResultsToolbar } from "../components/event";

const fallbackEvents = [
  { id: 1, title: "Summer Music Festival 2026", author: "Sarah Johnson", date: "2026-06-15", dateLabel: "Mon, Jun 15", location: "Central Park, New York", category: "Music", image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80", rating: 4.8, reviews: 45, registered: 158, capacity: 500 },
  { id: 2, title: "Marathon City Run", author: "Mike Chen", date: "2026-05-20", dateLabel: "Wed, May 20", location: "Downtown Stadium, Los Angeles", category: "Sports", image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80", rating: 4.5, reviews: 120, registered: 150, capacity: 1000 },
  { id: 3, title: "Food & Wine Tasting", author: "Sarah Johnson", date: "2026-05-25", dateLabel: "Mon, May 25", location: "Grand Hotel Ballroom, Chicago", category: "Food", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80", rating: 4.9, reviews: 32, registered: 80, capacity: 80 },
  { id: 4, title: "Art Workshop Weekend", author: "Emma Wilson", date: "2026-07-10", dateLabel: "Fri, Jul 10", location: "Art Center, San Francisco", category: "Arts", image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80", rating: 4.7, reviews: 64, registered: 96, capacity: 120 },
  { id: 5, title: "Frontend Bootcamp", author: "David Lee", date: "2026-08-02", dateLabel: "Sun, Aug 2", location: "Tech Hub, Seattle", category: "Education", image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80", rating: 4.6, reviews: 88, registered: 72, capacity: 100 },
  { id: 6, title: "Community Cleanup Day", author: "Alex Smith", date: "2026-06-28", dateLabel: "Sun, Jun 28", location: "Riverside Park, Austin", category: "Community", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80", rating: 4.4, reviews: 20, registered: 54, capacity: 120 },
];

const formatDateLabel = (value) => {
  if (!value) return "TBD";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "TBD";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

const mapEventData = (apiEvent) => ({
  id: apiEvent.id,
  title: apiEvent.title || apiEvent.name || "Untitled Event",
  author: apiEvent.organizer?.name || apiEvent.author || "Unknown",
  date: apiEvent.event_date || apiEvent.date || "",
  dateLabel: formatDateLabel(apiEvent.event_date || apiEvent.date || ""),
  location: apiEvent.location || apiEvent.venue || "Unknown Location",
  category: apiEvent.category?.name || apiEvent.category || "General",
  image: apiEvent.image || apiEvent.image_url || "https://via.placeholder.com/1200x700",
  rating: Number(apiEvent.rating || 4.5),
  reviews: Number(apiEvent.reviews || apiEvent.review_count || 0),
  registered: Number(apiEvent.confirmed_count || apiEvent.registered || 0),
  capacity: Number(apiEvent.capacity || 100),
});

export default function EventsPage() {
  const PAGE_SIZE = 15;
  const [events, setEvents] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [location, setLocation] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const [eventResp, categoryResp] = await Promise.all([
          eventService.getAll({ sort: "newest", per_page: 60 }),
          categoryService.getAll(),
        ]);
        const data = eventResp?.data?.data || eventResp?.data || eventResp || [];
        const categoryRows = categoryResp?.data || categoryResp || [];
        const mapped = Array.isArray(data) && data.length > 0 ? data.map(mapEventData) : fallbackEvents;
        setEvents(mapped);
        setAllCategories(
          Array.isArray(categoryRows)
            ? categoryRows.map((item) => ({ id: item.id, name: item.name }))
            : []
        );
      } catch {
        setEvents(fallbackEvents);
        setAllCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const categories = useMemo(() => {
    const counts = events.reduce((acc, item) => {
      const name = item.category || "General";
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    if (allCategories.length > 0) {
      return allCategories.map((item) => ({
        name: item.name,
        count: counts[item.name] || 0,
      }));
    }

    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [events, allCategories]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchSearch = !search || event.title.toLowerCase().includes(search.toLowerCase());
      const matchLocation = !location || event.location.toLowerCase().includes(location.toLowerCase());
      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(event.category);
      const matchAvailable = !onlyAvailable || event.registered < event.capacity;

      const currentDate = event.date ? new Date(event.date) : null;
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      const matchFrom = !from || !currentDate || currentDate >= from;
      const matchTo = !to || !currentDate || currentDate <= to;

      return matchSearch && matchLocation && matchCategory && matchFrom && matchTo && matchAvailable;
    });
  }, [events, search, selectedCategories, location, fromDate, toDate, onlyAvailable]);

  const paginatedEvents = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredEvents.slice(start, start + PAGE_SIZE);
  }, [filteredEvents, page]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));

  const handleToggleCategory = (name) => {
    setSelectedCategories((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]));
  };

  const clearAllFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setFromDate("");
    setToDate("");
    setLocation("");
    setOnlyAvailable(false);
  };

  const hasFilters = Boolean(search || selectedCategories.length || fromDate || toDate || location || onlyAvailable);

  useEffect(() => setPage(1), [search, selectedCategories, fromDate, toDate, location, onlyAvailable]);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  return (
    <Box display="flex" flexDirection="column" minHeight="100dvh" bgcolor="#F8F9FA">
      <Header />
      <Box component="main" sx={{ flexGrow: 1, pt: "70px", pb: 6 }}>
        <Container maxWidth={false} sx={{ maxWidth: "1400px", px: "24px", pt: 4 }}>
          <Typography sx={{ fontSize: { xs: 36, md: 48 }, fontWeight: 800, color: "#333333", mb: 0.8 }}>Browse Events</Typography>
          <Typography sx={{ fontSize: 14, color: "#666666", mb: 3.5 }}>Discover events that match your interests</Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "300px 1fr" }, gap: 3, alignItems: "start" }}>
            <EventsFilterSidebar
              search={search}
              onSearchChange={setSearch}
              categories={categories}
              selectedCategories={selectedCategories}
              onToggleCategory={handleToggleCategory}
              fromDate={fromDate}
              toDate={toDate}
              onFromDateChange={setFromDate}
              onToDateChange={setToDate}
              location={location}
              onLocationChange={setLocation}
              onlyAvailable={onlyAvailable}
              onOnlyAvailableChange={setOnlyAvailable}
              hasFilters={hasFilters}
              onClearAll={clearAllFilters}
            />

            <Box>
              <EventsResultsToolbar count={filteredEvents.length} viewMode={viewMode} onViewModeChange={setViewMode} />

              {!loading && filteredEvents.length === 0 ? (
                <Box sx={{ bgcolor: "#fff", border: "1px solid #E0E0E0", borderRadius: "12px", textAlign: "center", p: 5 }}>
                  <Typography sx={{ fontSize: 48, mb: 1 }}>??</Typography>
                  <Typography sx={{ fontWeight: 700, color: "#333333", mb: 0.8 }}>No events found</Typography>
                  <Typography sx={{ fontSize: 14, color: "#666666", mb: 2 }}>Try adjusting your filters to see more events.</Typography>
                  <Button variant="contained" onClick={clearAllFilters} sx={{ textTransform: "none", bgcolor: "#007BFF", "&:hover": { bgcolor: "#0056B3" } }}>
                    Clear All Filters
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: "grid", gridTemplateColumns: viewMode === "grid" ? { xs: "1fr", lg: "repeat(2,1fr)", xl: "repeat(3,1fr)" } : "1fr", gap: "24px" }}>
                  {loading ? <Typography sx={{ color: "#666666", fontSize: 16 }}>Loading events...</Typography> : paginatedEvents.map((event) => <BrowseEventCard key={event.id} event={event} viewMode={viewMode} />)}
                </Box>
              )}

              {!loading && filteredEvents.length > 0 ? (
                <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    shape="rounded"
                    sx={{
                      "& .MuiPagination-ul": { gap: "8px" },
                      "& .MuiPaginationItem-root": { borderRadius: "8px", color: "#666666", border: "1px solid transparent" },
                      "& .MuiPaginationItem-root.Mui-selected": { bgcolor: "#007BFF", color: "#fff", borderColor: "#007BFF" },
                    }}
                  />
                </Box>
              ) : null}
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
