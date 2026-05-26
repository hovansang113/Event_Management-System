import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Send as SendIcon, Close as CloseIcon, CloudUpload as UploadIcon } from "@mui/icons-material";
import { useCreateEvent } from "../hooks/useCreateEvent";
import "../styles/components/CreateEventDialog.scss";

const CreateEventDialog = ({ open, onClose, onSuccess, eventId = null }) => {
  const { formData, loading, isFetching, error, categories, imagePreview, handleChange, handleImageChange, handleRemoveImage, handleSaveDraft, handleSubmitReview, handleUpdate, resetForm } = useCreateEvent(() => {
    onSuccess?.();
    onClose();
  }, eventId);

  const isEditMode = !!eventId;

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth className="create-event-dialog">
      <DialogTitle className="dialog-title">
        <Typography className="title-text">
          {isEditMode ? "Edit Event" : "Create New Event"}
        </Typography>
        <IconButton size="small" onClick={handleCancel}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers className="dialog-content">
        {isFetching ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 10, gap: 2 }}>
            <CircularProgress size={40} />
            <Typography sx={{ color: "#6b7280", fontSize: 14 }}>Loading event details...</Typography>
          </Box>
        ) : (
          <>
            <Typography className="section-title">Basic Information</Typography>

            <Box className="field-wrapper mb-sm">
              <Typography className="field-label">
                Event Name <span className="required">*</span>
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter event name"
                required
                inputProps={{ maxLength: 255 }}
              />
              <Typography className="char-counter">
                {formData.title.length}/255
              </Typography>
            </Box>

            <Box className="field-wrapper mb-sm">
              <Typography className="field-label">
                Description <span className="required">*</span>
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                size="small"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your event..."
                required
              />
            </Box>

            <Box className="field-wrapper mb-sm">
              <Typography className="field-label">
                Category <span className="required">*</span>
              </Typography>
              <FormControl fullWidth size="small" required>
                <Select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select a category
                  </MenuItem>
                  {categories.map(cat => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box className="field-wrapper">
              <Typography className="field-label">
                Location <span className="required">*</span>
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter event location (e.g. Central Park, New York)"
                required
              />
            </Box>

            <Typography className="section-title">Date & Time</Typography>

            <Box className="grid-2 field-wrapper">
              <Box>
                <Typography className="field-label">
                  Date <span className="required">*</span>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box>
                <Typography className="field-label">
                  Time <span className="required">*</span>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="time"
                  name="event_time"
                  value={formData.event_time}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>

            <Typography className="section-title">Capacity</Typography>

            <Box className="field-wrapper">
              <Typography className="field-label">
                Maximum Attendees <span className="required">*</span>
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Enter maximum capacity (min. 1)"
                required
                inputProps={{ min: 1 }}
              />
            </Box>

            <Typography className="section-title">
              Featured Image <span style={{ fontSize: 12, fontWeight: 400, color: "#9ca3af" }}>(optional)</span>
            </Typography>

            <Box component="label" className="upload-area">
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif"
                onChange={handleImageChange}
              />
              {imagePreview ? (
                <Box sx={{ position: 'relative' }}>
                  <img src={imagePreview} alt="Preview" className="preview-image" />
                  <Box sx={{ mt: 1, display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Typography className="change-text">
                      Click to change image
                    </Typography>
                    <Button 
                      size="small" 
                      color="error" 
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveImage();
                      }}
                      sx={{ textTransform: 'none', fontSize: 12 }}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
              ) : (
                <>
                  <UploadIcon className="upload-icon" />
                  <Typography className="upload-text">
                    Click to upload or drag and drop
                  </Typography>
                  <Typography className="upload-hint">
                    PNG, JPG, GIF up to 10MB
                  </Typography>
                </>
              )}
            </Box>

            {isEditMode && ["pending", "published"].includes(formData.status?.toLowerCase()) && (
              <Alert severity="warning" className="info-alert">
                This event is <strong>{formData.status}</strong> and cannot be edited.
              </Alert>
            )}

            {!isEditMode && (
              <Alert severity="info" className="info-alert">
                <strong>How it works:</strong> Save as Draft to continue editing later, or Submit for Review to send to admin for approval. You cannot edit an event while it's under review.
              </Alert>
            )}

            {error && (
              <Alert severity="error" className="error-alert">
                {error}
              </Alert>
            )}

            <Box className="actions">
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={loading}
                className="btn"
              >
                Cancel
              </Button>
              
              {isEditMode ? (
                <Button
                  variant="contained"
                  onClick={handleUpdate}
                  disabled={loading || ["pending", "published"].includes(formData.status?.toLowerCase())}
                  startIcon={loading ? <CircularProgress size={14} /> : null}
                  className="btn"
                >
                  {loading ? "Processing..." : "Update Event"}
                </Button>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    onClick={handleSaveDraft}
                    disabled={loading}
                    className="btn"
                  >
                    {loading ? "Processing..." : "Save as Draft"}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmitReview}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={14} /> : <SendIcon sx={{ fontSize: 16 }} />}
                    className="btn"
                  >
                    {loading ? "Processing..." : "Submit for Review"}
                  </Button>
                </>
              )}
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;
