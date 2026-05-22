import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Link,
} from "@mui/material";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

export default function Footer() {
  return (
    <Box
      sx={{
        bgcolor: "#1f1f1f",
        color: "#fff",
        pt: 8,
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          
          
          {/* Logo + Description */}
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>


              <Typography fontWeight={700} fontSize={28}>
                EVENTNOW
              </Typography>
            </Box>

            <Typography
              sx={{
                color: "#b0b0b0",
                lineHeight: 1.8,
                maxWidth: 320,
              }}
            >
              Your premier destination for discovering and joining amazing
              local events.
            </Typography>
          </Grid>

          {/* Company */}
          <Grid item xs={6} md={2}>
            <Typography fontWeight={700} mb={2}>
              Company
            </Typography>

            <Box display="flex" flexDirection="column" gap={1.2}>
              <Link display="block" href="#" underline="none" color="#b0b0b0">
                About Us
              </Link>

              <Link display="block" href="#" underline="none" color="#b0b0b0">
                Contact
              </Link>

              <Link display="block" href="#" underline="none" color="#b0b0b0">
                Careers
              </Link>

              <Link display="block" href="#" underline="none" color="#b0b0b0">
                Press
              </Link>
            </Box>
          </Grid>

          {/* Legal */}
          <Grid item xs={6} md={3}>
            <Typography fontWeight={700} mb={2}>
              Legal
            </Typography>

            <Box display="flex" flexDirection="column" gap={1.2}>
              <Link display="block" href="#" underline="none" color="#b0b0b0">
                Privacy Policy
              </Link>

              <Link display="block" href="#" underline="none" color="#b0b0b0">
                Terms of Service
              </Link>

              <Link display="block" href="#" underline="none" color="#b0b0b0">
                Cookie Policy
              </Link>

              <Link display="block" href="#" underline="none" color="#b0b0b0">
                Guidelines
              </Link>
            </Box>
          </Grid>

          {/* Social */}
          <Grid item xs={12} md={3}>
            <Typography fontWeight={700} mb={2}>
              Follow Us
            </Typography>

            <Box display="flex" gap={2}>
              {[
                <FacebookIcon />,
                <TwitterIcon />,
                <InstagramIcon />,
                <LinkedInIcon />,
              ].map((icon, index) => (
                <IconButton
                  key={index}
                  sx={{
                    bgcolor: "#2d3b55",
                    color: "#fff",
                    width: 48,
                    height: 48,
                    "&:hover": {
                      bgcolor: "#3f4f70",
                    },
                  }}
                >
                  {icon}
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Bottom */}
        <Box
          mt={6}
          pt={3}
          sx={{
            borderTop: "1px solid #3a3a3a",
          }}
          display="flex"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
        >
          <Typography color="#b0b0b0">
            © 2026 Event Platform. All rights reserved.
          </Typography>

          <Box display="flex" flexWrap="wrap" gap={4}>
            <Link display="block" href="#" underline="none" color="#b0b0b0">
              Help Center
            </Link>

            <Link display="block" href="#" underline="none" color="#b0b0b0">
              Status
            </Link>

            <Link display="block" href="#" underline="none" color="#b0b0b0">
              Accessibility
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}