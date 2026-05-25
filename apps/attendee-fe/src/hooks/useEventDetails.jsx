import { useState, useEffect, useMemo } from 'react';
import { eventService } from '../services/eventService';

export const useEventDetails = (eventId, initialEvent = null) => {
  const [event, setEvent] = useState(() => initialEvent || eventService.peekById(eventId)?.data || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) {
        setEvent(null);
        setError("Missing event ID");
        return;
      }

      try {
        setError(null);
        const eventResult = await eventService.getById(eventId);
        setEvent(eventResult.data);
      } catch {
        setEvent(null);
        setError("Cannot load event detail");
      }
    };

    loadEvent();
  }, [eventId]);

  const eventStats = useMemo(() => {
    if (!event) {
      return {
        capacity: 0,
        registered: 0,
        available: 0,
        progress: 0,
        rating: "0.0",
        reviews: 0,
        waitlistCount: 0,
      };
    }

    const capacity = Number(event.capacity || 0);
    const registered = Number(event.confirmed_count || event.registered || 0);
    const available = Math.max(0, capacity - registered);

    return {
      capacity,
      registered,
      available,
      progress: capacity > 0 ? Math.min(100, Math.round((registered / capacity) * 100)) : 0,
      rating: Number(event.rating || 0).toFixed(1),
      reviews: Number(event.reviews || 0),
      waitlistCount: Number(event.waitlist_count || 0),
    };
  }, [event]);

  return {
    event,
    error,
    eventStats,
  };
};
