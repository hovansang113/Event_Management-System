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
        sx: {
          borderRadius: 4,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          fontWeight: 700,
          fontSize: 20,
          pb: 1,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            backgroundColor: "#fee2e2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
        >
          ⚠️
        </Box>

        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
            Reject Event
          </Typography>

          <Typography
            variant="caption"
            sx={{ color: "#6b7280" }}
          >
            Please provide a reason for rejection
          </Typography>
        </Box>
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
            onChange={(e) =>
              setReason(e.target.value.slice(0, maxChars))
            }
            variant="outlined"
            size="small"
            disabled={loading}
            sx={{
              mb: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "#fafafa",
              },
            }}
          />

          <Typography
            variant="caption"
            color="textSecondary"
          >
            {reason.length}/{maxChars} characters
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          disabled={loading}
          sx={{
            borderRadius: 2,
            textTransform: "none",
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={loading || !reason.trim()}
          startIcon={
            loading ? (
              <CircularProgress
                size={20}
                color="inherit"
              />
            ) : null
          }
          sx={{
            borderRadius: 2,
            textTransform: "none",
            boxShadow: "none",
          }}
        >
          {loading ? "Rejecting..." : "Confirm Rejection"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};