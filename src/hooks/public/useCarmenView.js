// React y Hooks
import { useState, useEffect, useCallback } from "react";

// Servicios
import { publicService } from "../../services/Api";

const useCarmenView = (userId) => {
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEventData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dateResponse, locationsResponse] = await Promise.all([
        publicService.getUserDate(userId),
        publicService.getPublicLocations(userId),
      ]);

      const processedEventData = processEventData(dateResponse, locationsResponse);
      setEventData(processedEventData);
    } catch (error) {
      console.error("Error al obtener los datos del evento:", error);
      setError("No se pudieron cargar los datos del evento. Por favor, intente nuevamente más tarde.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const processEventData = (dateResponse, locationsResponse) => {
    let eventDate = null;
    let eventDateString = "";

    if (dateResponse && dateResponse.date) {
      eventDate = parseEventDate(dateResponse.date);
      eventDateString = formatEventDate(eventDate);
    }

    const eventLocations = Array.isArray(locationsResponse) ? locationsResponse : [];

    return { eventDate, eventDateString, eventLocations };
  };

  const parseEventDate = (dateString) => {
    const [year, month, day, hour, minute] = dateString.split(" ").map(Number);
    const parsedDate = new Date(year, month - 1, day, hour, minute);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  const formatEventDate = (date) => {
    if (!date) return "";
    const formattedDate = date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${formattedDate} - ${formattedTime}h`;
  };

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  return {
    isLoading,
    eventData,
    error,
    isModalOpen,
    handleOpenModal,
    handleCloseModal,
  };
};

export default useCarmenView;