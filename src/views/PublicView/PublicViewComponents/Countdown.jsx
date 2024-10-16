// React y hooks
import React, { useState, useEffect, useCallback } from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Servicios , contexto y configuración
import { publicService } from "../../../services/Api";
import { useBackgroundImage } from "../../../context";
import { defaultConfig } from "../../../config";

// Estilos y Assets
import "../../../styles/PublicView/Countdown.css";
import logo from "../../../assets/imgs/aguja.svg";

const Countdown = ({ userId }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [eventDate, setEventDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { backgroundImages, setBackgroundImage } = useBackgroundImage();

  const fetchEventDate = useCallback(async () => {
    setIsLoading(true);
    try {
      const effectiveUserId = userId || defaultConfig.userId;
      const response = await publicService.getUserDate(
        effectiveUserId.toString()
      );
      if (response && response.date) {
        const [year, month, day, hour, minute] = response.date
          .split(" ")
          .map(Number);
        const eventDateFromAPI = new Date(year, month - 1, day, hour, minute);
        if (!isNaN(eventDateFromAPI.getTime())) {
          setEventDate(eventDateFromAPI);
        } else {
          console.error("Fecha del evento no válida:", response.date);
        }
      } else {
        console.error("No se recibió una fecha válida del evento:", response);
      }
    } catch (error) {
      console.error("Error fetching event date:", error.message || error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchEventDate();
  }, [fetchEventDate]);

  useEffect(() => {
    const loadBackgroundImage = async () => {
      try {
        const imageModule = await import("../../../assets/imgs/countdown.jpg");
        setBackgroundImage("countdown", imageModule.default);
      } catch (error) {
        console.error("Error loading background image:", error);
      }
    };
    loadBackgroundImage();
  }, [setBackgroundImage]);

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

  const renderContent = () => {
    if (isLoading) {
      return <span className="message">Contando los días ...</span>;
    } else if (timeLeft && Object.keys(timeLeft).length > 0) {
      return (
        <>
          <h1 className="title">Quedan</h1>
          <p className="timer-components">
            {Object.entries(timeLeft).map(([interval, value]) => (
              <span key={interval}>
                {value} {interval}{" "}
              </span>
            ))}
          </p>
        </>
      );
    } else {
      return <span className="message">Hoy es el día</span>;
    }
  };

  return (
    <div
      className="countdown"
      style={{ backgroundImage: `url(${backgroundImages.countdown})` }}
    >
      <div className="countdown-overlay">
        <div className="timer">
          <img src={logo} alt="Logo" className="countdown-logo" />
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

Countdown.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Countdown;
