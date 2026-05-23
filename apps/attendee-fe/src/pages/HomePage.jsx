import { Box } from "@mui/material";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { HeroSection, WhyChooseSection } from "../components/sections";
import { FeaturedEventsSection } from "../components/event";
import { ExploreCategorySection } from "../components/category";

export default function HomePage() {
  return (
    <Box display="flex" flexDirection="column" minHeight="100dvh">
      <Header />

      <Box component="main" sx={{ flexGrow: 1, pt: "70px" }}>
        <HeroSection />
        <FeaturedEventsSection />
        
        <ExploreCategorySection />
        <WhyChooseSection />
      </Box>

      <Box sx={{ mt: "auto" }}>
        <Footer />
      </Box>
    </Box>
  );
}
