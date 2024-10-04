//React
import React from "react";

//Material-UI
import { Typography } from "@mui/material";

/**
 * Componente EventTitle
 *
 * Este componente renderiza el título del evento.
 * Actualmente muestra un título estático "Titulo", pero podría ser modificado
 * para aceptar un prop con el título como texto dinámico en el futuro.
 */
const EventTitle = () => (
  <Typography
    variant="h4"
    component="div"
    gutterBottom
    align="center"
    sx={titleStyles}
  >
    Titulo
  </Typography>
);



export default EventTitle;