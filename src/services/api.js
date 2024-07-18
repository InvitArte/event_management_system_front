// src/services/api.js

import axios from "axios";
import API_ROUTES from "../config/BaseUrl";

const axiosInstance = axios.create({
  baseURL: API_ROUTES.BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor para añadir el token de autenticación
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Servicios de Autenticación
export const authService = {
  register: (userData) => axiosInstance.post(API_ROUTES.REGISTER, userData),
  login: (email, password) =>
    axiosInstance.post(API_ROUTES.LOGIN, { email, password }),
  logout: () => axiosInstance.post(API_ROUTES.LOGOUT),
};

// Servicios de Usuario
export const userService = {
  getCurrentUser: () => axiosInstance.get(API_ROUTES.USER),
  getAllUsers: () => axiosInstance.get(API_ROUTES.USERS),
  getUser: (userId) => axiosInstance.get(`${API_ROUTES.USERS}/${userId}`),
  updateUser: (userId, userData) =>
    axiosInstance.put(`${API_ROUTES.USERS}/${userId}`, userData),
  deleteUser: (userId) => axiosInstance.delete(`${API_ROUTES.USERS}/${userId}`),
  updateDate: (date) =>
    axiosInstance.put(API_ROUTES.UPDATE_USER_DATE, { date }),
  changePassword: (currentPassword, newPassword) =>
    axiosInstance.put(API_ROUTES.CHANGE_PASSWORD, {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: newPassword,
    }),
  updateGiftInfo: (giftInfo) =>
    axiosInstance.put(API_ROUTES.UPDATE_GIFT_INFO, giftInfo),
};

// Servicios de Invitados
export const guestService = {
  getAllGuests: () => axiosInstance.get(API_ROUTES.GUESTS),
  getGuest: (guestId) => axiosInstance.get(`${API_ROUTES.GUESTS}/${guestId}`),
  createGuest: (guestData) => axiosInstance.post(API_ROUTES.GUESTS, guestData),
  updateGuest: (guestId, guestData) =>
    axiosInstance.put(`${API_ROUTES.GUESTS}/${guestId}`, guestData),
  deleteGuest: (guestId) =>
    axiosInstance.delete(`${API_ROUTES.GUESTS}/${guestId}`),
  validateGuest: (guestId) =>
    axiosInstance.put(`${API_ROUTES.GUESTS}/${guestId}/validate`),
  bulkValidate: (guestIds) =>
    axiosInstance.post(API_ROUTES.BULK_VALIDATE_GUESTS, {
      guest_ids: guestIds,
    }),
};

// Servicios de Acompañantes (Plus Ones)
export const plusOneService = {
  getAllPlusOnes: () => axiosInstance.get(API_ROUTES.PLUS_ONES),
  getPlusOne: (plusOneId) =>
    axiosInstance.get(`${API_ROUTES.PLUS_ONES}/${plusOneId}`),
  createPlusOne: (plusOneData) =>
    axiosInstance.post(API_ROUTES.PLUS_ONES, plusOneData),
  updatePlusOne: (plusOneId, plusOneData) =>
    axiosInstance.put(`${API_ROUTES.PLUS_ONES}/${plusOneId}`, plusOneData),
  deletePlusOne: (plusOneId) =>
    axiosInstance.delete(`${API_ROUTES.PLUS_ONES}/${plusOneId}`),
};

// Servicios de Alergias
export const allergyService = {
  getAllAllergies: () => axiosInstance.get(API_ROUTES.ALLERGIES),
  getAllergy: (allergyId) =>
    axiosInstance.get(`${API_ROUTES.ALLERGIES}/${allergyId}`),
  createAllergy: (allergyData) =>
    axiosInstance.post(API_ROUTES.ALLERGIES, allergyData),
  updateAllergy: (allergyId, allergyData) =>
    axiosInstance.put(`${API_ROUTES.ALLERGIES}/${allergyId}`, allergyData),
  deleteAllergy: (allergyId) =>
    axiosInstance.delete(`${API_ROUTES.ALLERGIES}/${allergyId}`),
};

// Servicios de Ubicaciones
export const locationService = {
  getAllLocations: () => axiosInstance.get(API_ROUTES.LOCATIONS),
  getLocation: (locationId) =>
    axiosInstance.get(`${API_ROUTES.LOCATIONS}/${locationId}`),
  createLocation: (locationData) =>
    axiosInstance.post(API_ROUTES.LOCATIONS, locationData),
  updateLocation: (locationId, locationData) =>
    axiosInstance.put(`${API_ROUTES.LOCATIONS}/${locationId}`, locationData),
  deleteLocation: (locationId) =>
    axiosInstance.delete(`${API_ROUTES.LOCATIONS}/${locationId}`),
};

// Servicios de Menús
export const menuService = {
  getAllMenus: () => axiosInstance.get(API_ROUTES.MENUS),
  getMenu: (menuId) => axiosInstance.get(`${API_ROUTES.MENUS}/${menuId}`),
  createMenu: (menuData) => axiosInstance.post(API_ROUTES.MENUS, menuData),
  updateMenu: (menuId, menuData) =>
    axiosInstance.put(`${API_ROUTES.MENUS}/${menuId}`, menuData),
  deleteMenu: (menuId) => axiosInstance.delete(`${API_ROUTES.MENUS}/${menuId}`),
};

// Servicios Públicos
export const publicService = {
  getPublicMenus: () => axiosInstance.get(API_ROUTES.MENUS_PUBLIC),
  getPublicAllergies: () => axiosInstance.get(API_ROUTES.ALLERGIES_PUBLIC),
  getPublicLocations: (userId) =>
    axiosInstance.get(API_ROUTES.LOCATIONS_PUBLIC, {
      params: { user_id: userId },
    }),
  getUserDate: (userId) =>
    axiosInstance.get(API_ROUTES.USER_DATE_PUBLIC, {
      params: { user_id: userId },
    }),
  getUserBankAccount: (userId) =>
    axiosInstance.get(API_ROUTES.BANK_ACCOUNT_PUBLIC, {
      params: { user_id: userId },
    }),
  getUserGiftListUrl: (userId) =>
    axiosInstance.get(API_ROUTES.GIFT_LIST_URL_PUBLIC, {
      params: { user_id: userId },
    }),
  createGuestWithPlusOne: (guestData, plusOneData) =>
    axiosInstance.post(API_ROUTES.CREATE_GUEST_WITH_PLUS_ONE, {
      guest: guestData,
      plus_one: plusOneData,
    }),
};

// Servicios de Etiquetas
export const tagService = {
  getAllTags: () => axiosInstance.get(API_ROUTES.TAGS),
  getTag: (tagId) => axiosInstance.get(`${API_ROUTES.TAGS}/${tagId}`),
  createTag: (tagData) => axiosInstance.post(API_ROUTES.TAGS, tagData),
  updateTag: (tagId, tagData) =>
    axiosInstance.put(`${API_ROUTES.TAGS}/${tagId}`, tagData),
  deleteTag: (tagId) => axiosInstance.delete(`${API_ROUTES.TAGS}/${tagId}`),
  assignTag: (guestId, tagId) =>
    axiosInstance.post(API_ROUTES.ASSIGN_TAG(guestId), { tag_id: tagId }),
  removeTag: (guestId, tagId) =>
    axiosInstance.post(API_ROUTES.REMOVE_TAG(guestId), { tag_id: tagId }),
  bulkAssign: (tagId, guestIds) =>
    axiosInstance.post(API_ROUTES.BULK_ASSIGN_TAG, {
      tag_id: tagId,
      guest_ids: guestIds,
    }),
};

export default {
  auth: authService,
  user: userService,
  guest: guestService,
  plusOne: plusOneService,
  allergy: allergyService,
  location: locationService,
  menu: menuService,
  public: publicService,
  tag: tagService,
};
