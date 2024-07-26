//configuración del user para la vista pública
export const userId = 2;
//configuración del limite de más uno por invitado
export const numPlusOne = 1;

//configuración de las columnas de la tabla de invitados
export const guestViewColumns = {
  id: true,
  fullName: true,
  email: true,
  phone: true,
  validated: true,
  menu: false,
  allergy: false,
  needs_hotel: false,
  needs_transport: false,
  disability: false,
  observations: true,
  accommodation_plan: false,
  isMainGuest: true,
  tags: true,
};

//configuración de los filtros de la vista de invitados
export const guestViewFilters = {
  full_name: true,
  phone: true,
  menu: false,
  allergy: false,
  needs_hotel: false,
  needs_transport: false,
  validated: true,
  tags: true,
  accommodation_plan: false,
};

//configuración de los campos del formulario de invitados
export const guestFormFields = {
  first_name: true,
  last_name: true,
  phone: true,
  email: true,
  needs_transport: false,
  needs_hotel: false,
  disability: false,
  menu: false,
  allergy: false,
  observations: true,
  accommodation_plan: false,
  tags: true,
  plus_ones: true,
  plus_one_first_name: true,
  plus_one_last_name: true,
  plus_one_menu: false,
  plus_one_allergy: false,
  plus_one_disability: false,
};

//configuración de los campos de la vista de perfil
export const profileViewFields = {
  bankAccount: false,
  giftList: false,
};
