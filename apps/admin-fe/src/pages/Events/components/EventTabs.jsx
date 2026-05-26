import { Box, Tabs, Tab } from "@mui/material";

export const EventTabs = ({ activeTab, onTabChange, tabCounts }) => {
  const tabs = [
    { key: "all", label: "All Events", count: tabCounts?.all || 0 },
    { key: "pending", label: "Pending", count: tabCounts?.pending || 0 },
    { key: "published", label: "Published", count: tabCounts?.published || 0 },
    { key: "draft", label: "Draft", count: tabCounts?.draft || 0 },
    { key: "rejected", label: "Rejected", count: tabCounts?.rejected || 0 },
    { key: "cancelled", label: "Cancelled", count: tabCounts?.cancelled || 0 },
  ];

  const tabIndex = tabs.findIndex((t) => t.key === activeTab);

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
      <Tabs
        value={tabIndex === -1 ? 0 : tabIndex}
        onChange={(event, newValue) => onTabChange(tabs[newValue].key)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.key}
            label={`${tab.label} [${tab.count}]`}
            sx={{
              fontWeight: activeTab === tab.key ? 600 : 400,
              textTransform: "none",
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};
