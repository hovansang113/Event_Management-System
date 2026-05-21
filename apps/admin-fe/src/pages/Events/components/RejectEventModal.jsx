import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";

export const RejectEventModal = ({
  open,
  eventTitle,
  loading,
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState("");
  const maxChars = 300;

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason("");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: 18 }}>
        Reject Event?
      </DialogTitle>

      <DialogContent>
        <Box sx={{ my: 2 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Event: <strong>{eventTitle}</strong>
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Please provide constructive feedback..."
            value={reason}
            onChange={(e) => setReason(e.target.value.slice(0, maxChars))}
            variant="outlined"
            size="small"
            disabled={loading}
            sx={{ mb: 1 }}
          />

          <Typography variant="caption" color="textSecondary">
            {reason.length}/{maxChars} characters
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onCancel} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={loading || !reason.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Rejecting..." : "Confirm Rejection"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
