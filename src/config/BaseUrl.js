// src/config/api.js

const API_BASE_URL = 'http://localhost:8000'; 

export const API_ROUTES = {
  // Rutas públicas
  REGISTER: `${API_BASE_URL}/api/register`,
  LOGIN: `${API_BASE_URL}/api/login`,
  MENUS_PUBLIC: `${API_BASE_URL}/api/menus-public`,
  ALLERGIES_PUBLIC: `${API_BASE_URL}/api/allergies-public`,
  LOCATIONS_PUBLIC: `${API_BASE_URL}/api/locations-public`,
  USER_DATE_PUBLIC: `${API_BASE_URL}/api/user-date-public`,
  CREATE_GUEST_WITH_PLUS_ONE: `${API_BASE_URL}/api/guests-with-plus-one`,
  BANK_ACCOUNT_PUBLIC: `${API_BASE_URL}/api/bank-account-public`,
  GIFT_LIST_URL_PUBLIC: `${API_BASE_URL}/api/gift-list-url-public`,

  // Rutas protegidas
  USER: `${API_BASE_URL}/api/user`,
  LOGOUT: `${API_BASE_URL}/api/logout`,
  LOCATIONS: `${API_BASE_URL}/api/locations`,
  MENUS: `${API_BASE_URL}/api/menus`,
  ALLERGIES: `${API_BASE_URL}/api/allergies`,
  GUESTS: `${API_BASE_URL}/api/guests`,
  VALIDATE_GUEST: (guestId) => `${API_BASE_URL}/api/guests/${guestId}/validate`,
  PLUS_ONES: `${API_BASE_URL}/api/plus-ones`,
  USERS: `${API_BASE_URL}/api/users`,
  UPDATE_USER_DATE: `${API_BASE_URL}/api/user/update-date`,
  CHANGE_PASSWORD: `${API_BASE_URL}/api/user/change-password`,
  UPDATE_GIFT_INFO: `${API_BASE_URL}/api/user/update-gift-info`,
  TAGS: `${API_BASE_URL}/api/tags`,
  ASSIGN_TAG: (guestId) => `${API_BASE_URL}/api/guests/${guestId}/assign-tag`,
  REMOVE_TAG: (guestId) => `${API_BASE_URL}/api/guests/${guestId}/remove-tag`,
};

export default API_ROUTES;