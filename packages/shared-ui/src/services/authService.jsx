import api from "./api";
import { API_ENDPOINTS } from "../constants/api";
import { STORAGE_KEYS } from "../constants/storage";

export const authService = {
    register: async (data) => {
        const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data);   
        return response.data
    },

    login: async (data) => {
        const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, data);
        return response.data
    },

    getMe: async () => {
        const response = await api.get(API_ENDPOINTS.AUTH.ME);
        return response.data
    },

    logout: () => {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
    }
}
