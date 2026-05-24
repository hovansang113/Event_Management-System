import { memo, useState } from "react";
import { Box, Button, Card, CardContent, CardMedia, Chip, LinearProgress, Typography } from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { useNavigate } from "react-router-dom";

const DEFAULT_IMAGE = "https://via.placeholder.com/600x400?text=Event+Image";

const progressColor = (ratio) => {
  if (ratio > 0.3) return "#28A745";
  if (ratio > 0.1) return "#FFC107";
  return "#DC3545";
};

const BrowseEventCard = memo(({ event, viewMode = "grid" }) => {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState(event.image || DEFAULT_IMAGE);
  
  const handleImgError = () => {
    if (imgSrc !== DEFAULT_IMAGE) {
      setImgSrc(DEFAULT_IMAGE);
    }
  };

  const safeCapacity = event.capacity > 0 ? event.capacity : 1;
  const remainRatio = Math.max(0, (safeCapacity - event.registered) / safeCapacity);
  const fill = Math.min(100, Math.round((event.registered / safeCapacity) * 100));
  const full = event.registered >= safeCapacity;
  const goToDetail = () => navigate(`/events/${event.id}`, { state: { event } });

  if (viewMode === "list") {
    return (
      <Card onClick={goToDetail} sx={{ bgcolor: "#fff", border: "1px solid #E0E0E0", borderRadius: "12px", p: { xs: 1.5, sm: 2 }, boxShadow: "none", cursor: "pointer", transition: "box-shadow 300ms", "&:hover": { boxShadow: "0 18px 30px rgba(16,24,40,0.16)" } }}>
        <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", md: "row" } }}>
          <CardMedia 
            component="img" 
            image={imgSrc} 
            onError={handleImgError}
            loading="lazy"
            alt={event.title} 
            sx={{ width: { xs: "100%", md: 192 }, height: { xs: 180, md: 128 }, borderRadius: "8px", objectFit: "cover" }} 
          />
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#333333" }}>{event.title}</Typography>
            <Typography sx={{ fontSize: 12, color: "#666666", mb: 1.2 }}>by {event.author}</Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", color: "#666666", fontSize: 14 }}>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.8 }}><CalendarMonthOutlinedIcon sx={{ fontSize: 14, color: "#007BFF" }} />{event.dateLabel}</Box>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.8 }}><PlaceOutlinedIcon sx={{ fontSize: 14, color: "#007BFF" }} />{event.location}</Box>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}><StarRoundedIcon sx={{ fontSize: 14, color: "#FFC107" }} />{event.rating.toFixed(1)} ({event.reviews})</Box>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}><GroupOutlinedIcon sx={{ fontSize: 14, color: "#007BFF" }} />{event.registered} / {event.capacity}</Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1, mt: 1.5, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
              <Button variant="outlined" onClick={goToDetail} sx={{ textTransform: "none", borderRadius: "8px" }}>View</Button>
              <Button disabled={full} variant="contained" onClick={(event) => event.stopPropagation()} sx={{ textTransform: "none", borderRadius: "8px", bgcolor: "#007BFF", "&:hover": { bgcolor: "#0056B3" }, "&.Mui-disabled": { bgcolor: "#eef2f7", color: "#9CA3AF" } }}>
                {full ? "Full" : "Register"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        bgcolor: "#fff",
        border: "1px solid #E0E0E0",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "none",
        transition: "transform 300ms ease, box-shadow 300ms ease",
        "&:hover": { transform: "translateY(-8px)", boxShadow: "0 22px 36px rgba(16,24,40,0.18)" },
        "&:hover .event-media": { transform: "scale(1.10)" },
        "&:hover .event-overlay": { opacity: 1 },
        cursor: "pointer",
      }}
      onClick={goToDetail}
    >
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <CardMedia 
          className="event-media" 
          component="img" 
          image={imgSrc} 
          onError={handleImgError}
          loading="lazy"
          alt={event.title} 
          sx={{ height: { xs: 180, sm: 192 }, objectFit: "cover", transition: "transform 300ms ease" }} 
        />
        <Box className="event-overlay" sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0))", opacity: 0, transition: "opacity 300ms ease" }} />
        <Chip label={event.category} size="small" sx={{ position: "absolute", top: 12, left: 12, bgcolor: "#dbeafe", color: "#007BFF", fontSize: 12 }} />
      </Box>

      <CardContent sx={{ p: 2 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#333333", lineHeight: 1.35, mb: 0.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", "&:hover": { color: "#007BFF" } }}>
          {event.title}
        </Typography>
        <Typography sx={{ fontSize: 12, color: "#666666", mb: 1.5 }}>by {event.author}</Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.9 }}>
          <CalendarMonthOutlinedIcon sx={{ fontSize: 14, color: "#007BFF" }} />
          <Typography sx={{ fontSize: 13, color: "#666666" }}>{event.dateLabel}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <PlaceOutlinedIcon sx={{ fontSize: 14, color: "#007BFF" }} />
          <Typography sx={{ fontSize: 13, color: "#666666" }}>{event.location}</Typography>
        </Box>

        <Box sx={{ borderBottom: "1px solid #E0E0E0", pb: 1.8, mb: 1.8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <StarRoundedIcon sx={{ fontSize: 16, color: "#FFC107" }} />
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#333333" }}>{event.rating.toFixed(1)}</Typography>
            <Typography sx={{ fontSize: 12, color: "#666666" }}>({event.reviews})</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <GroupOutlinedIcon sx={{ fontSize: 14, color: "#007BFF" }} />
            <Typography sx={{ fontSize: 13, color: "#666666" }}>{event.registered} / {event.capacity}</Typography>
          </Box>
        </Box>

        <LinearProgress variant="determinate" value={fill} sx={{ height: 6, borderRadius: "9999px", bgcolor: "#E0E0E0", mb: 2, "& .MuiLinearProgress-bar": { bgcolor: progressColor(remainRatio) } }} />

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" onClick={goToDetail} sx={{ flex: 1, textTransform: "none", borderRadius: "8px", borderColor: "#E0E0E0", color: "#333333" }}>View</Button>
          <Button disabled={full} variant="contained" onClick={(event) => event.stopPropagation()} sx={{ flex: 1, textTransform: "none", borderRadius: "8px", bgcolor: "#007BFF", "&:hover": { bgcolor: "#0056B3" }, "&.Mui-disabled": { bgcolor: "#eef2f7", color: "#9CA3AF" } }}>
            {full ? "Full" : "Register"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
});

export default BrowseEventCard;
