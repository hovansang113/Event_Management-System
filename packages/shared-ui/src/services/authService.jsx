import api from "./api";
import { API_ENDPOINTS } from "../constants/api";

export const authService = {
    register: async (data) => {
        const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data);
        return response.data
    }
}
