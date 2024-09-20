import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  StyledCountdown,
  TimeUnit,
  TimeValue,
  TimeLabel,
} from "./ConfirmationModalStyles";

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
    return <TimeValue variant="h5">Hoy es el día</TimeValue>;
  }

  return (
    <StyledCountdown>
      {Object.entries(timeLeft).map(([interval, value]) => (
        <TimeUnit key={interval}>
          <TimeValue>{value}</TimeValue>
          <TimeLabel>{interval}</TimeLabel>
        </TimeUnit>
      ))}
    </StyledCountdown>
  );
};

CountdownTimer.propTypes = {
  eventDate: PropTypes.instanceOf(Date),
};

export default CountdownTimer;
