import api from "../../../../packages/shared-ui/src/services/api";
import { API_ENDPOINTS } from "../constants/api";

const cache = new Map();

export const dashboardService = {
    getStats: async () => {
        if (cache.has('stats')) return cache.get('stats');
        const response = await api.get(API_ENDPOINTS.ADMIN.DASHBOARD.STATS);
        cache.set('stats', response.data);
        return response.data;
    },

    getOverview: async () => {
        if (cache.has('overview')) return cache.get('overview');
        const response = await api.get(API_ENDPOINTS.ADMIN.DASHBOARD.OVERVIEW);
        cache.set('overview', response.data);
        return response.data;
    },

    clearCache: () => {
        cache.clear();
    }
};
