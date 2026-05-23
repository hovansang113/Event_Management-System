import { useEffect, useMemo, useState } from "react";
import { eventService } from "../services/eventService";
import { categoryService } from "../services/categoryService";

const PAGE_SIZE = 15;

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

const extractArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  return [];
};

export const useEventsBrowse = () => {
  const [events, setEvents] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
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
      setApiError("");
      try {
        setLoading(true);
        const [eventResult, categoryResult] = await Promise.allSettled([
          eventService.getAll({ sort: "newest", per_page: 60 }),
          categoryService.getAll(),
        ]);

        if (eventResult.status === "fulfilled") {
          const eventRows = extractArray(eventResult.value);
          setEvents(eventRows.map(mapEventData));
        } else {
          setEvents([]);
          setApiError("Cannot load events from API. Please check backend server/API URL.");
        }

        if (categoryResult.status === "fulfilled") {
          const categoryRows = extractArray(categoryResult.value);
          setAllCategories(categoryRows.map((item) => ({ id: item.id, name: item.name })));
        } else {
          setAllCategories([]);
        }
      } catch {
        setEvents([]);
        setAllCategories([]);
        setApiError("Cannot load events from API. Please check backend server/API URL.");
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
  const hasFilters = Boolean(search || selectedCategories.length || fromDate || toDate || location || onlyAvailable);

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

  useEffect(() => {
    setPage(1);
  }, [search, selectedCategories, fromDate, toDate, location, onlyAvailable]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return {
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
  };
};
