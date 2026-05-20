import { useState, useEffect } from "react";
import { eventService } from "../services/eventService";
import api from "../../../../packages/shared-ui/src/services/api";

export const useCreateEvent = (onSuccess, eventId = null) => {  // ← Thêm eventId param
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
    if (eventId) {
      const fetchEvent = async () => {
        try {
          const res = await eventService.getDetail(eventId);
          const event = res.data;
          setFormData({
            title: event.title || "",
            description: event.description || "",
            category_id: event.category_id || "",
            location: event.location || "",
            event_date: event.event_date || "",
            event_time: event.event_time || "",
            capacity: event.capacity || "",
            image: event.image || "",
          });
          if (event.image) {
            setImagePreview(event.image);
          }
        } catch {
          setError("Failed to load event data");
        }
      };
      fetchEvent();
    }
  }, [eventId]);

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

  // ← THÊM: Handle Update
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    try {
      const submitData = { ...formData };
      if (imageFile) {
        submitData.image = imageFile;
      }
      await eventService.update(eventId, submitData);
      resetForm();
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update event");
    } finally {
      setLoading(false);
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
    handleUpdate,  // ← THÊM
    resetForm,
  };
};
