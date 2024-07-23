import { useState, useEffect } from "react";
import { publicService } from "../../services/api";
import logo from "../../assets/imgs/aguja.svg";
import "../../styles/PublicView/Countdown.css";

const Countdown = ({ userId }) => {
  const [timeLeft, setTimeLeft] = useState({});
  const [eventDate, setEventDate] = useState(null);

  useEffect(() => {
    const fetchEventDate = async () => {
      try {
        // Usa el userId de las props, o un valor por defecto si no está definido
        const response = await publicService.getUserDate(userId);
        console.log("Respuesta de la API:", response);

        if (response && response.date) {
          const dateString = response.date;
          const [year, month, day, hour, minute] = dateString
            .split(" ")
            .map(Number);

          // Crear un objeto Date en formato "año, mes, día, hora, minuto"
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
      const now = new Date();
      const difference = eventDate - now;

      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          días: Math.floor(difference / (1000 * 60 * 60 * 24)),
          horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutos: Math.floor((difference / 1000 / 60) % 60),
        };
      }

      return timeLeft;
    };

    if (eventDate) {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [eventDate]);

  const timerComponents = Object.keys(timeLeft).map((interval) => (
    <span key={interval}>
      {timeLeft[interval]} {interval}{" "}
    </span>
  ));

  const showCountdown = Object.keys(timeLeft).length > 0;

  return (
    <div className="countdown">
      <div className="countdown-overlay">
        <div className="timer">
          <img src={logo} alt="Logo" className="countdown-logo" />
          {showCountdown ? (
            <>
              <h1 className="title">Quedan</h1>
              <p className="timer-components">{timerComponents}</p>
            </>
          ) : (
            <span className="message">Hoy es el día</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Countdown;
