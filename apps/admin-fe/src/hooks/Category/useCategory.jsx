import { useState, useEffect } from "react";
import { categoryService } from "../../services/categoryService";

export const useCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ name: "", icon: "", description: "", is_active: true });
    const [openForm, setOpenForm] = useState(false);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await categoryService.getAll();
            setCategories(Array.isArray(response.data) ? response.data : response);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleOpenAdd = () => {
        setFormData({ name: "", icon: "", description: "", is_active: true });
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
                response = await categoryService.update(formData.id, formData);
                setCategories((prev) => prev.map(cat => cat.id === formData.id ? response.data : cat));
            } else {
                response = await categoryService.add(formData);
                setCategories((prev) => [...prev, response.data]);
            }
            handleCloseForm();
        } catch (err) {
            setError(err.response?.data?.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await categoryService.delete(id);
            setCategories((prev) => prev.map(cat => cat.id === id ? { ...cat, deleted_at: new Date().toISOString() } : cat));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete category");
        }
    };

    const handleRestore = async (id) => {
        try {
            await categoryService.restore(id);
            setCategories((prev) => prev.map(cat => cat.id === id ? { ...cat, deleted_at: null } : cat));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to restore category");
        }
    };

    const handleToggleStatus = async (category) => {
        const originalStatus = category.is_active;
        setCategories((prev) => 
            prev.map(cat => cat.id === category.id ? { ...cat, is_active: !originalStatus } : cat)
        );

        try {
            let response;
            if (originalStatus) {
                response = await categoryService.deactivate(category.id);
            } else {
                response = await categoryService.activate(category.id);
            }
            setCategories((prev) => 
                prev.map(cat => cat.id === category.id ? response.data : cat)
            );
        } catch (err) {
            setCategories((prev) => 
                prev.map(cat => cat.id === category.id ? { ...cat, is_active: originalStatus } : cat)
            );
            setError(err.response?.data?.message || "Failed to update status");
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
        handleRestore,
        handleToggleStatus,
        fetchCategories
    };
};
