import React, { useState, useEffect } from "react";
import { publicService } from "../../services/api";
import ConfirmationModal from "./ConfirmationModal";
import "../../styles/PublicView/EventDetails.css";
import logo from "../../assets/imgs/maniqui.svg";

const EventDetails = ({ userId }) => {
  const [eventDate, setEventDate] = useState(null);
  const [eventDateString, setEventDateString] = useState("");
  const [eventLocations, setEventLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
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
            setEventDateString(
              eventDateFromAPI.toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            );
          }
        }

        if (locationsResponse && Array.isArray(locationsResponse)) {
          setEventLocations(locationsResponse);
        }
      } catch (error) {
        console.error("Error fetching event data:", error.message || error);
      }
    };

    fetchEventData();
  }, [userId]);

  const openConfirmationModal = () => {
    setIsModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="event-details">
      <div className="event-details-overlay">
        <img src={logo} alt="Logo" className="event-logo" />
        <h1>PRESENTACIÓN NUEVA COLECCIÓN</h1>
        <h2>Fecha:</h2>
        <h2 className="event-date">{eventDateString || "Cargando fecha..."}</h2>
        {eventLocations.length > 0 && (
          <div className="event-locations">
            <h2>Ubicaciones:</h2>
            <ul>
              {eventLocations.map((location) => (
                <li key={location.id}>
                  <p>{location.direccion}</p>
                  <button
                    className="open-maps"
                    onClick={() => openGoogleMaps(location.direccion)}
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

export default EventDetails;
