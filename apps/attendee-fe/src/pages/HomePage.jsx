import { Box } from "@mui/material";
import { HeroSection, WhyChooseSection } from "../components/sections";
import { FeaturedEventsSection } from "../components/event";
import { ExploreCategorySection } from "../components/category";

export default function HomePage() {
  return (
    <Box component="main" sx={{ flexGrow: 1, pt: "70px" }}>
      <HeroSection />
      <FeaturedEventsSection />
      <ExploreCategorySection />
      <WhyChooseSection />
    </Box>
  );
}
