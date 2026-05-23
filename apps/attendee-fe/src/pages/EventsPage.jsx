import { Alert, Box, Button, Container, Pagination, Typography } from "@mui/material";
import { BrowseEventCard, EventsFilterSidebar, EventsResultsToolbar } from "../components/event";
import { useEventsBrowse } from "../hooks/useEventsBrowse";

export default function EventsPage() {
  const {
    loading,
    apiError,
    page,
    setPage,
    viewMode,
    setViewMode,
    search,
    setSearch,
    selectedCategories,
    fromDate,
    toDate,
    location,
    onlyAvailable,
    setFromDate,
    setToDate,
    setLocation,
    setOnlyAvailable,
    categories,
    filteredEvents,
    paginatedEvents,
    totalPages,
    hasFilters,
    handleToggleCategory,
    clearAllFilters,
  } = useEventsBrowse();

  return (
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
            {apiError ? <Alert severity="warning" sx={{ mb: 2 }}>{apiError}</Alert> : null}

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
  );
}
