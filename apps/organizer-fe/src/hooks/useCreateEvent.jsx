import { useState, useEffect } from "react";
import { eventService } from "../services/eventService";
import api from "../../../../packages/shared-ui/src/services/api";

export const useCreateEvent = (onSuccess) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    location: "",
    event_date: "",
    event_time: "",
    capacity: "",
    image: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        const cats = Array.isArray(res.data?.data) ? res.data.data : [];
        setCategories(cats.filter(c => c.is_active && !c.deleted_at));
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("Image size must be less than 10MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    setError(null);

    try {
      const submitData = { ...formData, status: "draft" };
      if (imageFile) {
        submitData.image = imageFile;
      }
      await eventService.create(submitData);
      resetForm();
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save draft");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    setLoading(true);
    setError(null);

    try {
      const submitData = { ...formData, status: "pending" };
      if (imageFile) {
        submitData.image = imageFile;
      }
      await eventService.create(submitData);
      resetForm();
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit for review");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category_id: "",
      location: "",
      event_date: "",
      event_time: "",
      capacity: "",
      image: "",
    });
    setImageFile(null);
    setImagePreview(null);
    setError(null);
  };

  return {
    formData,
    loading,
    error,
    categories,
    imageFile,
    imagePreview,
    handleChange,
    handleImageChange,
    handleSaveDraft,
    handleSubmitReview,
    resetForm,
  };
};
