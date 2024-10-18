// Bibliotetas de terceros
import axios from "axios";
import { toast } from "react-toastify";

import { API_ROUTES, translateError, defaultConfig } from "../config";
const axiosInstance = axios.create({
  baseURL: API_ROUTES.BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

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

const handleApiError = (error, serviceName) => {
  console.error(`Error in ${serviceName}:`, error);
  if (error.response) {
    console.error("Response data:", error.response.data);
    console.error("Response status:", error.response.status);
    console.error("Response headers:", error.response.headers);
    const translatedError = translateError(error);
    toast.error(`Error: ${translatedError}`);
  } else if (error.request) {
    console.error("No se recibió respuesta:", error.request);
    toast.error("No hubo respuesta del servidor");
  } else {
    console.error("Error setting up request:", error.message);
    toast.error("Error al realizar la petición");
  }
  throw error;
};

export const authService = {
  register: async (userData) => {
    try {
      const response = await axiosInstance.post(API_ROUTES.REGISTER, userData);
      toast.success("Registro exitoso");
      return response.data;
    } catch (error) {
      return handleApiError(error, "register");
    }
  },
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post(API_ROUTES.LOGIN, {
        email,
        password,
      });
      toast.success("Login correcto");
      return response.data;
    } catch (error) {
      return handleApiError(error, "login");
    }
  },
  logout: async () => {
    try {
      const response = await axiosInstance.post(API_ROUTES.LOGOUT);
      // Clear local storage
      localStorage.removeItem("token");
      // Clear any other stored user data
      localStorage.removeItem("user");
      // Reset axios instance
      axiosInstance.defaults.headers["Authorization"] = null;
      toast.success("Logout correcto");
      return response.data;
    } catch (error) {
      return handleApiError(error, "logout");
    }
  },

  updatePassword: async (
    currentPassword,
    newPassword,
    newPasswordConfirmation
  ) => {
    try {
      const response = await axiosInstance.post(API_ROUTES.UPDATE_PASSWORD, {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation,
      });
      toast.success("Contraseña actualizada correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "updatePassword");
    }
  },
};

export const userService = {
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get(API_ROUTES.USER);
      return response.data;
    } catch (error) {
      return handleApiError(error, "getCurrentUser");
    }
  },
  getAllUsers: async () => {
    try {
      const response = await axiosInstance.get(API_ROUTES.USERS);
      return response.data;
    } catch (error) {
      return handleApiError(error, "getAllUsers");
    }
  },
  getUser: async (userId) => {
    try {
      const response = await axiosInstance.get(`${API_ROUTES.USERS}/${userId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, "getUser");
    }
  },
  updateUser: async (userId, userData) => {
    try {
      const response = await axiosInstance.put(
        `${API_ROUTES.USERS}/${userId}`,
        userData
      );
      toast.success("Usuario actualizado correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "updateUser");
    }
  },
  deleteUser: async (userId) => {
    try {
      const response = await axiosInstance.delete(
        `${API_ROUTES.USERS}/${userId}`
      );
      toast.success("Usario eliminado correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "deleteUser");
    }
  },
  updateDate: async (date) => {
    try {
      const response = await axiosInstance.put(API_ROUTES.UPDATE_USER_DATE, {
        date,
      });
      toast.success("Fecha actualizada correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "updateDate");
    }
  },
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await axiosInstance.put(API_ROUTES.CHANGE_PASSWORD, {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPassword,
      });
      toast.success("Contrasena actualizada correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "changePassword");
    }
  },
  updateGiftInfo: async (giftInfo) => {
    try {
      const response = await axiosInstance.put(
        API_ROUTES.UPDATE_GIFT_INFO,
        giftInfo
      );
      toast.success("Información de regalos actualizada correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "updateGiftInfo");
    }
  },
};

export const guestService = {
  getAllGuests: async () => {
    try {
      const response = await axiosInstance.get(API_ROUTES.GUESTS);
      return response.data;
    } catch (error) {
      return handleApiError(error, "getAllGuests");
    }
  },
  getGuest: async (guestId) => {
    try {
      const response = await axiosInstance.get(
        `${API_ROUTES.GUESTS}/${guestId}`
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, "getGuest");
    }
  },
  createGuest: async (guestData) => {
    try {
      const response = await axiosInstance.post(API_ROUTES.GUESTS, guestData);
      toast.success("Invitado creado correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "createGuest");
    }
  },
  updateGuest: async (guestId, guestData) => {
    try {
      const response = await axiosInstance.put(
        `${API_ROUTES.GUESTS}/${guestId}`,
        guestData
      );
      toast.success("Invitado actualizado correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "updateGuest");
    }
  },
  deleteGuest: async (guestId) => {
    try {
      const response = await axiosInstance.delete(
        `${API_ROUTES.GUESTS}/${guestId}`
      );
      toast.success("Invitado eliminado correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "deleteGuest");
    }
  },
  validateGuest: async (guestId) => {
    try {
      const response = await axiosInstance.put(
        `${API_ROUTES.GUESTS}/${guestId}/validate`
      );
      toast.success("Invitado validado correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "validateGuest");
    }
  },
  bulkValidate: async (guestIds) => {
    try {
      const response = await axiosInstance.post(
        API_ROUTES.BULK_VALIDATE_GUESTS,
        {
          guest_ids: guestIds,
        }
      );
      toast.success("Invitados validados correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "bulkValidate");
    }
  },
};

export const plusOneService = {
  getAllPlusOnes: async () => {
    try {
      const response = await axiosInstance.get(API_ROUTES.PLUS_ONES);
      return response.data;
    } catch (error) {
      return handleApiError(error, "getAllPlusOnes");
    }
  },
  getPlusOne: async (plusOneId) => {
    try {
      const response = await axiosInstance.get(
        `${API_ROUTES.PLUS_ONES}/${plusOneId}`
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, "getPlusOne");
    }
  },
  createPlusOne: async (plusOneData) => {
    try {
      const response = await axiosInstance.post(
        API_ROUTES.PLUS_ONES,
        plusOneData
      );
      toast.success("Más uno creado correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "createPlusOne");
    }
  },
  updatePlusOne: async (plusOneId, plusOneData) => {
    try {
      const response = await axiosInstance.put(
        `${API_ROUTES.PLUS_ONES}/${plusOneId}`,
        plusOneData
      );
      toast.success("Más uno actualizado correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "updatePlusOne");
    }
  },
  deletePlusOne: async (plusOneId) => {
    try {
      const response = await axiosInstance.delete(
        `${API_ROUTES.PLUS_ONES}/${plusOneId}`
      );
      toast.success("Mas uno actualizado correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "deletePlusOne");
    }
  },
};

export const allergyService = {
  getAllAllergies: async () => {
    try {
      const response = await axiosInstance.get(API_ROUTES.ALLERGIES);
      return response.data;
    } catch (error) {
      return handleApiError(error, "getAllAllergies");
    }
  },
  getAllergy: async (allergyId) => {
    try {
      const response = await axiosInstance.get(
        `${API_ROUTES.ALLERGIES}/${allergyId}`
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, "getAllergy");
    }
  },
  createAllergy: async (allergyData) => {
    try {
      const response = await axiosInstance.post(
        API_ROUTES.ALLERGIES,
        allergyData
      );
      toast.success("Alergia creada correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "createAllergy");
    }
  },
  updateAllergy: async (allergyId, allergyData) => {
    try {
      const response = await axiosInstance.put(
        `${API_ROUTES.ALLERGIES}/${allergyId}`,
        allergyData
      );
      toast.success("Alergia actualizada correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "updateAllergy");
    }
  },
  deleteAllergy: async (allergyId) => {
    try {
      const response = await axiosInstance.delete(
        `${API_ROUTES.ALLERGIES}/${allergyId}`
      );
      toast.success("Alergia eliminada correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "deleteAllergy");
    }
  },
};

export const locationService = {
  getAllLocations: async () => {
    try {
      const response = await axiosInstance.get(API_ROUTES.LOCATIONS);
      return response.data;
    } catch (error) {
      return handleApiError(error, "getAllLocations");
    }
  },
  getLocation: async (locationId) => {
    try {
      const response = await axiosInstance.get(
        `${API_ROUTES.LOCATIONS}/${locationId}`
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, "getLocation");
    }
  },
  createLocation: async (locationData) => {
    try {
      const response = await axiosInstance.post(
        API_ROUTES.LOCATIONS,
        locationData
      );
      toast.success("Ubicación creada correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "createLocation");
    }
  },
  updateLocation: async (locationId, locationData) => {
    try {
      const response = await axiosInstance.put(
        `${API_ROUTES.LOCATIONS}/${locationId}`,
        locationData
      );
      toast.success("Ubicación actualizada correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "updateLocation");
    }
  },
  deleteLocation: async (locationId) => {
    try {
      const response = await axiosInstance.delete(
        `${API_ROUTES.LOCATIONS}/${locationId}`
      );
      toast.success("Ubicación eliminada correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "deleteLocation");
    }
  },
};

export const menuService = {
  getAllMenus: async () => {
    try {
      const response = await axiosInstance.get(API_ROUTES.MENUS);
      return response.data;
    } catch (error) {
      return handleApiError(error, "getAllMenus");
    }
  },
  getMenu: async (menuId) => {
    try {
      const response = await axiosInstance.get(`${API_ROUTES.MENUS}/${menuId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, "getMenu");
    }
  },
  createMenu: async (menuData) => {
    try {
      const response = await axiosInstance.post(API_ROUTES.MENUS, menuData);
      toast.success("Menú creado correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "createMenu");
    }
  },
  updateMenu: async (menuId, menuData) => {
    try {
      const response = await axiosInstance.put(
        `${API_ROUTES.MENUS}/${menuId}`,
        menuData
      );
      toast.success("Menú actualizado correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "updateMenu");
    }
  },
  deleteMenu: async (menuId) => {
    try {
      const response = await axiosInstance.delete(
        `${API_ROUTES.MENUS}/${menuId}`
      );
      toast.success("Menú eliminado correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "deleteMenu");
    }
  },
  // Nuevo método para obtener los menús del usuario actual
  getUserMenus: async () => {
    try {
      const response = await axiosInstance.get(API_ROUTES.MENUS);
      return response.data;
    } catch (error) {
      console.error("Error in getUserMenus:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
      // Retornar un array vacío en caso de error
      return [];
    }
  },

};

export const publicService = {
  getPublicMenus: async (userId = defaultConfig.userId) => {
    try {
      const response = await axiosInstance.get(API_ROUTES.MENUS_PUBLIC, {
        params: { user_id: userId },
      });
      return response.data;
    } catch (error) {
      console.error("Error in getPublicMenus:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
      return []; // Retornamos un array vacío en caso de error
    }
  },
  getPublicAllergies: async () => {
    try {
      const response = await axiosInstance.get(API_ROUTES.ALLERGIES_PUBLIC);
      return response.data;
    } catch (error) {
      console.error("Error in getPublicAllergies:", error);
      throw error;
    }
  },
  getPublicLocations: async (userId = defaultConfig.userId) => {
    try {
      const response = await axiosInstance.get(API_ROUTES.LOCATIONS_PUBLIC, {
        params: { user_id: userId },
      });
      return response.data;
    } catch (error) {
      console.error("Error in getPublicLocations:", error);
      throw error;
    }
  },
  getUserDate: async (userId = defaultConfig.userId) => {
    try {
      const response = await axiosInstance.get(API_ROUTES.USER_DATE_PUBLIC, {
        params: { user_id: userId },
      });
      return response.data;
    } catch (error) {
      console.error("Error in getUserDate:", error);
      throw error;
    }
  },
  getUserBankAccount: async (userId) => {
    try {
      const response = await axiosInstance.get(API_ROUTES.BANK_ACCOUNT_PUBLIC, {
        params: { user_id: userId },
      });
      return response.data;
    } catch (error) {
      console.error("Error in getUserBankAccount:", error);
      throw error;
    }
  },
  getUserGiftListUrl: async (userId) => {
    try {
      const response = await axiosInstance.get(
        API_ROUTES.GIFT_LIST_URL_PUBLIC,
        {
          params: { user_id: userId },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in getUserGiftListUrl:", error);
      throw error;
    }
  },
  createGuestWithPlusOne: async (guestData, plusOneData) => {
    try {
      const response = await axiosInstance.post(
        API_ROUTES.CREATE_GUEST_WITH_PLUS_ONE,
        {
          guest: guestData,
          plus_one: plusOneData,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in createGuestWithPlusOne:", error);
      throw error;
    }
  },
};

export const tagService = {
  getAllTags: async () => {
    try {
      const response = await axiosInstance.get(API_ROUTES.TAGS);
      return response.data;
    } catch (error) {
      return handleApiError(error, "getAllTags");
    }
  },
  getTag: async (tagId) => {
    try {
      const response = await axiosInstance.get(`${API_ROUTES.TAGS}/${tagId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, "getTag");
    }
  },
  createTag: async (tagData) => {
    try {
      const response = await axiosInstance.post(API_ROUTES.TAGS, tagData);
      toast.success("Etiqueta creada correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "createTag");
    }
  },
  updateTag: async (tagId, tagData) => {
    try {
      const response = await axiosInstance.put(
        `${API_ROUTES.TAGS}/${tagId}`,
        tagData
      );
      toast.success("Etiqueta actualizada correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "updateTag");
    }
  },
  deleteTag: async (tagId) => {
    try {
      const response = await axiosInstance.delete(
        `${API_ROUTES.TAGS}/${tagId}`
      );
      toast.success("Etiqueta eliminada correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "deleteTag");
    }
  },
  assignTag: async (guestId, tagId) => {
    try {
      const response = await axiosInstance.post(
        API_ROUTES.ASSIGN_TAG(guestId),
        { tag_id: tagId }
      );
      toast.success("Etiqueta asignada correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "assignTag");
    }
  },
  removeTag: async (guestId, tagId) => {
    try {
      const response = await axiosInstance.post(
        API_ROUTES.REMOVE_TAG(guestId),
        { tag_id: tagId }
      );
      toast.success("Etiqueta removida correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "removeTag");
    }
  },
  bulkAssign: async (tagId, guestIds) => {
    try {
      const response = await axiosInstance.post(API_ROUTES.BULK_ASSIGN_TAG, {
        tag_id: tagId,
        guest_ids: guestIds,
      });
      toast.success("Etiquetas asignadas correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "bulkAssign");
    }
  },
};
export const contactService = {
  getAllContacts: async () => {
    try {
      const response = await axiosInstance.get(API_ROUTES.CONTACTS);
      return response.data;
    } catch (error) {
      return handleApiError(error, "getAllContacts");
    }
  },
  getContact: async (contactId) => {
    try {
      const response = await axiosInstance.get(
        `${API_ROUTES.CONTACTS}/${contactId}`
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, "getContact");
    }
  },
  createContact: async (contactData) => {
    try {
      const response = await axiosInstance.post(
        API_ROUTES.CONTACTS,
        contactData
      );
      toast.success("Contacto creado correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "createContact");
    }
  },
  updateContact: async (contactId, contactData) => {
    try {
      const response = await axiosInstance.put(
        `${API_ROUTES.CONTACTS}/${contactId}`,
        contactData
      );
      toast.success("Contacto actualizado correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "updateContact");
    }
  },
  deleteContact: async (contactId) => {
    try {
      const response = await axiosInstance.delete(
        `${API_ROUTES.CONTACTS}/${contactId}`
      );
      toast.success("Contacto eliminado correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "deleteContact");
    }
  },
};

export const userConfigService = {
  getUserConfig: async () => {
    try {
      const response = await axiosInstance.get(API_ROUTES.USER_CONFIG);
      return response.data;
    } catch (error) {
      console.error("Error fetching user config:", error);
      // Si hay un error, devolvemos la configuración por defecto
      return defaultConfig;
    }
  },
  updateUserConfig: async (configData) => {
    try {
      const response = await axiosInstance.put(
        API_ROUTES.USER_CONFIG,
        configData
      );
      toast.success("Configuración actualizada correctamente");
      return response.data;
    } catch (error) {
      return handleApiError(error, "updateUserConfig");
    }
  },
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
  contact: contactService,
  userConfig: userConfigService,
};
