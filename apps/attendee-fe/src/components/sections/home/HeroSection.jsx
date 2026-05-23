import { Box, Button, Container, Stack, Typography } from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link as RouterLink } from "react-router-dom";

const stats = [
  {
    icon: CalendarMonthOutlinedIcon,
    value: "500+",
    label: "Events Monthly",
  },
  {
    icon: GroupOutlinedIcon,
    value: "50K+",
    label: "Active Members",
  },
  {
    icon: TrendingUpOutlinedIcon,
    value: "4.8?",
    label: "Average Rating",
  },
];

export default function HeroSection() {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: "560px",
        py: "96px",
        px: "32px",
        background: "linear-gradient(135deg, #007BFF 0%, #0056B3 100%)",
        color: "#fff",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          right: -140,
          top: -170,
          width: 520,
          height: 520,
          borderRadius: "50%",
          bgcolor: "rgba(255, 255, 255, 0.08)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: "22%",
          bottom: -180,
          width: 300,
          height: 300,
          borderRadius: "50%",
          bgcolor: "rgba(255, 255, 255, 0.06)",
        }}
      />

      <Container maxWidth={false} sx={{ position: "relative", maxWidth: "1200px", px: 0 }}>
        <Box sx={{ display: "flex", flexDirection: "column", rowGap: { xs: 4, md: 5 } }}>
          <Typography
            sx={{
              maxWidth: "680px",
              fontWeight: 800,
              fontSize: { xs: 44, md: 62 },
              lineHeight: 1.05,
              letterSpacing: "-1px",
              mb: 0,
            }}
          >
            <Box component="span" sx={{ color: "#ffffff" }}>Find Events</Box>
            <br />
            <Box component="span" sx={{ color: "#E7F3FF" }}>You&apos;ll Love</Box>
          </Typography>

          <Typography
            sx={{
              maxWidth: 500,
              color: "rgba(255,255,255,0.80)",
              fontSize: 18,
              lineHeight: 1.7,
            }}
          >
            From music festivals to tech workshops - discover, register, and
            experience events that truly matter to you.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2.2} mt={0}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: "#fff",
                color: "#007BFF",
                textTransform: "none",
                borderRadius: "16px",
                px: "28px",
                py: "16px",
                fontSize: 16,
                fontWeight: 700,
                boxShadow: "none",
                "&:hover": { bgcolor: "#f1f7ff", boxShadow: "none" },
              }}
            >
              Browse Events
            </Button>

          <Button
            variant="contained"
            size="large"
            sx={{
                bgcolor: "rgba(255,255,255,0.15)",
                border: "2px solid rgba(255,255,255,0.30)",
                color: "#fff",
                textTransform: "none",
                borderRadius: "16px",
                px: "28px",
                py: "16px",
                fontSize: 16,
                fontWeight: 700,
                boxShadow: "none",
                "&:hover": {
                  borderColor: "rgba(255,255,255,0.30)",
                  bgcolor: "rgba(255,255,255,0.08)",
              },
            }}
            component={RouterLink}
            to="/login"
          >
            Get Started Free
          </Button>
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 2.3, md: 0 }}
            mt={0}
            sx={{ maxWidth: 760 }}
          >
            {stats.map((item, index) => {
              const Icon = item.icon;
              return (
                <Box
                  key={item.label}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    pr: { md: 4 },
                    mr: { md: 4 },
                    borderRight:
                      index !== stats.length - 1 ? { md: "1px solid rgba(255,255,255,0.25)" } : "none",
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "12px",
                      bgcolor: "rgba(255,255,255,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1.5,
                    }}
                  >
                    <Icon sx={{ fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 20, lineHeight: 1.15 }}>
                      {item.value}
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>{item.label}</Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
