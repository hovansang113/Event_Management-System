import { useState, useEffect } from "react";
import { eventService } from "../services/eventService";
import api from "../../../../packages/shared-ui/src/services/api";
import { upLoadImage } from "../services/cloudinaryService";

// Simple global cache for categories
let categoriesCache = null;

export const useCreateEvent = (onSuccess, eventId = null) => {
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // Trạng thái tải dữ liệu chi tiết
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false); // Trạng thái phân biệt giữa tạo mới và cập nhật
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    location: "",
    event_date: "",
    event_time: "",
    capacity: "",
    image: "",
    status: "",
  });

  useEffect(() => {
    if (eventId) {
      const fetchEvent = async () => {
        setIsFetching(true);
        try {
          const res = await eventService.getDetail(eventId);
          const event = res.data;
          setFormData({
            title: event.title || "",
            description: event.description || "",
            category_id: event.category?.id || event.category_id || "",
            location: event.location || "",
            event_date: event.date || event.event_date || "", // Sửa mapping date
            event_time: event.time || event.event_time || "", // Sửa mapping time
            capacity: event.capacity || "",
            image: event.image || "",
            status: event.status || "",
          });
          if (event.image) {
            setImagePreview(event.image);
          }
        } catch (err) {
          setError("Failed to load event data");
          console.error(err);
        } finally {
          setIsFetching(false);
        }
      };
      fetchEvent();
    }
  }, [eventId]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (categoriesCache) {
        setCategories(categoriesCache);
        return;
      }
      try {
        const res = await api.get("/categories");
        const cats = Array.isArray(res.data?.data) ? res.data.data : [];
        const filteredCats = cats.filter(c => c.is_active && !c.deleted_at);
        categoriesCache = filteredCats;
        setCategories(filteredCats);
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

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: "" }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    try {
      let imageUrl = formData.image;
      if (imageFile) {
        imageUrl = await upLoadImage(imageFile);
      }

      const submitData = { 
        ...formData, 
        image: imageUrl 
      };

      await eventService.update(eventId, submitData);
      resetForm();
      onSuccess?.();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update event";
      const validationErrors = err.response?.data?.errors;
      setError(validationErrors ? `${errorMsg}: ${Object.values(validationErrors).flat().join(", ")}` : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    setError(null);

    try {
      let imageUrl = formData.image;
      if (imageFile) {
        imageUrl = await upLoadImage(imageFile);
      }
      
      const submitData = { 
        ...formData, 
        image: imageUrl, 
        status: "draft" 
      };
      
      await eventService.create(submitData);
      resetForm();
      onSuccess?.();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to save draft";
      const validationErrors = err.response?.data?.errors;
      setError(validationErrors ? `${errorMsg}: ${Object.values(validationErrors).flat().join(", ")}` : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    setLoading(true);
    setError(null);

    try {
      let imageUrl = formData.image;
      if (imageFile) {
        imageUrl = await upLoadImage(imageFile);
      }

      const submitData = { 
        ...formData, 
        image: imageUrl, 
        status: "pending" 
      };

      await eventService.create(submitData);
      resetForm();
      onSuccess?.();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to submit for review";
      const validationErrors = err.response?.data?.errors;
      setError(validationErrors ? `${errorMsg}: ${Object.values(validationErrors).flat().join(", ")}` : errorMsg);
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
      status: "",
    });
    setImageFile(null);
    setImagePreview(null);
    setError(null);
  };

  return {
    formData,
    loading,
    isFetching, // Trả về thêm isFetching
    error,
    categories,
    imageFile,
    imagePreview,
    handleChange,
    handleImageChange,
    handleRemoveImage,
    handleSaveDraft,
    handleSubmitReview,
    handleUpdate,
    resetForm,
  };
};

