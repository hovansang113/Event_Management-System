import api from "../../../../packages/shared-ui/src/services/api";
import { API_ENDPOINTS } from "../contracts/api";

export const categoryService = {
  getAll: async () => {
    const response = await api.get(API_ENDPOINTS.ATTENDEE.CATEGORIES.ALL);
    return response.data;
  },
};
