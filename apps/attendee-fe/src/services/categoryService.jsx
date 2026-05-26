import api from "../../../../packages/shared-ui/src/services/api";
import { API_ENDPOINTS } from "../contracts/api";

const CACHE_TTL = 5 * 60 * 1000;

let categoryCache = { data: null, timestamp: null };

export const categoryService = {
  getAll: async () => {
    if (categoryCache.data && categoryCache.timestamp && (Date.now() - categoryCache.timestamp < CACHE_TTL)) {
      return categoryCache.data;
    }

    const response = await api.get(API_ENDPOINTS.ATTENDEE.CATEGORIES.ALL);
    categoryCache = { data: response.data, timestamp: Date.now() };
    return response.data;
  },

  peekAll: () => {
    if (categoryCache.data && categoryCache.timestamp && (Date.now() - categoryCache.timestamp < CACHE_TTL)) {
      return categoryCache.data;
    }
    return null;
  },
};
