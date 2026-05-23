import { Box, Container, Typography, Link } from "@mui/material";

const companyLinks = ["About Us", "Contact", "Careers", "Press"];
const legalLinks = ["Privacy Policy", "Terms of Service", "Cookie Policy", "Guidelines"];
const bottomLinks = ["Help Center", "Status", "Accessibility"];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: "#222222",
        color: "#fff",
        py: "48px",
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: "1200px", px: "24px" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
            gap: { xs: 4, md: 6 },
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 20, lineHeight: 1, mb: 2 }}>
              EVENTNOW
            </Typography>
            <Typography sx={{ color: "#9CA3AF", maxWidth: 360, lineHeight: 1.7, fontSize: 14 }}>
              Your premier destination for discovering and joining amazing local events.
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 700, color: "#fff", mb: "16px" }}>Company</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.1 }}>
              {companyLinks.map((text) => (
                <Link key={text} href="#" underline="none" sx={{ color: "#9CA3AF", fontSize: 14, "&:hover": { color: "#fff" } }}>
                  {text}
                </Link>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 700, color: "#fff", mb: "16px" }}>Legal</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.1 }}>
              {legalLinks.map((text) => (
                <Link key={text} href="#" underline="none" sx={{ color: "#9CA3AF", fontSize: 14, "&:hover": { color: "#fff" } }}>
                  {text}
                </Link>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 700, color: "#fff", mb: "16px" }}>Follow Us</Typography>
            <Box sx={{ display: "flex", gap: 1.4, flexWrap: "wrap" }}>
              {["F", "T", "I", "L"].map((item) => (
                <Box
                  key={item}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "#374151",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    transition: "background-color 220ms ease",
                    "&:hover": { bgcolor: "#4B5563" },
                  }}
                >
                  {item}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            mt: { xs: 4, md: 5 },
            pt: 3,
            borderTop: "1px solid #374151",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography sx={{ color: "#9CA3AF", fontSize: 14 }}>© 2026 Event Platform. All rights reserved.</Typography>

          <Box sx={{ display: "flex", gap: { xs: 2.5, md: 4 }, flexWrap: "wrap" }}>
            {bottomLinks.map((text) => (
              <Link key={text} href="#" underline="none" sx={{ color: "#9CA3AF", fontSize: 14, "&:hover": { color: "#fff" } }}>
                {text}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
