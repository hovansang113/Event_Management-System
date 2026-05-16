export const API_ENDPOINTS = {
  ADMIN: {
    CATEGORIES: {
      ALL:    'admin/categories',
      ADD:    'admin/categories',
      UPDATE: (id) => `admin/categories/${id}`,   
      DELETE: (id) => `admin/categories/${id}`,   
    }
  }
}