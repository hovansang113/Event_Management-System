export const API_ENDPOINTS = {
  ORGANIZER: {
    DASHBOARD: {
      STATS: 'organizer/dashboard/stats',
    },
    EVENTS: {
      LIST:     'organizer/events',
      CREATE:   'organizer/events',
      DETAIL:   (id) => `organizer/events/${id}`,
      UPDATE:   (id) => `organizer/events/${id}`,
      SUBMIT:   (id) => `organizer/events/${id}/submit`,
      CANCEL:   (id) => `organizer/events/${id}/cancel`,
    }
  }
}
