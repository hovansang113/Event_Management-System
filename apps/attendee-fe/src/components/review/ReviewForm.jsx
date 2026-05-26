import { useState } from "react";
import {
  Box,
  Button,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { eventService } from "../../services/eventService";

export default function ReviewForm({ eventId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await eventService.submitReview(eventId, { rating, comment: comment || null });
      setRating(0);
      setComment("");
      if (onReviewSubmitted) onReviewSubmitted(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
      <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#111827", mb: 1.5 }}>
        Write a Review
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
        <Rating
          value={rating}
          onChange={(_, v) => { setRating(v); setError(""); }}
          size="large"
          sx={{ color: "#FFC107" }}
        />
        <Typography sx={{ fontSize: 13, color: "#6B7280" }}>
          {rating === 0 ? "Select rating" : `${rating}/5`}
        </Typography>
      </Box>

      <TextField
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience (optional, max 300 characters)"
        multiline
        rows={3}
        inputProps={{ maxLength: 300 }}
        fullWidth
        size="small"
        sx={{
          mb: 1,
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            bgcolor: "#F9FAFB",
            fontSize: 14,
          },
        }}
      />
      <Typography sx={{ fontSize: 11, color: "#9CA3AF", textAlign: "right", mb: 1.5 }}>
        {comment.length}/300
      </Typography>

      {error && (
        <Typography sx={{ fontSize: 13, color: "#DC2626", mb: 1.5 }}>
          {error}
        </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        disabled={submitting || rating === 0}
        sx={{
          textTransform: "none",
          fontWeight: 700,
          borderRadius: "8px",
          bgcolor: "#007BFF",
          "&:hover": { bgcolor: "#0056B3" },
        }}
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </Button>
    </Box>
  );
}
