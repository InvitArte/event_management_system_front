/**
 * Normaliza el texto eliminando acentos y convirtiéndolo a minúsculas.
 * @param {string} text - El texto a normalizar.
 * @returns {string} El texto normalizado.
 */
export const normalizeText = (text) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};
