import {
  Box,
  Container,
  Typography,
  Card,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Stack,
  Avatar,
  Divider,
  Rating,
  TextField,
  LinearProgress,
  IconButton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useState, useEffect, useRef } from "react";
import { eventService } from "../services/eventService";
import { useAuth } from "@eventnextday/shared-ui";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import HistoryIcon from "@mui/icons-material/History";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { Link as RouterLink } from "react-router-dom";

const SidebarItem = ({ icon, label, active, count, onClick }) => (
  <Button
    onClick={onClick}
    fullWidth
    startIcon={icon}
    sx={{
      justifyContent: "space-between",
      px: 2,
      py: 1.2,
      borderRadius: "8px",
      textTransform: "none",
      color: active ? "#0F172A" : "#64748B",
      bgcolor: active ? "#FFFFFF" : "transparent",
      fontWeight: active ? 700 : 500,
      fontSize: "0.9rem",
      boxShadow: active ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
      border: active ? "1px solid #E2E8F0" : "1px solid transparent",
      "& .MuiButton-startIcon": { color: active ? "#007BFF" : "inherit" },
      "&:hover": { bgcolor: active ? "#FFFFFF" : "#F1F5F9", color: "#0F172A" },
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
      {label}
    </Box>
    {count > 0 && (
      <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: active ? "#007BFF" : "#94A3B8" }}>
        {count}
      </Typography>
    )}
  </Button>
);

const StatMini = ({ label, value }) => (
  <Box>
    <Typography sx={{ fontSize: "0.7rem", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px" }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A" }}>
      {value}
    </Typography>
  </Box>
);

