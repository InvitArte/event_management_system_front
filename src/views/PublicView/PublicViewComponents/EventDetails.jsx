import React, { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { publicService } from "../../../services/Api";
import ConfirmationModal from "./ConfirmationModal";
import "../../styles/PublicView/EventDetails.css";
import logo from "../../assets/imgs/maniqui.svg";
import { useBackgroundImage } from "../../../context/BackgroundImageContext";

const EventDetails = ({ userId }) => {
  const [eventDate, setEventDate] = useState(null);
  const [eventDateString, setEventDateString] = useState("");
  const [eventLocations, setEventLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [contentScale, setContentScale] = useState(1);
  const { backgroundImages, setBackgroundImage } = useBackgroundImage();
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  const fetchEventData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [dateResponse, locationsResponse] = await Promise.all([
        publicService.getUserDate(userId),
        publicService.getPublicLocations(userId),
      ]);

      if (dateResponse && dateResponse.date) {
        const dateString = dateResponse.date;
        const [year, month, day, hour, minute] = dateString
          .split(" ")
          .map(Number);
        const eventDateFromAPI = new Date(year, month - 1, day, hour, minute);

        if (!isNaN(eventDateFromAPI.getTime())) {
          setEventDate(eventDateFromAPI);
          const formattedDate = eventDateFromAPI.toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          const formattedTime = eventDateFromAPI.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          });

          setEventDateString(`${formattedDate} - ${formattedTime}h`);
        }
      }

      if (locationsResponse && Array.isArray(locationsResponse)) {
        setEventLocations(locationsResponse);
      }
    } catch (error) {
      console.error("Error fetching event data:", error.message || error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  useEffect(() => {
    const loadBackgroundImage = async () => {
      try {
        const imageModule = await import("../../assets/imgs/eventdetails.jpg");
        setBackgroundImage("eventDetails", imageModule.default);
      } catch (error) {
        console.error(
          "Error loading background image:",
          error.message || error
        );
      }
    };
    loadBackgroundImage();
  }, [setBackgroundImage]);

  useEffect(() => {
    const adjustContentSize = () => {
      if (containerRef.current && contentRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const contentHeight = contentRef.current.scrollHeight;
        const scale = containerHeight / contentHeight;
        setContentScale(Math.min(1, scale));
      }
    };

    adjustContentSize();
    window.addEventListener("resize", adjustContentSize);
    return () => window.removeEventListener("resize", adjustContentSize);
  }, [eventLocations, eventDateString]);

  const addToGoogleCalendar = useCallback(() => {
    if (!eventDate) return;

    const startDate =
      eventDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const endDate =
      new Date(eventDate.getTime() + 2 * 60 * 60 * 1000)
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0] + "Z";

    const locationString = eventLocations
      .map((location) => location.direccion)
      .join(", ");

    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      "Presentación Nueva Colección"
    )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
      "Detalles del evento"
    )}&location=${encodeURIComponent(
      locationString || "Ubicación del evento"
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }, [eventDate, eventLocations]);

  const openGoogleMaps = useCallback((url) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      console.error("No URL provided for this location");
    }
  }, []);

  const openConfirmationModal = () => setIsModalOpen(true);
  const closeConfirmationModal = () => setIsModalOpen(false);

  if (isLoading) {
    return <div className="loading">Cargando detalles del evento...</div>;
  }

  return (
    <div
      ref={containerRef}
      className="event-details snap-section"
      style={{
        backgroundImage: `url(${backgroundImages.eventDetails})`,
      }}
    >
      <div className="event-details-overlay"></div>
      <div
        ref={contentRef}
        className="event-details-content"
        style={{
          transform: `scale(${contentScale})`,
          transformOrigin: "center center",
        }}
      >
        <img src={logo} alt="Logo" className="event-logo" />
        <div className="event-info">
          <h1>PRESENTACIÓN NUEVA COLECCIÓN</h1>
          <h2>Fecha:</h2>
          <h2 className="event-date">
            {eventDateString || "Fecha no disponible"}
          </h2>
          {eventDate && (
            <button className="add-to-calendar" onClick={addToGoogleCalendar}>
              Añadir a calendario
            </button>
          )}
          {eventLocations.length > 0 && (
            <div className="event-locations">
              <h2>
                {eventLocations.length > 1 ? "Ubicaciones:" : "Ubicación:"}
              </h2>
              <ul>
                {eventLocations.map((location) => (
                  <li key={location.id}>
                    <p>{location.name}</p>
                    <button
                      className="open-maps"
                      onClick={() => openGoogleMaps(location.url)}
                    >
                      Cómo llegar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button className="confirmation" onClick={openConfirmationModal}>
            Confirmar asistencia
          </button>
        </div>
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={closeConfirmationModal}
          userId={userId}
          eventDate={eventDateString}
          eventLocations={eventLocations}
        />
      </div>
    </div>
  );
};

EventDetails.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default EventDetails;
