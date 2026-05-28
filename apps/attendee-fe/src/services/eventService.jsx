import api from "../../../../packages/shared-ui/src/services/api";
import { API_ENDPOINTS } from "../contracts/api";

const CACHE_TTL = 5 * 60 * 1000;

const listCache = new Map();
const detailCache = new Map();
let registrationsCache = { data: null, timestamp: null };

const getFilterKey = (filters = {}) => {
  const sorted = Object.keys(filters)
    .sort()
    .reduce((acc, key) => ({ ...acc, [key]: filters[key] }), {});
  return JSON.stringify(sorted);
};

const isValid = (entry) => entry && entry.timestamp && (Date.now() - entry.timestamp < CACHE_TTL);

const setListCache = (key, data) => {
  listCache.set(key, { data, timestamp: Date.now() });
};

const setDetailCache = (id, data) => {
  detailCache.set(String(id), { data, timestamp: Date.now() });
};

export const eventService = {
  getAll: async (filters = {}) => {
    const key = getFilterKey(filters);
    const cached = listCache.get(key);
    if (isValid(cached)) return cached.data;

    const response = await api.get(API_ENDPOINTS.ATTENDEE.EVENTS.ALL, { params: filters });
    setListCache(key, response.data);
    return response.data;
  },

  getById: async (id) => {
    const key = String(id);
    const cached = detailCache.get(key);
    if (isValid(cached)) return cached.data;

    const response = await api.get(API_ENDPOINTS.ATTENDEE.EVENTS.GET(id));
    setDetailCache(key, response.data);
    return response.data;
  },

  getMyRegistrations: async () => {
    if (isValid(registrationsCache)) return registrationsCache.data;

    const response = await api.get(API_ENDPOINTS.ATTENDEE.EVENTS.REGISTRATIONS);
    registrationsCache = { data: response.data, timestamp: Date.now() };
    return response.data;
  },

  register: async (id) => {
    const response = await api.post(API_ENDPOINTS.ATTENDEE.EVENTS.REGISTER(id));
    // Clear all caches to ensure data consistency
    registrationsCache = { data: null, timestamp: null };
    listCache.clear();
    detailCache.clear();
    return response.data;
  },

  cancel: async (registrationId) => {
    const response = await api.delete(API_ENDPOINTS.ATTENDEE.EVENTS.CANCEL(registrationId));
    // Clear all caches to ensure data consistency
    registrationsCache = { data: null, timestamp: null };
    listCache.clear();
    detailCache.clear();
    return response.data;
  },

  peekAll: (filters = {}) => {
    const cached = listCache.get(getFilterKey(filters));
    return isValid(cached) ? cached.data : null;
  },

  peekById: (id) => {
    const cached = detailCache.get(String(id));
    return isValid(cached) ? cached.data : null;
  },

  getReviews: async (eventId, sort = 'newest') => {
    const response = await api.get(API_ENDPOINTS.ATTENDEE.REVIEWS.LIST(eventId), { params: { sort } });
    return response.data;
  },

  submitReview: async (eventId, data) => {
    const response = await api.post(API_ENDPOINTS.ATTENDEE.REVIEWS.CREATE(eventId), data);
    return response.data;
  },

  seedDetail: (event) => {
    if (!event?.id) return;
    setDetailCache(event.id, { success: true, data: event });
  },
};
