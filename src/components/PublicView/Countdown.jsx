import { useState, useEffect } from "react";
import { publicService } from "../../services/api";
import "../../styles/PublicView/Countdown.css";

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({});
  const [eventDate, setEventDate] = useState(null);

  useEffect(() => {
    const fetchEventDate = async (userId) => {
      try {
        const response = await publicService.getUserDate(userId);
        setEventDate(new Date(response.data.date));

        if (response.data.date) {
          const dateString = response.data.date;
          const parts = dateString.split(" ");

          // Crear un objeto Date en formato "año, mes , día, hora, minuto"
          const eventDateFromAPI = new Date(
            parts[0], // año
            parseInt(parts[1]) - 1, // mes (se resta uno a la fecha recibida de la Api porque en el objeto 'Date' Enero es el mes 0 ...)
            parts[2], // día
            parts[3], // hora
            parts[4] // minuto
          );

          setEventDate(eventDateFromAPI);
          console.log("Fecha del evento:", eventDateFromAPI);
        } else {
          console.error(
            "No se recibió una fecha válida del evento:",
            response.data
          );
        }
      } catch (error) {
        console.error("Error fetching event date:", error);
      }
    };

    fetchEventDate(2); // TODO: Pasar el ID del usuario autenticado--------------------------------------------------------------------------------
  }, []);

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
          segundos: Math.floor((difference / 1000) % 60),
        };
      }

      return timeLeft;
    };

    const timer = setInterval(() => {
      if (eventDate) {
        setTimeLeft(calculateTimeLeft());
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  const timerComponents = Object.keys(timeLeft).map((interval) => (
    <span key={interval}>
      {timeLeft[interval]} {interval}{" "}
    </span>
  ));

  return (
    <div className="countdown">
      <div className="countdown-overlay">
        <h1 className="title">Quedan</h1>
        <div className="timer">
          {timerComponents.length ? (
            <>{timerComponents}</>
          ) : (
            <span>¡Hoy es el día!</span>
          )}
        </div>
        <div className="circle"></div>
      </div>
    </div>
  );
};

export default Countdown;
