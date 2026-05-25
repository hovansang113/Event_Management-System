import api from "../../../../packages/shared-ui/src/services/api";
import { API_ENDPOINTS } from "../contracts/api";

const listCache = new Map();
const detailCache = new Map();

const getFilterKey = (filters = {}) => {
  const sorted = Object.keys(filters)
    .sort()
    .reduce((acc, key) => ({ ...acc, [key]: filters[key] }), {});
  return JSON.stringify(sorted);
};

export const eventService = {
  getAll: async (filters = {}) => {
    const response = await api.get(API_ENDPOINTS.ATTENDEE.EVENTS.ALL, { params: filters });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(API_ENDPOINTS.ATTENDEE.EVENTS.GET(id));
    return response.data;
  },

  peekAll: (filters = {}) => {
    return listCache.get(getFilterKey(filters)) || null;
  },

  peekById: (id) => {
    return detailCache.get(String(id)) || null;
  },

  seedDetail: (event) => {
    if (!event?.id) return;
    detailCache.set(String(event.id), { data: event });
  },

  register: async (id) => {
    return await api.post(API_ENDPOINTS.ATTENDEE.EVENTS.REGISTER(id));
  },

  getMyRegistrations: async () => {
    const response = await api.get(API_ENDPOINTS.ATTENDEE.EVENTS.REGISTRATIONS);
    return response.data;
  },

  cancel: async (registrationId) => {
    return await api.delete(API_ENDPOINTS.ATTENDEE.EVENTS.CANCEL(registrationId));
  },
};
