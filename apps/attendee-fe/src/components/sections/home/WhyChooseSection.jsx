import { Box, Button, Container, Typography } from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link as RouterLink } from "react-router-dom";

const features = [
  {
    title: "Easy Discovery",
    description: "Find events that match your interests with our powerful search and filtering tools",
    icon: CalendarMonthOutlinedIcon,
    iconBg: "#E7F3FF",
    iconColor: "#007BFF",
  },
  {
    title: "Instant Registration",
    description: "Register for events in seconds and get instant confirmation with waitlist support",
    icon: GroupOutlinedIcon,
    iconBg: "#D4EDDA",
    iconColor: "#28A745",
  },
  {
    title: "Track Your Events",
    description: "Manage all your registrations in one place with reminders and updates",
    icon: TrendingUpOutlinedIcon,
    iconBg: "#FFF3CD",
    iconColor: "#FFC107",
  },
];

export default function WhyChooseSection() {
  return (
    <Box>
      <Box sx={{ bgcolor: "#ffffff", py: "64px", px: "24px" }}>
        <Container maxWidth={false} sx={{ maxWidth: "1200px", px: 0 }}>
          <Box>
            <Box sx={{ textAlign: "center", mb: { xs: 4, md: 5 } }}>
              <Typography sx={{ fontSize: 36, fontWeight: 700, color: "#333333" }}>
                Why Choose Event Platform?
              </Typography>
              <Typography sx={{ color: "#666666", fontSize: 14, mt: 1 }}>
                Everything you need to discover and attend amazing events
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                gap: "32px",
              }}
            >
              {features.map((item) => {
                const Icon = item.icon;
                return (
                  <Box
                    key={item.title}
                    sx={{
                      bgcolor: "#fff",
                      borderRadius: "16px",
                      px: { xs: 2, md: 3 },
                      py: { xs: 3, md: 4 },
                      textAlign: "center",
                      transition: "background-color 220ms ease",
                      "&:hover": { bgcolor: "#F8F9FA" }
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        bgcolor: item.iconBg,
                        color: item.iconColor,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2.2,
                      }}
                    >
                      <Icon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#333333", mb: 1.2 }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: "#666666", fontSize: 14, lineHeight: 1.6 }}>
                      {item.description}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Container>
      </Box>

      <Box sx={{ background: "linear-gradient(135deg, #007BFF 0%, #0056B3 100%)", py: "80px" }}>
        <Container maxWidth={false} sx={{ maxWidth: "1200px", px: "24px" }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ color: "#fff", fontSize: { xs: 34, md: 42 }, fontWeight: 700 }}>
              Ready to Join?
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.95)", fontSize: { xs: 16, md: 20 }, mt: 1.4 }}>
              Sign up today and never miss an event. It&apos;s free and takes less than a minute.
            </Typography>

            <Box
              sx={{
                mt: { xs: 3.2, md: 4.4 },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
                width: "fit-content",
                mx: "auto",
              }}
            >
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                component={RouterLink}
                to="/register"
                sx={{
                  bgcolor: "#fff",
                  color: "#007BFF",
                  textTransform: "none",
                  borderRadius: "12px",
                  px: "40px",
                  py: "16px",
                  fontWeight: 700,
                  fontSize: 16,
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#f1f7ff", boxShadow: "none" },
                }}
              >
                Sign Up Now
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "rgba(255,255,255,0.10)",
                  border: "2px solid rgba(255,255,255,0.30)",
                  color: "#fff",
                  textTransform: "none",
                  borderRadius: "12px",
                  px: "40px",
                  py: "16px",
                  fontWeight: 700,
                  fontSize: 16,
                  boxShadow: "none",
                  "&:hover": {
                    borderColor: "rgba(255,255,255,0.75)",
                    bgcolor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                Browse Events
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
