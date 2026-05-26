import { useState, useEffect, useCallback, useRef } from "react";
import { eventService } from "../services/eventService";

const ALL_STATUSES = ["All", "Draft", "Pending", "Published", "Rejected", "Cancelled"];

const normalizeEvents = (payload) => {
    if (Array.isArray(payload?.data?.data)) return payload.data.data;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload)) return payload;
    return [];
};

export const useDashboard = () => {
    const cache = useRef({});
    const prefetchedRef = useRef(false);

    const [stats, setStats] = useState({
        total_events: 0,
        published_count: 0,
        total_attendees: 0,
        upcoming_events: 0
    });
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState("All");
    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);
    const [refreshKey, setRefreshKey] = useState(0);

    // Prefetch tất cả tabs ngầm sau khi tab đầu load xong
    const prefetchAllTabs = useCallback(async (currentSort) => {
        if (prefetchedRef.current) return;
        prefetchedRef.current = true;

        const otherStatuses = ALL_STATUSES.filter(s => s !== "All");
        for (const s of otherStatuses) {
            const key = `${s}__${currentSort}__1`;
            if (!cache.current[key]) {
                try {
                    const res = await eventService.getEvents({ status: s, sort: currentSort, page: 1 });
                    cache.current[key] = normalizeEvents(res);
                } catch (_) {}
            }
        }
    }, []);

    useEffect(() => {
        let cancelled = false;
        const loadStats = async () => {
            try {
                const res = await eventService.getStats();
                if (!cancelled) setStats(res.data);
            } catch (err) {
                if (!cancelled) setError(err.response?.data?.message || "Failed to fetch stats");
            }
        };
        loadStats();
        return () => { cancelled = true; };
    }, [refreshKey]);

    useEffect(() => {
        let cancelled = false;
        const cacheKey = `${status}__${sort}__${page}`;

        if (cache.current[cacheKey]) {
            setEvents(cache.current[cacheKey]);
            setLoading(false);
        } else {
            setLoading(true);
        }

        const loadEvents = async () => {
            try {
                const res = await eventService.getEvents({ status, sort, page });
                const data = normalizeEvents(res);
                cache.current[cacheKey] = data;
                if (!cancelled) {
                    setEvents(data);
                    // Sau khi load tab "All" xong, prefetch các tab còn lại
                    if (status === "All") {
                        prefetchAllTabs(sort);
                    }
                }
            } catch (err) {
                if (!cancelled) setError(err.response?.data?.message || "Failed to fetch events");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadEvents();
        return () => { cancelled = true; };
    }, [status, sort, page, refreshKey, prefetchAllTabs]);

    const handleFilterChange = useCallback((newFilters) => {
        if (newFilters.status !== undefined) setStatus(newFilters.status);
        if (newFilters.sort !== undefined) setSort(newFilters.sort);
        setPage(1);
    }, []);

    const handlePageChange = useCallback((_, value) => {
        setPage(value);
    }, []);

    const fetchStats = useCallback(async () => {
        try {
            const res = await eventService.getStats();
            setStats(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch stats");
        }
    }, []);

    const fetchEvents = useCallback(() => {
        cache.current = {};
        prefetchedRef.current = false;
        setRefreshKey(k => k + 1);
    }, []);

    return {
        stats,
        events,
        loading,
        error,
        filters: { status, sort, page },
        handleFilterChange,
        handlePageChange,
        fetchStats,
        fetchEvents,
    };
};
