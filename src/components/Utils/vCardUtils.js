/**
 * Genera una cadena de texto en formato vCard a partir de los datos de un contacto.
 * @param {Object} contact - El objeto de contacto.
 * @param {string} contact.name - El nombre del contacto.
 * @param {string} contact.phone - El número de teléfono del contacto.
 * @param {string} contact.email - La dirección de correo electrónico del contacto.
 * @param {string} contact.description - La descripción o notas del contacto.
 * @returns {string} La cadena de texto en formato vCard.
 */
export const generateVCardData = (contact) => {
  const vCard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${contact.name || ""}`,
    `TEL:${contact.phone || ""}`,
    `EMAIL:${contact.email || ""}`,
    `NOTE:${contact.description || ""}`,
    "END:VCARD",
  ].join("\n");

  return vCard;
};
