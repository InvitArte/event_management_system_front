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
  menu: true,
  allergy: true,
  needs_hotel: true,
  needs_transport: true,
  disability: true,
  observations: true,
  accommodation_plan: true,
  isMainGuest: true,
  tags: true,
};

//configuración de los filtros de la vista de invitados
export const guestViewFilters = {
  full_name: true,
  phone: true,
  menu: true,
  allergy: true,
  needs_hotel: true,
  needs_transport: true,
  validated: true,
  tags: true,
  accommodation_plan: true,
};

//configuración de los campos del formulario de invitados
export const guestFormFields = {
  first_name: true,
  last_name: true,
  phone: true,
  email: true,
  needs_transport: true,
  needs_hotel: true,
  disability: true,
  menu: true,
  allergy: true,
  observations: true,
  accommodation_plan: true,
  tags: true,
  plus_ones: true,
  plus_one_first_name: true,
  plus_one_last_name: true,
  plus_one_menu: true,
  plus_one_allergy: true,
  plus_one_disability: true,
};

//configuración de los campos de la vista de perfil
export const profileViewFields = {
  bankAccount: true,
  giftList: true,
};
