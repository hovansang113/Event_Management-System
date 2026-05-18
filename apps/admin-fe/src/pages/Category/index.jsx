import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
  Tooltip,
  Chip,
  Switch,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

import { useCategory } from "../../hooks/Category/useCategory";
import CategoryForm from "./CategoryForm";
import styles from "./Category.module.scss";

const getCategoryIcon = (iconSource) => {
  if (!iconSource || (!iconSource.startsWith("http") && !iconSource.startsWith("/"))) {
    return <Box sx={{ backgroundColor: '#f0f0f0', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1 }}>
      <Typography variant="caption">N/A</Typography>
    </Box>;
  }

  return (
    <Box
      component="img"
      src={iconSource}
      alt="category-icon"
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
      onError={(e) => {
        e.target.style.display = "none";
      }}
    />
  );
};

export default function ManageCategories() {
  const { 
    categories, 
    loading, 
    error, 
    formData, 
    openForm,
    handleChange, 
    handleOpenAdd,
    handleOpenEdit,
    handleCloseForm,
    handleSubmit, 
    handleDelete,
    handleRestore,
    handleToggleStatus
  } = useCategory();

  return (
    <Box className={styles.categoryContainer}>
      {/* Header */}
      <Box className={styles.headerSection}>
        <Box>
          <Typography variant="h4" className={styles.title}>
            Manage Categories
          </Typography>
          <Typography className={styles.subtitle}>
            Organize events with categories, now with slugs and status control
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          disableElevation
          className={styles.addButton}
          onClick={handleOpenAdd}
        >
          Add Category
        </Button>
      </Box>

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Table Container */}
      <TableContainer
        component={Paper}
        className={styles.tableWrapper}
      >
        {loading && !openForm && (
          <Box className={styles.loadingOverlay}>
            <CircularProgress />
          </Box>
        )}

        <Table>
          <TableHead className={styles.tableHead}>
            <TableRow>
              <TableCell sx={{ width: 80 }}>Icon</TableCell>
              <TableCell>Category Info</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category.id} hover sx={{ opacity: category.deleted_at ? 0.6 : 1 }}>
                  <TableCell>
                    <Box className={styles.iconBox}>
                      {getCategoryIcon(category.icon)}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography variant="subtitle2" className={styles.categoryName}>
                      {category.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Slug: {category.slug}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" className={styles.categoryDescription}>
                      {category.description || "No description available"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip 
                        label={category.is_active ? "Active" : "Inactive"} 
                        color={category.is_active ? "success" : "default"}
                        size="small"
                        variant="outlined"
                        icon={category.is_active ? <CheckCircleOutlineIcon /> : <BlockIcon />}
                      />
                      {!category.deleted_at && (
                        <Switch 
                          size="small" 
                          checked={category.is_active} 
                          onChange={() => handleToggleStatus(category)}
                        />
                      )}
                    </Stack>
                  </TableCell>

                  <TableCell align="right">
                    <Box className={styles.actionsCell}>
                      {!category.deleted_at ? (
                        <>
                          <Tooltip title="Edit">
                            <IconButton 
                              color="primary" 
                              size="small"
                              onClick={() => handleOpenEdit(category)}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDelete(category.id)}
                            >
                              <DeleteOutlineOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <Tooltip title="Restore">
                          <IconButton
                            color="success"
                            size="small"
                            onClick={() => handleRestore(category.id)}
                          >
                            <RestoreFromTrashIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              !loading && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Typography color="text.secondary">
                      No categories found. Start by adding one!
                    </Typography>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Form - Add/Edit */}
      <CategoryForm 
        open={openForm}
        onClose={handleCloseForm}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </Box>
  );
}
