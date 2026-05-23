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
    const key = getFilterKey(filters);
    if (listCache.has(key)) return listCache.get(key);

    const response = await api.get(API_ENDPOINTS.ATTENDEE.EVENTS.ALL, { params: filters });
    listCache.set(key, response.data);
    return response.data;
  },

  getById: async (id) => {
    if (detailCache.has(String(id))) return detailCache.get(String(id));

    const response = await api.get(API_ENDPOINTS.ATTENDEE.EVENTS.GET(id));
    detailCache.set(String(id), response.data);
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
};
