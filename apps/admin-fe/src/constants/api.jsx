export const API_ENDPOINTS = {
  ADMIN: {
    DASHBOARD: {
      STATS:      'admin/dashboard/stats',
      OVERVIEW:   'admin/dashboard/overview',
    },
    CATEGORIES: {
      ALL:        'admin/categories',
      ADD:        'admin/categories',
      UPDATE:     (id) => `admin/categories/${id}`,   
      DELETE:     (id) => `admin/categories/${id}`,
      RESTORE:    (id) => `admin/categories/${id}/restore`,
      ACTIVATE:   (id) => `admin/categories/${id}/activate`,
      DEACTIVATE: (id) => `admin/categories/${id}/deactivate`,
    },
    EVENTS: {
      ALL:        'admin/events',
      GET:        (id) => `admin/events/${id}`,
      APPROVE:    (id) => `admin/events/${id}/approve`,
      REJECT:     (id) => `admin/events/${id}/reject`,
      DELETE:     (id) => `admin/events/${id}`,
      AUDIT_LOG:  'admin/audit-log',
    }
  }
}
