import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import SportsSoccerRoundedIcon from "@mui/icons-material/SportsSoccerRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";

const categoryIconMap = {
  Music: MusicNoteRoundedIcon,
  Sports: SportsSoccerRoundedIcon,
  Food: RestaurantRoundedIcon,
  Arts: PaletteRoundedIcon,
  Education: SchoolRoundedIcon,
  Community: GroupsRoundedIcon,
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    "& fieldset": { borderColor: "#E0E0E0" },
    "&:hover fieldset": { borderColor: "#E0E0E0" },
    "&.Mui-focused fieldset": { borderColor: "#007BFF" },
  },
  "& .MuiInputBase-input": {
    fontSize: 14,
    py: "8px",
    px: "12px",
  },
};

export default function EventsFilterSidebar(props) {
  const {
    search,
    onSearchChange,
    categories,
    selectedCategories,
    onToggleCategory,
    fromDate,
    toDate,
    onFromDateChange,
    onToDateChange,
    location,
    onLocationChange,
    onlyAvailable,
    onOnlyAvailableChange,
    hasFilters,
    onClearAll,
  } = props;

  return (
    <Box
      sx={{
        width: { xs: "100%", lg: 300 },
        boxSizing: "border-box",
        position: { lg: "sticky" },
        top: { lg: "90px" },
        alignSelf: "start",
        bgcolor: "#fff",
        border: "1px solid #E0E0E0",
        borderRadius: "12px",
        p: { xs: "18px", sm: "24px" },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#333333" }}>Filters</Typography>
        <Button onClick={onClearAll} sx={{ fontSize: 12, color: "#007BFF", textTransform: "none", minWidth: "auto", p: 0 }}>Clear All</Button>
      </Box>

      <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#333333", mb: 1 }}>Search</Typography>
      <TextField fullWidth size="small" placeholder="Search events..." value={search} onChange={(e) => onSearchChange(e.target.value)} sx={{ ...inputSx, mb: 2.5 }} />

      <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#333333", mb: 1.5 }}>Category</Typography>
      <Box sx={{ maxHeight: { xs: 210, lg: 256 }, overflowY: "auto", mb: 2.5 }}>
        {categories.map((category) => {
          const checked = selectedCategories.includes(category.name);
          const Icon = categoryIconMap[category.name] || LocalOfferRoundedIcon;
          return (
            <Box key={category.name} sx={{ p: 1, borderRadius: "8px", "&:hover": { bgcolor: "#F8F9FA" }, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <FormControlLabel
                sx={{ m: 0 }}
                control={<Checkbox size="small" checked={checked} onChange={() => onToggleCategory(category.name)} sx={{ p: 0.5, color: "#007BFF", "&.Mui-checked": { color: "#007BFF" }, "& .MuiSvgIcon-root": { fontSize: 16 } }} />}
                label={
                  <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
                    <Icon sx={{ fontSize: 20, color: "#333333" }} />
                    <Typography sx={{ fontSize: 14, color: "#333333", "&:hover": { color: "#007BFF" } }}>{category.name}</Typography>
                  </Box>
                }
              />
              <Typography sx={{ fontSize: 12, color: "#666666", bgcolor: "#F8F9FA", borderRadius: "9999px", px: 1, py: 0.25 }}>{category.count}</Typography>
            </Box>
          );
        })}
      </Box>

      <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#333333", mb: 1.5 }}>Date Range</Typography>
      <Typography sx={{ fontSize: 12, color: "#666666", mb: 0.6 }}>From</Typography>
      <TextField fullWidth size="small" type="date" value={fromDate} onChange={(e) => onFromDateChange(e.target.value)} sx={{ ...inputSx, mb: 1.2 }} />
      <Typography sx={{ fontSize: 12, color: "#666666", mb: 0.6 }}>To</Typography>
      <TextField fullWidth size="small" type="date" value={toDate} onChange={(e) => onToDateChange(e.target.value)} sx={{ ...inputSx, mb: 2.5 }} />

      <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#333333", mb: 1.5 }}>Location</Typography>
      <TextField fullWidth size="small" placeholder="Enter location..." value={location} onChange={(e) => onLocationChange(e.target.value)} sx={{ ...inputSx, mb: 2 }} />

      <Box sx={{ p: 1, borderRadius: "8px", "&:hover": { bgcolor: "#F8F9FA" }, mb: 2 }}>
        <FormControlLabel
          sx={{ m: 0 }}
          control={<Checkbox size="small" checked={onlyAvailable} onChange={(e) => onOnlyAvailableChange(e.target.checked)} sx={{ p: 0.5, color: "#007BFF", "&.Mui-checked": { color: "#007BFF" }, "& .MuiSvgIcon-root": { fontSize: 16 } }} />}
          label={<Typography sx={{ fontSize: 14, color: "#333333" }}>Only show available events</Typography>}
        />
      </Box>

      {hasFilters ? (
        <Button fullWidth variant="contained" sx={{ textTransform: "none", bgcolor: "#007BFF", py: 1.1, fontWeight: 700, "&:hover": { bgcolor: "#0056B3" } }}>
          Apply Filters
        </Button>
      ) : null}
    </Box>
  );
}
