import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Chip,
  Typography,
} from "@mui/material";
import { categoryService } from "../services/categoryService";

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await categoryService.getAll();
        const raw = Array.isArray(result.data) ? result.data : [];
        if (!cancelled) {
          setCategories(raw);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Failed to load dashboard data");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const total = categories.length;
    const active = categories.filter((item) => item.is_active && !item.deleted_at).length;
    const inactive = categories.filter((item) => !item.is_active && !item.deleted_at).length;
    const deleted = categories.filter((item) => !!item.deleted_at).length;

    return { total, active, inactive, deleted };
  }, [categories]);

  const cards = [
    { label: "Total Categories", value: stats.total },
    { label: "Active", value: stats.active },
    { label: "Inactive", value: stats.inactive },
    { label: "Deleted", value: stats.deleted },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Admin Dashboard
        </Typography>
        <Typography color="text.secondary">Overview of category data from database</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

     <Box
        sx={{
          display: "flex",
          gap: 3,
          mb: 3,
          width: "100%",
        }}
      >
        {cards.map((card) => (
          <Card
            key={card.label}
            sx={{
              flex: 1,
              borderRadius: 3,
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            }}
          >
            <CardContent>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                {card.label}
              </Typography>

              <Typography
                variant="h4"
                sx={{ fontWeight: 700 }}
              >
                {loading ? "-" : card.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Latest Categories
        </Typography>
        {loading ? (
          <Box sx={{ py: 3, display: "grid", placeItems: "center" }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <List dense>
            {categories.map((item) => (
              <ListItem key={item.id} divider>
                <ListItemText
                  primary={item.name}
                  secondary={`Slug: ${item.slug}`}
                />
                <Chip
                  size="small"
                  label={item.deleted_at ? "Deleted" : item.is_active ? "Active" : "Inactive"}
                  color={item.deleted_at ? "error" : item.is_active ? "success" : "default"}
                  variant={item.is_active && !item.deleted_at ? "filled" : "outlined"}
                />
              </ListItem>
            ))}
            {categories.length === 0 && (
              <ListItem>
                <ListItemText primary="No category data found." />
              </ListItem>
            )}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;
