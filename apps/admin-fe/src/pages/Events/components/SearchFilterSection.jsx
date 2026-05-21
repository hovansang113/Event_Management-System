import { Box, TextField, Select, MenuItem, Typography, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useCallback } from "react";

export const SearchFilterSection = ({
  onSearchChange,
  onCategoryChange,
  categories = [],
  totalResults = 0,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleSearch = useCallback(
    (value) => {
      setSearchTerm(value);
      onSearchChange(value);
    },
    [onSearchChange]
  );

  const handleCategoryChange = useCallback(
    (event) => {
      const value = event.target.value;
      setSelectedCategory(value);
      onCategoryChange(value);
    },
    [onCategoryChange]
  );

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
        <TextField
          placeholder="Search by event name, organizer or category..."
          fullWidth
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "gray" }} />,
          }}
          sx={{ flex: 1 }}
        />

        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          size="small"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">All Categories</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.slug}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Typography variant="body2" color="textSecondary">
        {totalResults} events
      </Typography>
    </Paper>
  );
};
