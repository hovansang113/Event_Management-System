import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";

const CategoryForm = ({ open, onClose, formData, onChange, onSubmit, loading }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={onSubmit}>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {formData?.id ? "Edit Category" : "Add New Category"}
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            {/* Tên danh mục */}
            <TextField
              label="Category Name"
              name="name"
              value={formData.name || ""}
              onChange={onChange}
              fullWidth
              required
              placeholder="e.g. Music, Sports..."
              autoFocus
            />

            {/* Mô tả */}
            <TextField
              label="Description"
              name="description"
              value={formData.description || ""}
              onChange={onChange}
              fullWidth
              multiline
              rows={3}
              placeholder="Tell something about this category..."
            />

            {/* URL Icon */}
            <TextField
              label="Icon URL"
              name="icon"
              value={formData.icon || ""}
              onChange={onChange}
              fullWidth
              placeholder="https://example.com/icon.png"
              helperText="Paste a direct image link here"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
            sx={{ px: 4, borderRadius: 2 }}
          >
            {loading ? "Saving..." : "Save Category"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CategoryForm;
