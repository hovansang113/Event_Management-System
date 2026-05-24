import api from "../../../../packages/shared-ui/src/services/api";
import { API_ENDPOINTS } from "../constants/api";

const cache = {
    data: null,
    timestamp: 0
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const categoryService = {
    add: async (data) => {
        const response = await api.post(API_ENDPOINTS.ADMIN.CATEGORIES.ADD, data);
        cache.data = null; // Invalidate cache
        return response.data;
    },

    getAll: async () => {
        const now = Date.now();
        if (cache.data && (now - cache.timestamp < CACHE_DURATION)) {
            return cache.data;
        }
        
        const response = await api.get(API_ENDPOINTS.ADMIN.CATEGORIES.ALL);
        cache.data = response.data;
        cache.timestamp = now;
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(API_ENDPOINTS.ADMIN.CATEGORIES.UPDATE(id), data);
        cache.data = null;
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(API_ENDPOINTS.ADMIN.CATEGORIES.DELETE(id));
        cache.data = null;
        return response.data;
    },

    restore: async (id) => {
        const response = await api.post(API_ENDPOINTS.ADMIN.CATEGORIES.RESTORE(id));
        cache.data = null;
        return response.data;
    },

    activate: async (id) => {
        const response = await api.patch(API_ENDPOINTS.ADMIN.CATEGORIES.ACTIVATE(id));
        cache.data = null;
        return response.data;
    },

    deactivate: async (id) => {
        const response = await api.patch(API_ENDPOINTS.ADMIN.CATEGORIES.DEACTIVATE(id));
        cache.data = null;
        return response.data;
    },

    clearCache: () => {
        cache.data = null;
        cache.timestamp = 0;
    }
};
