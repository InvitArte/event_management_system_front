// React
import React from "react";
// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import { Box, Container, Typography, useTheme } from "@mui/material";
import { DirectionsBus as DirectionsBusIcon, Church as ChurchIcon, Restaurant as RestaurantIcon } from "@mui/icons-material";

// Componentes propios
import TimelineItem from "./TimelineItem";

const EventTimeline = ({ scrollProgress, eventLocations }) => {
  const theme = useTheme();

  const timelineItems = [
    {
      icon: <DirectionsBusIcon />,
      time: "11:15",
      description: "Salida autobuses",
      isExpandable: false,
    },
    {
      icon: <ChurchIcon />,
      time: "12:00",
      description: "Tu ceremonia",
      isExpandable: true,
      locations: [eventLocations[0]],
    },
    {
      icon: <RestaurantIcon />,
      time: "14:00",
      description: "Tu celebración",
      isExpandable: true,
      locations: [eventLocations[1]],
    },
    {
      icon: <DirectionsBusIcon />,
      time: "02:00",
      description: "Regreso autobuses",
      isExpandable: false,
    },
  ];

  const totalItems = timelineItems.length;
  const itemActivationDuration = 100 / totalItems;

  return (
    <Container maxWidth="md" sx={{ background: 'transparent' }}>
      <Box sx={{ my: 4, background: 'transparent' }}>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          sx={{
            mb: 4,
            color: "#8D5444",
            fontFamily: "'CormorantUpright', regular ",
            fontSize: { xs: '2rem', sm: '2.5rem' },
          }}
        >
          Cronograma del Evento
        </Typography>
        <Box sx={{ mb: 4, background: 'transparent' }}>
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

EventTimeline.propTypes = {
  scrollProgress: PropTypes.number.isRequired,
  eventLocations: PropTypes.arrayOf(
    PropTypes.shape({
      direccion: PropTypes.string,
      latitud: PropTypes.number,
      longitud: PropTypes.number,
    })
  ).isRequired,
};

export default EventTimeline;