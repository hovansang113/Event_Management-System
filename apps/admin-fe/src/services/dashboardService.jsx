import api from "../../../../packages/shared-ui/src/services/api";
import { API_ENDPOINTS } from "../constants/api";

export const dashboardService = {
    getStats: async () => {
        const response = await api.get(API_ENDPOINTS.ADMIN.DASHBOARD.STATS);
        return response.data;
    },

    getOverview: async () => {
        const response = await api.get(API_ENDPOINTS.ADMIN.DASHBOARD.OVERVIEW);
        return response.data;
    },
};
