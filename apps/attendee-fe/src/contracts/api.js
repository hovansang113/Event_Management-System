export const API_ENDPOINTS = {
  ATTENDEE: {
    EVENTS: {
      ALL: "attendee/events",
      GET: (id) => `attendee/events/${id}`,
    },
    CATEGORIES: {
      ALL: "attendee/categories",
    },
  },
};
