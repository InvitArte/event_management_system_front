const LOCAL_HOST = "localhost:5173";
const API_BASE_URL =
  window.location.host === LOCAL_HOST
    ? "http://127.0.0.1:8000"
    : "https://api.invitartedesign.com";

//http://127.0.0.1:8000

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
  UPDATE_PASSWORD: `${API_BASE_URL}/api/update-password`,
  MENUS: `${API_BASE_URL}/api/menus`,
  ALLERGIES: `${API_BASE_URL}/api/allergies`,
  GUESTS: `${API_BASE_URL}/api/guests`,
  VALIDATE_GUEST: (guestId) => `${API_BASE_URL}/api/guests/${guestId}/validate`,
  BULK_VALIDATE_GUESTS: `${API_BASE_URL}/api/guests/bulk-validate`,
  PLUS_ONES: `${API_BASE_URL}/api/plus-ones`,
  USERS: `${API_BASE_URL}/api/users`,
  UPDATE_USER_DATE: `${API_BASE_URL}/api/user/update-date`,
  CHANGE_PASSWORD: `${API_BASE_URL}/api/user/change-password`,
  UPDATE_GIFT_INFO: `${API_BASE_URL}/api/user/update-gift-info`,
  TAGS: `${API_BASE_URL}/api/tags`,
  ASSIGN_TAG: (guestId) => `${API_BASE_URL}/api/guests/${guestId}/assign-tag`,
  REMOVE_TAG: (guestId) => `${API_BASE_URL}/api/guests/${guestId}/remove-tag`,
  BULK_ASSIGN_TAG: `${API_BASE_URL}/api/tags/bulk-assign`,
};

export default API_ROUTES;
