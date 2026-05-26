import api from "../../../../packages/shared-ui/src/services/api";
import { API_ENDPOINTS } from "../constants/api";

const cache = new Map();

export const eventService = {
    getAll: async (filters = {}) => {
        const key = `all_${JSON.stringify(filters)}`;
        if (cache.has(key)) return cache.get(key);
        
        const response = await api.get(API_ENDPOINTS.ADMIN.EVENTS.ALL, { 
            params: filters 
        });
        cache.set(key, response.data);
        return response.data;
    },

    getById: async (id) => {
        const key = `detail_${id}`;
        if (cache.has(key)) return cache.get(key);

        const response = await api.get(API_ENDPOINTS.ADMIN.EVENTS.GET(id));
        cache.set(key, response.data);
        return response.data;
    },

    approve: async (id) => {
        const response = await api.patch(API_ENDPOINTS.ADMIN.EVENTS.APPROVE(id));
        cache.clear(); // Xóa cache khi có thay đổi dữ liệu
        return response.data;
    },

    reject: async (id, reason) => {
        const response = await api.patch(
            API_ENDPOINTS.ADMIN.EVENTS.REJECT(id),
            { rejection_reason: reason }
        );
        cache.clear();
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(API_ENDPOINTS.ADMIN.EVENTS.DELETE(id));
        cache.clear();
        return response.data;
    },

    getAuditLog: async (filters = {}) => {
        const response = await api.get(API_ENDPOINTS.ADMIN.EVENTS.AUDIT_LOG, {
            params: filters
        });
        return response.data;
    },

    clearCache: () => {
        cache.clear();
    }
};
