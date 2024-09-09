import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@mui/material";
import { publicService } from "../../services/Api";
import PropTypes from "prop-types";
import EventTitle from "./EventTitle";
import CountdownTimer from "./CountdownTimer";
import EventDate from "./EventDate";
import CalendarButton from "./CalendarButton";
import EventLocations from "./EventLocations";
import ConfirmButton from "./ConfirmButton";
import EventCardSkeleton from "./EventCardSkeleton";

const CarmenEventCard = ({ userId }) => {
  const [eventDate, setEventDate] = useState(null);
  const [eventDateString, setEventDateString] = useState("");
  const [eventLocations, setEventLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return <EventCardSkeleton />;
  }

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <EventTitle />
        <CountdownTimer eventDate={eventDate} />
        <EventDate eventDateString={eventDateString} />
        <CalendarButton eventDate={eventDate} eventLocations={eventLocations} />
        <EventLocations eventLocations={eventLocations} />
        <ConfirmButton />
      </CardContent>
    </Card>
  );
};

CarmenEventCard.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default CarmenEventCard;
