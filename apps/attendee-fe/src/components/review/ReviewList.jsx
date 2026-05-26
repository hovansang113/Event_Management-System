import { Box, Rating, Typography } from "@mui/material";

export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return (
      <Typography sx={{ fontSize: 14, color: "#9CA3AF", textAlign: "center", py: 4 }}>
        No reviews yet. Be the first to review!
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {reviews.map((review) => (
        <Box
          key={review.id}
          sx={{
            bgcolor: "#F9FAFB",
            borderRadius: "10px",
            p: 2,
            border: "1px solid #F3F4F6",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.8 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 14,
                color: "#111827",
              }}
            >
              {review.user?.name || "Anonymous"}
            </Typography>
            <Rating value={review.rating} readOnly size="small" sx={{ color: "#FFC107" }} />
            <Typography sx={{ fontSize: 11, color: "#9CA3AF", ml: "auto" }}>
              {new Date(review.created_at).toLocaleDateString("en-GB")}
            </Typography>
          </Box>
          {review.comment && (
            <Typography sx={{ fontSize: 13, color: "#4B5563", lineHeight: 1.5 }}>
              {review.comment}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
}
