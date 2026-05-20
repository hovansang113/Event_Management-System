import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useState } from "react";

const CancelEventDialog = ({ open, onClose, onConfirm, loading }) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Cancellation reason is required");
      return;
    }
    onConfirm(reason);
  };

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
          Cancel Event
        </Typography>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <strong>Warning:</strong> This action cannot be undone. All registered attendees will be notified via email.
        </Alert>

        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1, color: "#374151" }}>
            Cancellation Reason <span style={{ color: "#ef4444" }}>*</span>
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            size="small"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
            placeholder="Please provide a reason for cancelling this event..."
            error={!!error}
            helperText={error}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, mt: 3, justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={loading}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Keep Event
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirm}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={14} /> : null}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {loading ? "Cancelling..." : "Cancel Event"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CancelEventDialog;
