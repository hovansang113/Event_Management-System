import { useState, useEffect } from "react";
import { categoryService } from "../../services/categoryService";

export const useCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ name: "", icon: "", description: "" });
    const [openForm, setOpenForm] = useState(false);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await categoryService.getAll();
            setCategories(Array.isArray(response.data) ? response.data : response);
        } catch (err) {
            setError(err.response?.data?.message || "Lấy danh sách danh mục thất bại");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleOpenAdd = () => {
        setFormData({ name: "", icon: "", description: "" });
        setOpenForm(true);
        setError(null);
    };

    const handleOpenEdit = (category) => {
        setFormData(category);
        setOpenForm(true);
        setError(null);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            let response;
            if (formData.id) {
                // Update
                response = await categoryService.update(formData.id, formData);
                setCategories((prev) => prev.map(cat => cat.id === formData.id ? response.data : cat));
            } else {
                // Add new
                response = await categoryService.add(formData);
                setCategories((prev) => [...prev, response.data]);
            }
            handleCloseForm();
        } catch (err) {
            setError(err.response?.data?.message || "Thao tác thất bại");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
        try {
            await categoryService.delete(id);
            setCategories((prev) => prev.filter(cat => cat.id !== id));
        } catch (err) {
            setError(err.response?.data?.message || "Xóa danh mục thất bại");
        }
    };

    return {
        categories,
        loading,
        error,
        formData,
        openForm,
        handleChange,
        handleOpenAdd,
        handleOpenEdit,
        handleCloseForm,
        handleSubmit,
        handleDelete,
        fetchCategories
    };
};
