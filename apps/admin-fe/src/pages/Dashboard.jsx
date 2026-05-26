import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Link,
  Typography,
} from "@mui/material";
import { dashboardService } from "../services/dashboardService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_events: 0,
    pending_approval: 0,
    approved_events: 0,
    active_categories: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      // Chỉ hiện loading nếu chưa có dữ liệu stats thực tế (tránh nháy trắng trang khi quay lại)
      const isInitial = stats.total_users === 0 && stats.total_events === 0;
      if (isInitial) setLoading(true);
      
      setError(null);
      try {
        const dashboardResult = await dashboardService.getOverview();
        if (!cancelled) {
          setStats(dashboardResult.data.stats);
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

  const statLabels = [
    { key: "total_users", label: "Total Users" },
    { key: "total_events", label: "Total Events" },
    { key: "pending_approval", label: "Pending Approval" },
    { key: "approved_events", label: "Approved Events" },
  ];

  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Admin Dashboard
        </Typography>
        <Typography color="text.secondary">System overview and management</Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
          gap: 2,
          mb: 3,
        }}
      >
        {statLabels.map(({ key, label }) => (
          <Card
            key={key}
            sx={{
              borderRadius: 2,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              backgroundColor: "#fff",
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Typography color="textSecondary" variant="body2" sx={{ fontSize: "0.85rem", mb: 1 }}>
                {label}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.75rem" }}>
                {loading ? "-" : stats[key]}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Bottom Sections */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: 3,
        }}
      >
        {/* Pending Events Section */}
        <Link
          component={RouterLink}
          to="/admin/events"
          sx={{
            textDecoration: "none",
            cursor: "pointer",
            "&:hover": {
              opacity: 0.8,
            },
          }}
        >
          <Card
            sx={{
              p: 2.5,
              borderRadius: 2,
              height: "100%",
              backgroundColor: "#fafafa",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#f0f0f0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, fontSize: "1.1rem", color: "#000" }}>
              Pending Events
            </Typography>
            <Typography color="textSecondary" variant="body2" sx={{ mb: 2 }}>
              Review and approve event submissions
            </Typography>

            {loading ? (
              <Box sx={{ py: 3, display: "flex", justifyContent: "center" }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <Typography color="primary" sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
                {stats.pending_approval} waiting →
              </Typography>
            )}
          </Card>
        </Link>

        {/* Categories Section */}
        <Link
          component={RouterLink}
          to="/admin/categories"
          sx={{
            textDecoration: "none",
            cursor: "pointer",
            "&:hover": {
              opacity: 0.8,
            },
          }}
        >
          <Card
            sx={{
              p: 2.5,
              borderRadius: 2,
              height: "100%",
              backgroundColor: "#fafafa",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#f0f0f0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, fontSize: "1.1rem", color: "#000" }}>
              Categories
            </Typography>
            <Typography color="textSecondary" variant="body2" sx={{ mb: 2 }}>
              Manage event categories and tags
            </Typography>

            {loading ? (
              <Box sx={{ py: 3, display: "flex", justifyContent: "center" }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <Typography color="primary" sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
                {stats.active_categories} active →
              </Typography>
            )}
          </Card>
        </Link>
      </Box>
    </Box>
  );
};

export default Dashboard;
