import { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { categoryService } from "../../services/categoryService";
import { eventService } from "../../services/eventService";

const fallbackCategories = [
  { id: 1, name: "Music", icon: "🎵", events_count: 45 },
  { id: 2, name: "Sports", icon: "⚽", events_count: 32 },
  { id: 3, name: "Food", icon: "🍕", events_count: 28 },
  { id: 4, name: "Arts", icon: "🎨", events_count: 21 },
  { id: 5, name: "Education", icon: "🎓", events_count: 18 },
  { id: 6, name: "Community", icon: "🤝", events_count: 15 },
];

const iconMap = {
  music: "🎵",
  sports: "⚽",
  food: "🍕",
  arts: "🎨",
  education: "🎓",
  community: "🤝",
  business: "💼",
  technology: "💻"
};

const categoryEventFilters = { per_page: 200, sort: "newest" };

const mapCategories = (rows, events) => {
  if (!Array.isArray(rows) || rows.length === 0) return [];

  const countByCategoryId = events.reduce((acc, event) => {
    const cid = event?.category?.id;
    if (!cid) return acc;
    acc[cid] = (acc[cid] || 0) + 1;
    return acc;
  }, {});

  return rows.slice(0, 6).map((item, index) => ({
    id: item.id,
    name: item.name,
    icon: item.icon || iconMap[(item.slug || item.name || "").toLowerCase()] || fallbackCategories[index % fallbackCategories.length].icon,
    events_count: Number(countByCategoryId[item.id] ?? item.events_count ?? 0)
  }));
};

const getInitialCategories = () => {
  const categoryResp = categoryService.peekAll();
  const eventResp = eventService.peekAll(categoryEventFilters);
  const rows = categoryResp?.data ?? [];
  const events = eventResp?.data?.data ?? [];
  return mapCategories(rows, events);
};

export default function ExploreCategorySection() {
  const [categories, setCategories] = useState(getInitialCategories);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const [categoryResp, eventResp] = await Promise.all([
          categoryService.getAll(),
          eventService.getAll(categoryEventFilters)
        ]);

        const rows = categoryResp?.data ?? [];
        const events = eventResp?.data?.data ?? [];

        if (!Array.isArray(rows) || rows.length === 0) {
          setCategories(fallbackCategories);
          return;
        }

        setCategories(mapCategories(rows, events));
      } catch {
        setCategories(fallbackCategories);
      }
    };

    loadCategories();
  }, []);

  return (
    <Box sx={{ background: "linear-gradient(to bottom right, #F8F9FA, #ffffff)", py: { xs: "48px", md: "64px" }, px: { xs: "18px", sm: "24px" } }}>
      <Container maxWidth={false} sx={{ maxWidth: "1200px", px: 0 }}>
        <Box>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography sx={{ fontSize: { xs: 30, md: 36 }, lineHeight: 1.15, fontWeight: 700, color: "#333333" }}>
              Explore by Category
            </Typography>
            <Typography sx={{ color: "#666666", fontSize: 14, mt: 0.7 }}>
              Find events that match your interests and passions
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", lg: "repeat(6, 1fr)" },
              gap: { xs: "12px", sm: "16px" }
            }}
          >
            {categories.map((category) => (
              <Box
                key={category.id}
                sx={{
                  bgcolor: "#fff",
                  border: "1px solid #E0E0E0",
                  borderRadius: "16px",
                  py: { xs: "18px", sm: "24px" },
                  px: { xs: "12px", sm: "24px" },
                  textAlign: "center",
                  transition: "all 220ms ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-4px) scale(1.05)",
                    boxShadow: "0 16px 28px rgba(16,24,40,0.16)",
                  }
                }}
              >
                {String(category.icon).startsWith("http") ? (
                  <Box
                    component="img"
                    src={category.icon}
                    alt={category.name}
                    sx={{ width: 36, height: 36, objectFit: "contain", mb: 1 }}
                  />
                ) : (
                  <Typography sx={{ fontSize: { xs: 38, sm: 48 }, lineHeight: 1, mb: 1 }}>{category.icon}</Typography>
                )}
                <Typography sx={{ fontWeight: 700, fontSize: { xs: 14, sm: 16 }, color: "#333333" }}>{category.name}</Typography>
                <Typography sx={{ color: "#666666", fontSize: 12, mt: 0.3 }}>{category.events_count} events</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