const ratingLabels = {
  1: "Poor — Needs improvement",
  2: "Fair — Just okay",
  3: "Good — Solid experience",
  4: "Very Good — Almost perfect",
  5: "Excellent — Absolutely loved it!",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialog, setCancelDialog] = useState({ open: false, id: null });
  const [cancelling, setCancelling] = useState(false);
  const [reviewDialog, setReviewDialog] = useState({ open: false, eventId: null, eventTitle: "" });
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const fetched = useRef(false);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await eventService.getMyRegistrations();
      setRegistrations(response.data || []);
    } catch (err) {
      console.error("Failed to fetch registrations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetchRegistrations();
  }, []);

  const now = new Date();
  
  const upcomingRegs = registrations.filter(r => r.status === 'Confirmed' && new Date(r.event.date) >= now);
  const waitlistRegs = registrations.filter(r => r.status === 'Waitlist' && new Date(r.event.date) >= now);
  const pastRegs = registrations.filter(r => new Date(r.event.date) < now && r.status !== 'Cancelled');

  const filteredData = tabValue === 0 ? upcomingRegs : tabValue === 1 ? waitlistRegs : pastRegs;

  const handleConfirmCancel = async () => {
    setCancelling(true);
    try {
      await eventService.cancel(cancelDialog.id);
      fetchRegistrations();
      setCancelDialog({ open: false, id: null });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel");
    } finally {
      setCancelling(false);
    }
  };

  const openReviewDialog = (eventId, eventTitle) => {
    setReviewDialog({ open: true, eventId, eventTitle });
    setReviewRating(0);
    setReviewComment("");
    setReviewError("");
  };

  const handleSubmitReview = async () => {
    if (reviewRating === 0) {
      setReviewError("Please select a rating.");
      return;
    }

    setSubmittingReview(true);
    setReviewError("");

    try {
      await eventService.submitReview(reviewDialog.eventId, {
        rating: reviewRating,
        comment: reviewComment || null,
      });
      setReviewDialog({ open: false, eventId: null, eventTitle: "" });
      fetchRegistrations();
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <Box sx={{ pt: "110px", pb: 8, minHeight: "100vh", bgcolor: "#F8FAFC" }}>
      <Container maxWidth="xl">
        <Box sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", md: "row" },
          bgcolor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
          overflow: "hidden",
          minHeight: "750px"
        }}>
          <Box sx={{ 
            width: { xs: "100%", md: 280 }, 
            flexShrink: 0, 
            bgcolor: "#F9FAFB", 
            borderRight: { md: "1px solid #F1F5F9" },
            p: 4
          }}>
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ fontSize: "1.35rem", fontWeight: 900, color: "#0F172A", mb: 0.5, letterSpacing: "-0.5px" }}>
                My Events
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 500 }}>
                Manage your schedule
              </Typography>
            </Box>

            <Stack spacing={0.5}>
              <SidebarItem 
                icon={<GridViewOutlinedIcon sx={{ fontSize: 20 }} />} 
                label="Upcoming" 
                active={tabValue === 0} 
                count={upcomingRegs.length}
                onClick={() => setTabValue(0)}
              />
              <SidebarItem 
                icon={<AssignmentTurnedInOutlinedIcon sx={{ fontSize: 20 }} />} 
                label="Waitlist" 
                active={tabValue === 1} 
                count={waitlistRegs.length}
                onClick={() => setTabValue(1)}
              />
              <SidebarItem 
                icon={<HistoryIcon sx={{ fontSize: 20 }} />} 
                label="History" 
                active={tabValue === 2} 
                count={pastRegs.length}
                onClick={() => setTabValue(2)}
              />
            </Stack>

            <Box sx={{ mt: "auto", pt: 6 }}>
              <Divider sx={{ mb: 4, borderColor: "#EEF2F6" }} />
              <Typography sx={{ fontSize: "0.65rem", fontWeight: 800, color: "#94A3B8", mb: 2.5, textTransform: "uppercase", letterSpacing: "1px" }}>
                Your Statistics
              </Typography>
              <Stack spacing={3}>
                <StatMini label="Successful Bookings" value={registrations.filter(r => r.status === 'Confirmed').length} />
                <StatMini label="Member Tier" value="Standard" />
              </Stack>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1, p: { xs: 3, md: 5 }, bgcolor: "#FFFFFF" }}>
            {loading ? (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 20, gap: 2 }}>
                <CircularProgress size={28} thickness={6} sx={{ color: "#0F172A" }} />
                <Typography sx={{ color: "#94A3B8", fontSize: "0.875rem", fontWeight: 600 }}>Syncing events...</Typography>
              </Box>
            ) : (
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 5 }}>
                  <Box>
                    <Typography sx={{ fontSize: "1.25rem", fontWeight: 900, color: "#0F172A", mb: 0.5 }}>
                      {tabValue === 0 ? "Upcoming Adventures" : tabValue === 1 ? "Waitlist Queue" : "Completed Events"}
                    </Typography>
                    <Typography sx={{ fontSize: "0.85rem", color: "#94A3B8", fontWeight: 500 }}>
                      You have {filteredData.length} {tabValue === 0 ? "confirmed" : tabValue === 1 ? "pending" : "past"} registrations
                    </Typography>
                  </Box>
                  <Button 
                    component={RouterLink} 
                    to="/events" 
                    variant="contained" 
                    size="small"
                    sx={{ bgcolor: "#0F172A", textTransform: "none", fontWeight: 700, borderRadius: "8px", px: 2.5, py: 1, boxShadow: "none", "&:hover": { bgcolor: "#334155", boxShadow: "none" } }}
                  >
                    Find More Events
                  </Button>
                </Box>

                {filteredData.length > 0 ? (
                  <Stack spacing={1.5}>
                    {filteredData.map(reg => (
                      <EventRow 
                        key={reg.id} 
                        reg={reg} 
                        type={tabValue} 
                        userId={user?.id}
                        onCancel={() => setCancelDialog({ open: true, id: reg.id })} 
                        onReview={() => openReviewDialog(reg.event.id, reg.event.title)}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Box sx={{ py: 15, textAlign: "center", bgcolor: "#FAFBFC", borderRadius: "12px", border: "1px dashed #E2E8F0" }}>
                    <Box sx={{ p: 2, bgcolor: "#FFFFFF", borderRadius: "50%", display: "inline-flex", mb: 2, border: "1px solid #F1F5F9" }}>
                        <GridViewOutlinedIcon sx={{ color: "#CBD5E1", fontSize: 32 }} />
                    </Box>
                    <Typography sx={{ color: "#1E293B", fontSize: "1rem", fontWeight: 700, mb: 1 }}>
                      No results found
                    </Typography>
                    <Typography sx={{ color: "#64748B", fontSize: "0.875rem", mb: 3 }}>
                      Try adjusting your filters or browsing new events.
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Container>

      <Dialog 
        open={cancelDialog.open} 
        onClose={() => setCancelDialog({ open: false, id: null })}
        PaperProps={{ elevation: 0, sx: { borderRadius: "16px", border: "1px solid #E2E8F0", maxWidth: 400, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: "1.35rem", letterSpacing: "-0.5px" }}>Cancel Registration</DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Typography sx={{ color: "#64748B", fontSize: "0.95rem", lineHeight: 1.6 }}>
            Are you sure you want to cancel? This will immediately free up your spot for someone else.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
          <Button onClick={() => setCancelDialog({ open: false, id: null })} sx={{ color: "#64748B", textTransform: "none", fontWeight: 700 }}>Stay</Button>
          <Button 
            onClick={handleConfirmCancel} 
            variant="contained" 
            disabled={cancelling}
            sx={{ bgcolor: "#EF4444", "&:hover": { bgcolor: "#DC2626" }, textTransform: "none", fontWeight: 800, borderRadius: "10px", px: 3, boxShadow: "none" }}
          >
            {cancelling ? "Processing..." : "Confirm Cancel"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={reviewDialog.open}
        onClose={() => !submittingReview && setReviewDialog({ open: false, eventId: null, eventTitle: "" })}
        PaperProps={{
          elevation: 0,
          sx: { borderRadius: "20px", border: "1px solid #E2E8F0", maxWidth: 500, p: 0, overflow: "hidden" }
        }}
      >
        <Box sx={{
          background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
          px: 3.5,
          py: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
          position: "relative"
        }}>
          <Box sx={{
            width: 48,
            height: 48,
            borderRadius: "14px",
            background: "rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <RateReviewOutlinedIcon sx={{ color: "#FBBF24", fontSize: 26 }} />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography sx={{ color: "#FFFFFF", fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.3px", mb: 0.3 }}>
              Share Your Experience
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", fontWeight: 500, lineHeight: 1.3 }}>
              {reviewDialog.eventTitle}
            </Typography>
          </Box>
          <IconButton
            onClick={() => setReviewDialog({ open: false, eventId: null, eventTitle: "" })}
            disabled={submittingReview}
            sx={{
              color: "rgba(255,255,255,0.5)",
              position: "absolute",
              top: 8,
              right: 8,
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)", color: "#FFFFFF" },
            }}
            size="small"
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <Box sx={{ px: 3.5, py: 3.5 }}>
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "1.2px", mb: 2 }}>
            Your Rating
          </Typography>

          <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            mb: 3.5,
            p: 3,
            borderRadius: "14px",
            bgcolor: "#F8FAFC",
            border: "1px solid #F1F5F9",
          }}>
            <Rating
              value={reviewRating}
              onChange={(_, v) => { setReviewRating(v); setReviewError(""); }}
              size="large"
              icon={<StarIcon sx={{ fontSize: 36, color: "#F59E0B" }} />}
              emptyIcon={<StarBorderIcon sx={{ fontSize: 36, color: "#CBD5E1" }} />}
              sx={{ gap: 0.8, "& .MuiRating-icon": { transition: "transform 0.15s ease", "&:hover": { transform: "scale(1.25)" } } }}
            />
            <Typography sx={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color: reviewRating === 0 ? "#94A3B8" : "#0F172A",
              transition: "color 0.2s ease",
            }}>
              {reviewRating === 0 ? "Tap a star to rate" : `${ratingLabels[reviewRating]}`}
            </Typography>
            {reviewRating > 0 && (
              <Typography sx={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: 500, letterSpacing: "0.3px" }}>
                {reviewRating} of 5 stars
              </Typography>
            )}
          </Box>

          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "1.2px", mb: 1.5 }}>
            Write a Review <Typography component="span" sx={{ fontWeight: 400, textTransform: "none", color: "#94A3B8", fontSize: "0.7rem" }}>(optional)</Typography>
          </Typography>

          <TextField
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Tell others about your experience... What did you enjoy? Any highlights?"
            multiline
            rows={4}
            inputProps={{ maxLength: 300 }}
            fullWidth
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: "#F8FAFC",
                fontSize: 14,
                lineHeight: 1.6,
                padding: "12px 16px",
                "& fieldset": { borderColor: "#E2E8F0", borderWidth: "1.5px" },
                "&:hover fieldset": { borderColor: "#CBD5E1" },
                "&.Mui-focused fieldset": { borderColor: "#0F172A", borderWidth: "2px" },
              },
            }}
          />
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1 }}>
            <Typography sx={{ fontSize: 11, color: reviewComment.length > 260 ? "#DC2626" : "#9CA3AF", fontWeight: 500, transition: "color 0.2s" }}>
              {reviewComment.length === 0 ? "" : `${300 - reviewComment.length} characters remaining`}
            </Typography>
            <Typography sx={{ fontSize: 11, color: reviewComment.length > 260 ? "#DC2626" : "#94A3B8", fontWeight: 700 }}>
              {reviewComment.length}/300
            </Typography>
          </Box>
          {reviewComment.length > 260 && (
            <LinearProgress
              variant="determinate"
              value={(reviewComment.length / 300) * 100}
              sx={{ mt: 0.75, height: 3, borderRadius: 2, bgcolor: "#FEE2E2", "& .MuiLinearProgress-bar": { bgcolor: "#DC2626", borderRadius: 2 } }}
            />
          )}

          {reviewError && (
            <Box sx={{
              mt: 2,
              p: 2,
              borderRadius: "10px",
              bgcolor: "#FEF2F2",
              border: "1px solid #FECACA",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}>
              <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#DC2626", flexShrink: 0 }} />
              <Typography sx={{ fontSize: "0.8rem", color: "#991B1B", fontWeight: 600, lineHeight: 1.4 }}>
                {reviewError}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ px: 3.5, pb: 3.5, display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
          <Button
            onClick={() => setReviewDialog({ open: false, eventId: null, eventTitle: "" })}
            disabled={submittingReview}
            sx={{
              color: "#64748B",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.85rem",
              borderRadius: "10px",
              px: 3,
              py: 1.2,
              border: "1.5px solid #E2E8F0",
              "&:hover": { bgcolor: "#F8FAFC", borderColor: "#CBD5E1" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            disabled={submittingReview || reviewRating === 0}
            sx={{
              textTransform: "none",
              fontWeight: 800,
              fontSize: "0.85rem",
              borderRadius: "10px",
              px: 4,
              py: 1.2,
              background: reviewRating === 0 ? undefined : "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
              "&:hover": { background: reviewRating === 0 ? undefined : "linear-gradient(135deg, #334155 0%, #1E293B 100%)" },
              boxShadow: "none",
              "&.Mui-disabled": { bgcolor: "#E2E8F0", color: "#94A3B8" },
            }}
          >
            {submittingReview ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={16} thickness={6} sx={{ color: "#FFFFFF" }} />
                Submitting...
              </Box>
            ) : "Submit Review"}
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}

const EventRow = ({ reg, type, userId, onCancel, onReview }) => {
  const isPast = new Date(reg.event.date) < new Date();
  const isConfirmed = reg.status === 'Confirmed';
  const hasReviewed = reg.event.reviews_list?.some(r => r.user?.id === userId);

  return (
    <Card 
      elevation={0}
      sx={{ 
        display: "flex", 
        alignItems: "center", 
        p: 2, 
        borderRadius: "12px", 
        border: "1px solid #F1F5F9",
        transition: "all 0.2s ease",
        "&:hover": { borderColor: "#CBD5E1", bgcolor: "#FAFAFA", transform: "translateX(4px)" }
      }}
    >
      <Avatar 
        variant="rounded" 
        src={reg.event.image} 
        sx={{ width: 60, height: 60, mr: 2.5, borderRadius: "10px", border: "1px solid #F1F5F9" }} 
      />
      
      <Box sx={{ flexGrow: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
          <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.2px" }}>
            {reg.event.title}
          </Typography>
          {type === 1 && (
            <Chip 
              label={`Pos: #${reg.position_in_waitlist}`} 
              size="small" 
              sx={{ height: 18, fontSize: "0.65rem", fontWeight: 900, bgcolor: "#FEF3C7", color: "#92400E", borderRadius: "4px" }} 
            />
          )}
          {hasReviewed && (
            <Chip 
              label="Reviewed" 
              size="small" 
              sx={{ height: 18, fontSize: "0.65rem", fontWeight: 900, bgcolor: "#D1FAE5", color: "#065F46", borderRadius: "4px" }} 
            />
          )}
        </Stack>
        
        <Stack direction="row" spacing={2.5} sx={{ color: "#94A3B8" }}>
          <Typography sx={{ fontSize: "0.75rem", display: "flex", alignItems: "center", gap: 0.6, fontWeight: 600 }}>
            <CalendarTodayOutlinedIcon sx={{ fontSize: 13, color: "#64748B" }} /> {new Date(reg.event.date).toLocaleDateString('en-GB')}
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", display: "flex", alignItems: "center", gap: 0.6, fontWeight: 600 }}>
            <LocationOnOutlinedIcon sx={{ fontSize: 13, color: "#64748B" }} /> {reg.event.location}
          </Typography>
        </Stack>
      </Box>

      <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
        <Button 
          component={RouterLink} 
          to={`/events/${reg.event.id}`}
          variant="text" 
          size="small" 
          sx={{ textTransform: "none", color: "#0F172A", fontWeight: 800, fontSize: "0.8rem" }}
        >
          Details
        </Button>
        
        {isPast && isConfirmed && !hasReviewed ? (
          <Button 
            onClick={onReview}
            variant="outlined" 
            size="small" 
            sx={{ textTransform: "none", color: "#007BFF", borderColor: "#007BFF", fontWeight: 800, fontSize: "0.8rem", borderRadius: "8px", px: 2, "&:hover": { bgcolor: "#EFF6FF" } }}
          >
            Write Review
          </Button>
        ) : isPast ? (
          <Button 
            variant="outlined" 
            size="small" 
            disabled
            sx={{ textTransform: "none", color: "#94A3B8", borderColor: "#E2E8F0", fontWeight: 800, fontSize: "0.8rem", borderRadius: "8px", px: 2 }}
          >
            Finished
          </Button>
        ) : type !== 2 ? (
          <Button 
            onClick={onCancel}
            variant="text" 
            size="small" 
            sx={{ textTransform: "none", color: "#EF4444", fontWeight: 800, fontSize: "0.8rem", "&:hover": { bgcolor: "#FEF2F2" } }}
          >
            Cancel
          </Button>
        ) : null}
      </Stack>
    </Card>
  );
};
