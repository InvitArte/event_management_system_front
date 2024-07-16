// src/components/Countdown.jsx
import { useState, useEffect } from "react";
import "../../styles/Countdown.css";
import background from "../../assets/imgs/countdown.jpg";

const Countdown = () => {
  const calculateTimeLeft = () => {
    const targetDate = new Date("2024-10-16T00:00:00");
    const now = new Date();
    const difference = targetDate - now;

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

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span key={interval}>
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });

  return (
    <div
      className="countdown"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <div className="background-overlay">
        <h1 className="title">Quedan</h1>
        <div className="timer">
          {timerComponents.length ? (
            timerComponents
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
