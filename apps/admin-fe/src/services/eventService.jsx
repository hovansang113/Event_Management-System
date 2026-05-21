import api from "../../../../packages/shared-ui/src/services/api";
import { API_ENDPOINTS } from "../constants/api";

export const eventService = {
    getAll: async (filters = {}) => {
        const response = await api.get(API_ENDPOINTS.ADMIN.EVENTS.ALL, { 
            params: filters 
        });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(API_ENDPOINTS.ADMIN.EVENTS.GET(id));
        return response.data;
    },

    approve: async (id) => {
        const response = await api.patch(API_ENDPOINTS.ADMIN.EVENTS.APPROVE(id));
        return response.data;
    },

    reject: async (id, reason) => {
        const response = await api.patch(
            API_ENDPOINTS.ADMIN.EVENTS.REJECT(id),
            { rejection_reason: reason }
        );
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(API_ENDPOINTS.ADMIN.EVENTS.DELETE(id));
        return response.data;
    },

    getAuditLog: async (filters = {}) => {
        const response = await api.get(API_ENDPOINTS.ADMIN.EVENTS.AUDIT_LOG, {
            params: filters
        });
        return response.data;
    }
};
