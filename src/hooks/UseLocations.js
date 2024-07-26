import { useState, useEffect, useCallback } from "react";
import { locationService } from "../services/Api";

const useLocations = (open) => {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({
    name: "",
    direccion: "",
    url: "",
  });
  const [editingLocation, setEditingLocation] = useState(null);
  const [expandedLocation, setExpandedLocation] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchLocations = useCallback(async () => {
    try {
      const response = await locationService.getAllLocations();
      setLocations(response);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchLocations();
    }
  }, [open, fetchLocations]);

  const handleAddLocation = async () => {
    if (newLocation.name.trim()) {
      try {
        await locationService.createLocation(newLocation);
        setNewLocation({ name: "", direccion: "", url: "" });
        setIsCreating(false);
        fetchLocations();
      } catch (error) {
        console.error("Error adding location:", error);
      }
    }
  };

  const handleUpdateLocation = async () => {
    if (editingLocation && editingLocation.name.trim()) {
      try {
        await locationService.updateLocation(
          editingLocation.id,
          editingLocation
        );
        setEditingLocation(null);
        fetchLocations();
      } catch (error) {
        console.error("Error updating location:", error);
      }
    }
  };

  const handleDeleteLocation = async (id) => {
    try {
      await locationService.deleteLocation(id);
      fetchLocations();
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  const handleExpandLocation = (id) => {
    setExpandedLocation(expandedLocation === id ? null : id);
  };

  return {
    locations,
    newLocation,
    editingLocation,
    expandedLocation,
    isCreating,
    setNewLocation,
    setEditingLocation,
    setIsCreating,
    handleAddLocation,
    handleUpdateLocation,
    handleDeleteLocation,
    handleExpandLocation,
  };
};

export default useLocations;
