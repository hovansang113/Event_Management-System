import { useState, useEffect, useMemo } from 'react';
import { eventService } from '../services/eventService';

export const useEventDetails = (eventId) => {
  const [event, setEvent] = useState(null);
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
        rating: "0.0",
        reviews: 0,
      };
    }

    const capacity = Number(event.capacity || 0);
    const registered = Number(event.registered || 0);

    return {
      capacity,
      registered,
      available: Math.max(0, capacity - registered),
      rating: Number(event.rating || 0).toFixed(1),
      reviews: Number(event.reviews || 0),
    };
  }, [event]);

  return {
    event,
    error,
    eventStats,
  };
};