import { Box, IconButton, Typography } from "@mui/material";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";

export default function EventsResultsToolbar({ count, viewMode, onViewModeChange }) {
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        border: "1px solid #E0E0E0",
        borderRadius: "12px",
        p: "16px",
        mb: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#333333" }}>{count} Events Found</Typography>
        <Typography sx={{ fontSize: 14, color: "#666666" }}>Browse and register for upcoming events</Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        <IconButton
          onClick={() => onViewModeChange("grid")}
          sx={{
            width: 34,
            height: 34,
            borderRadius: "8px",
            p: "8px",
            bgcolor: viewMode === "grid" ? "#007BFF" : "#fff",
            color: viewMode === "grid" ? "#fff" : "#666666",
            border: viewMode === "grid" ? "none" : "1px solid #E0E0E0",
            boxShadow: viewMode === "grid" ? "0 6px 16px rgba(0,123,255,0.35)" : "none",
            "&:hover": { bgcolor: viewMode === "grid" ? "#0056B3" : "#F8F9FA" },
          }}
        >
          <GridViewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <IconButton
          onClick={() => onViewModeChange("list")}
          sx={{
            width: 34,
            height: 34,
            borderRadius: "8px",
            p: "8px",
            bgcolor: viewMode === "list" ? "#007BFF" : "#fff",
            color: viewMode === "list" ? "#fff" : "#666666",
            border: viewMode === "list" ? "none" : "1px solid #E0E0E0",
            boxShadow: viewMode === "list" ? "0 6px 16px rgba(0,123,255,0.35)" : "none",
            "&:hover": { bgcolor: viewMode === "list" ? "#0056B3" : "#F8F9FA" },
          }}
        >
          <ViewListRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Box>
  );
}
