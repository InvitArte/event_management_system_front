// Función para generar un color basado en una cadena
export const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
};

// Función para aclarar u oscurecer un color
export const adjustColor = (color, amount) => {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2)
      )
  );
};

// Función para generar un color de texto basado en el color de fondo
export const getContrastColor = (hexcolor) => {
  // Si el color es inválido, devuelve negro
  if (hexcolor.indexOf("#") === 0) {
    hexcolor = hexcolor.slice(1);
  }
  // Convierte a RGB
  let r = parseInt(hexcolor.substr(0, 2), 16);
  let g = parseInt(hexcolor.substr(2, 2), 16);
  let b = parseInt(hexcolor.substr(4, 2), 16);
  // Calcula el brillo (HSP)
  let hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
  // Utiliza blanco o negro como color de contraste
  return hsp > 127.5 ? "#000000" : "#FFFFFF";
};
