export const API_ENDPOINTS = {
  ATTENDEE: {
    EVENTS: {
      ALL: "attendee/events",
      GET: (id) => `attendee/events/${id}`,
      REGISTER: (id) => `attendee/events/${id}/register`,
      CANCEL: (id) => `attendee/registrations/${id}`,
      REGISTRATIONS: "attendee/registrations",
    },
    CATEGORIES: {
      ALL: "attendee/categories",
    },
  },
};
