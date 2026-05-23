import api from "../../../../packages/shared-ui/src/services/api";
import { API_ENDPOINTS } from "../contracts/api";

export const eventService = {
  getAll: async (filters = {}) => {
    const response = await api.get(API_ENDPOINTS.ATTENDEE.EVENTS.ALL, { params: filters });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(API_ENDPOINTS.ATTENDEE.EVENTS.GET(id));
    return response.data;
  },
};
