import "../../styles/EventDetails.css";
import logo from "../../assets/imgs/logo.png";
import background from "../../assets/imgs/eventdetails.jpg";

const EventDetails = () => {
  const eventDate = new Date("2024-10-16T00:00:00");
  const eventDateString = eventDate.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const addToGoogleCalendar = () => {
    const startDate =
      eventDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const endDate =
      new Date(eventDate.getTime() + 2 * 60 * 60 * 1000)
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0] + "Z"; // Evento de 2 horas
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=Evento+Especial&dates=${startDate}/${endDate}&details=Detalles+del+evento&location=Ubicación+del+evento`;

    window.open(url, "_blank");
  };

  return (
    <div
      className="event-details"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <div className="background-overlay">
        <img src={logo} alt="Logo" className="event-logo" />
        <h2 className="event-date">{eventDateString}</h2>
        <button className="add-to-calendar" onClick={addToGoogleCalendar}>
          Añadir a Google Calendar
        </button>
      </div>
    </div>
  );
};

export default EventDetails;
