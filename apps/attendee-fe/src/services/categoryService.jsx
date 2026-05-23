import api from "../../../../packages/shared-ui/src/services/api";
import { API_ENDPOINTS } from "../contracts/api";

let categoryCache = null;

export const categoryService = {
  getAll: async () => {
    if (categoryCache) return categoryCache;

    const response = await api.get(API_ENDPOINTS.ATTENDEE.CATEGORIES.ALL);
    categoryCache = response.data;
    return response.data;
  },

  peekAll: () => {
    return categoryCache;
  },
};
