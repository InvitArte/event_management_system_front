/**
 * Formatea una fecha a string en español
 * @param {Date} date - Fecha a formatear
 * @returns {string} Fecha formateada como string
 */
export const formatDateToString = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  /**
   * Formatea una fecha para su uso en la URL del calendario de Google
   * @param {Date} date - Fecha a formatear
   * @returns {string} Fecha formateada
   */
  export const formatDateForCalendar = (date) =>
    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";