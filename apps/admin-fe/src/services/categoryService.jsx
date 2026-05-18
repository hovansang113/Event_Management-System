import api from "../../../../packages/shared-ui/src/services/api";
import { API_ENDPOINTS } from "../constants/api";

export const categoryService = {
    add: async (data) => {
        const response = await api.post(API_ENDPOINTS.ADMIN.CATEGORIES.ADD, data);
        return response.data;
    },

    getAll: async () => {
        const response = await api.get(API_ENDPOINTS.ADMIN.CATEGORIES.ALL);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(API_ENDPOINTS.ADMIN.CATEGORIES.UPDATE(id), data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(API_ENDPOINTS.ADMIN.CATEGORIES.DELETE(id));
        return response.data;
    },

    restore: async (id) => {
        const response = await api.post(API_ENDPOINTS.ADMIN.CATEGORIES.RESTORE(id));
        return response.data;
    },

    activate: async (id) => {
        const response = await api.patch(API_ENDPOINTS.ADMIN.CATEGORIES.ACTIVATE(id));
        return response.data;
    },

    deactivate: async (id) => {
        const response = await api.patch(API_ENDPOINTS.ADMIN.CATEGORIES.DEACTIVATE(id));
        return response.data;
    }
};
