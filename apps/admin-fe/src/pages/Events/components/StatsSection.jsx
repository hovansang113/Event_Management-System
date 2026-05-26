import { Box, Card, Typography } from "@mui/material";

export const StatsSection = ({ stats }) => {
  const statCards = [
    {
      title: "Total Pending",
      value: stats?.total_pending || 0,
      color: "#FFC107",
    },
    {
      title: "Published",
      value: stats?.total_published || 0,
      color: "#28A745",
    },
    {
      title: "Rejected",
      value: stats?.total_rejected || 0,
      color: "#FF9800",
    },
    {
      title: "Approved Today",
      value: stats?.approved_today || 0,
      color: "#28A745",
    },
    {
      title: "Rejected Today",
      value: stats?.rejected_today || 0,
      color: "#DC3545",
    },
  ];

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
      {statCards.map((stat, index) => (
        <Card
          key={index}
          sx={{
            flex: 1,
            borderRadius: 2,
            border: "1px solid #e5e7eb",
            boxShadow: "none",
          }}
        >
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="h4" sx={{ color: stat.color, fontWeight: 700, mb: 1 }}>
              {stat.value}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {stat.title}
            </Typography>
          </Box>
        </Card>
      ))}
    </Box>
  );
};
