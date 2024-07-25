import { useState, useEffect } from "react";
import { publicService } from "../../services/Api";
import logo from "../../assets/imgs/aguja.svg";
import "../../styles/PublicView/Countdown.css";

const Countdown = ({ userId }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [eventDate, setEventDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEventDate = async () => {
      setIsLoading(true);
      try {
        const response = await publicService.getUserDate(userId);
        if (response && response.date) {
          const dateString = response.date;
          const [year, month, day, hour, minute] = dateString
            .split(" ")
            .map(Number);
          const eventDateFromAPI = new Date(year, month - 1, day, hour, minute);
          if (!isNaN(eventDateFromAPI.getTime())) {
            setEventDate(eventDateFromAPI);
          } else {
            console.error("Fecha del evento no válida:", dateString);
          }
        } else {
          console.error(
            "No se recibió una fecha válida del evento:",
            response.data
          );
        }
      } catch (error) {
        console.error("Error fetching event date:", error.message || error);
      }
    };
    fetchEventDate();
  }, [userId]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!eventDate) return null;

      const now = new Date();
      const difference = eventDate - now;

      if (difference <= 0) {
        setIsLoading(false);
        return {};
      }

      const timeLeft = {
        días: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / 1000 / 60) % 60),
      };

      setIsLoading(false);
      return timeLeft;
    };

    if (eventDate) {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [eventDate]);

  const timerComponents =
    timeLeft &&
    Object.keys(timeLeft).map((interval) => (
      <span key={interval}>
        {timeLeft[interval]} {interval}{" "}
      </span>
    ));

  const renderContent = () => {
    if (isLoading || timeLeft === null) {
      return <span className="message">Contando los días ...</span>;
    } else if (Object.keys(timeLeft).length > 0) {
      return (
        <>
          <h1 className="title">Quedan</h1>
          <p className="timer-components">{timerComponents}</p>
        </>
      );
    } else {
      return <span className="message">Hoy es el día</span>;
    }
  };

  return (
    <div className="countdown">
      <div className="countdown-overlay">
        <div className="timer">
          <img src={logo} alt="Logo" className="countdown-logo" />
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Countdown;
