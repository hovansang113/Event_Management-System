import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

export const ApproveEventModal = ({
  open,
  eventTitle,
  loading,
  onConfirm,
  onCancel,
}) => {
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
        Approve Event?
      </DialogTitle>

      <DialogContent>
        <Box sx={{ my: 2 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Are you sure you want to approve this event?
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {eventTitle}
          </Typography>
          <Typography variant="caption" color="textSecondary" sx={{ display: "block", mt: 2 }}>
            It will be published and visible to all users.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onCancel} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="success"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Approving..." : "Confirm Approval"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
