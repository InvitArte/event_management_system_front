import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import PropTypes from "prop-types";

const CountdownTimer = ({ eventDate }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!eventDate) return null;
      const now = new Date();
      const difference = eventDate - now;
      if (difference <= 0) return {};
      return {
        días: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / 1000 / 60) % 60),
      };
    };

    if (eventDate) {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [eventDate]);

  if (!timeLeft || Object.keys(timeLeft).length === 0) {
    return (
      <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
        Hoy es el día
      </Typography>
    );
  }

  return (
    <Box sx={{ mb: 2, textAlign: "center" }}>
      <Typography variant="h5">Quedan</Typography>
      <Typography variant="h6">
        {Object.entries(timeLeft).map(
          ([interval, value]) => `${value} ${interval} `
        )}
      </Typography>
    </Box>
  );
};

CountdownTimer.propTypes = {
  eventDate: PropTypes.instanceOf(Date),
};

export default CountdownTimer;
