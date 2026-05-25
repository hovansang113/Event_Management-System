import api from "../../../../packages/shared-ui/src/services/api";
import { API_ENDPOINTS } from "../constants/api";

export const eventService = {
    getStats: async () => {
        const response = await api.get(API_ENDPOINTS.ORGANIZER.DASHBOARD.STATS);
        return response.data;
    },

    getEvents: async (params) => {
        const response = await api.get(API_ENDPOINTS.ORGANIZER.EVENTS.LIST, { params });
        return response.data;
    },

    getDetail: async (id) => {
        const response = await api.get(API_ENDPOINTS.ORGANIZER.EVENTS.DETAIL(id));
        return response.data;
    },

    create: async (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
                formData.append(key, data[key]);
            }
        });
        const response = await api.post(API_ENDPOINTS.ORGANIZER.EVENTS.CREATE, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    submit: async (id) => {
        const response = await api.patch(API_ENDPOINTS.ORGANIZER.EVENTS.SUBMIT(id));
        return response.data;
    },

    update: async (id, data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
                formData.append(key, data[key]);
            }
        });
        
        // Laravel workaround: PHP cannot parse multipart/form-data on PUT requests.
        // We use POST and add _method: PUT to fake it.
        formData.append('_method', 'PUT');

        const response = await api.post(API_ENDPOINTS.ORGANIZER.EVENTS.UPDATE(id), formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    cancel: async (id, reason) => {
        const response = await api.patch(API_ENDPOINTS.ORGANIZER.EVENTS.CANCEL(id), {
            cancellation_reason: reason
        });
        return response.data;
    }

    
};
