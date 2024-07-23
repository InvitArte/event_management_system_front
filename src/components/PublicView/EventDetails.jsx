import "../../styles/PublicView/EventDetails.css";
import logo from "../../assets/imgs/maniqui.svg";
import { useState, useEffect } from "react";
import { publicService } from "../../services/api";

const EventDetails = ({ userId }) => {
  const [eventDate, setEventDate] = useState(null);
  const [eventDateString, setEventDateString] = useState("");
  const [eventLocations, setEventLocations] = useState([]);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        // Usa el userId de las props, o un valor por defecto si no está definido
        const id = userId;

        const [dateResponse, locationsResponse] = await Promise.all([
          publicService.getUserDate(id),
          publicService.getPublicLocations(id),
        ]);

        console.log("Respuesta de la API:", dateResponse, locationsResponse);

        if (dateResponse && dateResponse.date) {
          const dateString = dateResponse.date;
          const [year, month, day, hour, minute] = dateString
            .split(" ")
            .map(Number);

          // Crear un objeto Date en formato "año, mes, día, hora, minuto"
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
          } else {
            console.error("Fecha del evento no válida:", dateString);
          }
        } else {
          console.error(
            "No se recibió una fecha válida del evento:",
            dateResponse.date
          );
        }

        // Actualiza la lista de ubicaciones del evento
        if (locationsResponse && Array.isArray(locationsResponse)) {
          setEventLocations(locationsResponse);
        } else {
          console.error(
            "No se recibió una lista de ubicaciones válida del evento:",
            locationsResponse
          );
        }
      } catch (error) {
        console.error("Error fetching event data:", error.message || error);
      }
    };

    fetchEventData();
  }, [userId]);

  const addToGoogleCalendar = () => {
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

    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=Evento+Especial&dates=${startDate}/${endDate}&details=Detalles+del+evento&location=${encodeURIComponent(
      locationString || "Ubicación+del+evento"
    )}`;

    window.open(url, "_blank");
  };

  const openGoogleMaps = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="event-details">
      <div className="event-details-overlay">
        <img src={logo} alt="Logo" className="event-logo" />
        <h1>PRESENTACIÓN NUEVA COLECCIÓN</h1>
        <h2 className="event-date">{eventDateString || "Cargando fecha..."}</h2>
        {eventDate && (
          <button className="add-to-calendar" onClick={addToGoogleCalendar}>
            Añadir a Google Calendar
          </button>
        )}
        {eventLocations.length > 0 && (
          <div className="event-locations">
            <h3>Ubicaciones:</h3>
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
      </div>
    </div>
  );
};

export default EventDetails;
