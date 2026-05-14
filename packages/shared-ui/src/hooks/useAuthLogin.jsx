import {useState} from 'react';
import { authService } from '../services/authService';
import { STORAGE_KEYS } from '../constants/storage';

export const useAuthLogin = (role, onSuccess) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try{
            const result = await authService.login({ ...formData, role });
            
            // Save to localStorage
            if (result.data?.access_token) {
                localStorage.setItem(STORAGE_KEYS.TOKEN, result.data.access_token);
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.data.user));
            }

            onSuccess?.(result);
            
        }catch(err){
            setError(err.response?.data?.message || "Đăng nhập thất bại");
        }finally{
            setLoading(false);
        }
    }

    return {
        formData,
        handleChange,
        handleSubmit,
        loading,
        error
    };
}
