//React
import React from "react";

//Material-UI
import { Card, CardContent, Skeleton, Box } from "@mui/material";

/**
 * Componente EventCardSkeleton
 *
 * Este componente renderiza un esqueleto de carga para la tarjeta de evento.
 * Se utiliza para mostrar un placeholder mientras se cargan los datos reales del evento.
 */
const EventCardSkeleton = () => (
  <Card sx={cardStyles}>
    <CardContent sx={cardContentStyles}>
      {renderTitleSkeleton()}
      {renderDateSkeleton()}
      {renderDescriptionSkeleton()}
      {renderButtonSkeleton()}
      {renderLocationSkeleton()}
      {renderConfirmButtonSkeleton()}
    </CardContent>
  </Card>
);

/**
 * Estilos para la tarjeta principal
 */
const cardStyles = {
  height: "100%",
  display: "flex",
  flexDirection: "column"
};

/**
 * Estilos para el contenido de la tarjeta
 */
const cardContentStyles = {
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between"
};

/**
 * Renderiza el esqueleto del título
 */
const renderTitleSkeleton = () => (
  <Skeleton
    variant="text"
    width="60%"
    height={40}
    sx={{ mx: "auto", mb: 2 }}
  />
);

/**
 * Renderiza el esqueleto de la fecha
 */
const renderDateSkeleton = () => (
  <Box sx={{ mb: 2, textAlign: "center" }}>
    <Skeleton variant="text" width="40%" height={30} sx={{ mx: "auto" }} />
    <Skeleton variant="text" width="60%" height={24} sx={{ mx: "auto" }} />
  </Box>
);

/**
 * Renderiza el esqueleto de la descripción
 */
const renderDescriptionSkeleton = () => (
  <Skeleton
    variant="text"
    width="80%"
    height={24}
    sx={{ mx: "auto", mb: 2 }}
  />
);

/**
 * Renderiza el esqueleto del botón principal
 */
const renderButtonSkeleton = () => (
  <Skeleton
    variant="rectangular"
    width="40%"
    height={36}
    sx={{ mx: "auto", mb: 2 }}
  />
);

/**
 * Renderiza el esqueleto de la ubicación
 */
const renderLocationSkeleton = () => (
  <Box sx={{ mb: 2 }}>
    <Skeleton
      variant="text"
      width="30%"
      height={24}
      sx={{ mx: "auto", mb: 1 }}
    />
    <Skeleton
      variant="rectangular"
      width="60%"
      height={36}
      sx={{ mx: "auto" }}
    />
  </Box>
);

/**
 * Renderiza el esqueleto del botón de confirmación
 */
const renderConfirmButtonSkeleton = () => (
  <Skeleton variant="rectangular" width="100%" height={36} sx={{ mt: 2 }} />
);

export default EventCardSkeleton;