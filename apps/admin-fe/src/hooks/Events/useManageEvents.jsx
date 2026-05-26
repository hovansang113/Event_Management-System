import { useState, useEffect, useCallback, useMemo } from "react";
import { eventService } from "../../services/eventService";
import { categoryService } from "../../services/categoryService";

export const useManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDetailLoading, setEventDetailLoading] = useState(false);

  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approveEventId, setApproveEventId] = useState(null);
  const [approveLoading, setApproveLoading] = useState(false);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectEventId, setRejectEventId] = useState(null);
  const [rejectLoading, setRejectLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });

  // Fetch Events
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {
        status: activeTab !== "All" ? activeTab.toLowerCase() : undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        search: searchTerm || undefined,
      };

      const result = await eventService.getAll(filters);
      // result.data contains { events: { data: [...] }, stats: ... }
      setEvents(Array.isArray(result.data?.events?.data) ? result.data.events.data : []);
      setStats(result.data?.stats);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load events");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedCategory, searchTerm]);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await categoryService.getAll();
        setCategories(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Initial Load
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Since we are filtering on server side, we just return events
  const filteredEvents = useMemo(() => events, [events]);

  // Handle View Event
  const handleViewEvent = useCallback(async (eventId) => {
    setEventDetailLoading(true);
    try {
      const result = await eventService.getById(eventId);
      setSelectedEvent(result.data);
      setViewModalOpen(true);
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || "Failed to load event details",
        "error"
      );
    } finally {
      setEventDetailLoading(false);
    }
  }, []);

  // Handle Approve Event
  const handleApproveClick = useCallback((eventId) => {
    setApproveEventId(eventId);
    setApproveModalOpen(true);
  }, []);

  const handleApproveConfirm = useCallback(async () => {
    if (!approveEventId) return;

    setApproveLoading(true);
    try {
      await eventService.approve(approveEventId);
      showSnackbar("Event approved successfully", "success");
      setApproveModalOpen(false);
      setViewModalOpen(false);
      setApproveEventId(null);
      fetchEvents();
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || "Failed to approve event",
        "error"
      );
    } finally {
      setApproveLoading(false);
    }
  }, [approveEventId, fetchEvents]);

  // Handle Reject Event
  const handleRejectClick = useCallback((eventId) => {
    setRejectEventId(eventId);
    setRejectModalOpen(true);
  }, []);

  const handleRejectConfirm = useCallback(
    async (reason) => {
      if (!rejectEventId) return;

      setRejectLoading(true);
      try {
        await eventService.reject(rejectEventId, reason);
        showSnackbar("Event rejected successfully", "success");
        setRejectModalOpen(false);
        setViewModalOpen(false);
        setRejectEventId(null);
        fetchEvents();
      } catch (err) {
        showSnackbar(
          err.response?.data?.message || "Failed to reject event",
          "error"
        );
      } finally {
        setRejectLoading(false);
      }
    },
    [rejectEventId, fetchEvents]
  );

  // Handle Delete Event
  const handleDeleteEvent = useCallback(async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await eventService.delete(eventId);
      showSnackbar("Event deleted successfully", "success");
      fetchEvents();
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || "Failed to delete event",
        "error"
      );
    }
  }, [fetchEvents]);

  // Snackbar Handler
  const showSnackbar = (message, type = "success") => {
    setSnackbar({ open: true, message, type });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return {
    events: filteredEvents,
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
    approveEventId,
    approveLoading,
    rejectModalOpen,
    rejectEventId,
    rejectLoading,
    snackbar,
    setActiveTab,
    setSelectedCategory,
    setSearchTerm,
    setError,
    setViewModalOpen,
    fetchEvents,
    handleViewEvent,
    handleApproveClick,
    handleApproveConfirm,
    handleRejectClick,
    handleRejectConfirm,
    handleDeleteEvent,
    handleSnackbarClose,
    setApproveModalOpen,
    setRejectModalOpen,
  };
};
