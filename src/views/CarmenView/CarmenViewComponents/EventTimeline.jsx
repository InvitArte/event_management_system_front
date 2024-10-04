//React
import React from "react";

// Material-UI
import { Box, Container, Typography } from "@mui/material";
import { DirectionsBus as DirectionsBusIcon, Church as ChurchIcon, Restaurant as RestaurantIcon } from "@mui/icons-material";

// Componentes propios
import TimelineItem from "./TimelineItem";

const EventTimeline = ({ scrollProgress, eventLocations }) => {
  const timelineItems = [
    {
      icon: <DirectionsBusIcon />,
      time: "Por concretar",
      description: "Salida autobuses",
      isExpandable: false,
    },
    {
      icon: <ChurchIcon />,
      time: "12:00",
      description: "Parroquia de la Purísima Concepción de Brenes",
      isExpandable: true,
      locations: [eventLocations[0]],
    },
    {
      icon: <RestaurantIcon />,
      time: "14:00",
      description: "Hacienda Atalaya Alta",
      isExpandable: true,
      locations: [eventLocations[1]],
    },
    {
      icon: <DirectionsBusIcon />,
      time: "Por concretar",
      description: "Regreso autobuses",
      isExpandable: false,
    },
  ];

  const totalItems = timelineItems.length;

  // Cada item se activa en una porción igual del scroll
  const itemActivationDuration = 100 / totalItems;

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box sx={{ mb: 4 }}>
          {timelineItems.map((item, index) => {
            const itemStartProgress = index * itemActivationDuration;
            const itemEndProgress = (index + 1) * itemActivationDuration;

            let itemProgress;
            if (scrollProgress <= itemStartProgress) {
              itemProgress = 0;
            } else if (scrollProgress >= itemEndProgress) {
              itemProgress = 100;
            } else {
              itemProgress = ((scrollProgress - itemStartProgress) / itemActivationDuration) * 100;
            }

            return (
              <TimelineItem
                key={index}
                icon={item.icon}
                time={item.time}
                description={item.description}
                fillPercentage={itemProgress}
                isLast={index === timelineItems.length - 1}
                locations={item.locations}
                isExpandable={item.isExpandable}
              />
            );
          })}
        </Box>
      </Box>
    </Container>
  );
};

export default EventTimeline;