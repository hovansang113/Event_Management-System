import axios from 'axios';
import { CLOUDINARY_CONFIG } from '../constants/cloudinary';

export const upLoadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

    const res = await axios.post(CLOUDINARY_CONFIG.uploadUrl(CLOUDINARY_CONFIG.cloudName), formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    return res.data.secure_url;
}