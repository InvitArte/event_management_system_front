import { useState, useEffect, useCallback } from "react";
import { locationService } from "../../services/Api";

const useLocations = (open) => {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({
    name: "",
    direccion: "",
    url: "",
    capacity: "",
  });
  const [editingLocation, setEditingLocation] = useState(null);
  const [expandedLocation, setExpandedLocation] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchLocations = useCallback(async () => {
    try {
      const response = await locationService.getAllLocations();
      setLocations(
        response.map((location) => ({
          ...location,
          capacity: location.capacity ? location.capacity.toString() : "",
        }))
      );
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
        const locationToAdd = {
          ...newLocation,
          capacity: newLocation.capacity
            ? parseInt(newLocation.capacity, 10)
            : null,
        };
        await locationService.createLocation(locationToAdd);
        setNewLocation({ name: "", direccion: "", url: "", capacity: "" });
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
        const locationToUpdate = {
          ...editingLocation,
          capacity: editingLocation.capacity
            ? parseInt(editingLocation.capacity, 10)
            : null,
        };
        await locationService.updateLocation(
          locationToUpdate.id,
          locationToUpdate
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

  const resetState = () => {
    setNewLocation({ name: "", direccion: "", url: "", capacity: "" });
    setEditingLocation(null);
    setExpandedLocation(null);
    setIsCreating(false);
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
    resetState,
  };
};

export default useLocations;