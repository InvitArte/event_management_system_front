import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  useMediaQuery,
  useTheme,
  Button,
  Paper,
} from "@mui/material";
import { guestService } from "../services/api";
import GuestTable from "../components/GuestView/GuestTable";
import GuestFilters from "../components/GuestView/GuestFilters";
import ExcelDownloader from "../components/GuestView/ExcelDownloader";
import GuestModal from "../components/GuestView/GuestModal";
import SkeletonTable from "../components/Ui/SkeletonTable";

const GuestView = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [menus, setMenus] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const processGuests = (guestsData) => {
    if (!Array.isArray(guestsData)) {
      console.error("guestsData is not an array:", guestsData);
      return [];
    }

    const uniqueMenus = new Set();
    const uniqueAllergies = new Set();

    const processedGuests = guestsData.flatMap((guest) => {
      if (guest.menu) {
        uniqueMenus.add(JSON.stringify(guest.menu));
      }
      if (guest.allergy) {
        uniqueAllergies.add(JSON.stringify(guest.allergy));
      }

      const mainGuest = {
        id: guest.id,
        fullName: `${guest.first_name} ${guest.last_name}`.trim(),
        first_name: guest.first_name,
        last_name: guest.last_name,
        email: guest.email || "",
        phone: guest.phone || "",
        validated: Boolean(guest.validated),
        menu: guest.menu?.name || "No ha especificado",
        menu_id: guest.menu_id,
        allergy: guest.allergy?.name || "No",
        allergy_id: guest.allergy_id,
        needs_hotel: Boolean(guest.needs_hotel),
        needs_transport: Boolean(guest.needs_transport),
        disability: Boolean(guest.disability),
        observations: guest.observations || "",
        accommodation_plan: guest.accommodation_plan || "No ha especificado",
        isMainGuest: true,
        plus_ones: guest.plus_ones || [],
      };

      const plusOnes =
        guest.plus_ones?.map((plusOne) => {
          if (plusOne.menu) {
            uniqueMenus.add(JSON.stringify(plusOne.menu));
          }
          if (plusOne.allergy) {
            uniqueAllergies.add(JSON.stringify(plusOne.allergy));
          }

          return {
            id: plusOne.id,
            fullName: `${plusOne.first_name} ${plusOne.last_name}`.trim(),
            first_name: plusOne.first_name,
            last_name: plusOne.last_name,
            email: plusOne.email || "",
            phone: plusOne.phone || "",
            validated: Boolean(guest.validated),
            menu: plusOne.menu?.name || "No ha especificado",
            menu_id: plusOne.menu_id,
            allergy: plusOne.allergy?.name || "No",
            allergy_id: plusOne.allergy_id,
            needs_hotel: Boolean(guest.needs_hotel),
            needs_transport: Boolean(guest.needs_transport),
            disability: Boolean(plusOne.disability),
            observations: plusOne.observations || "",
            accommodation_plan:
              guest.accommodation_plan || "No ha especificado",
            isMainGuest: false,
            parentId: guest.id,
          };
        }) || [];

      return [mainGuest, ...plusOnes];
    });

    setMenus(Array.from(uniqueMenus).map((menu) => JSON.parse(menu)));
    setAllergies(
      Array.from(uniqueAllergies).map((allergy) => JSON.parse(allergy))
    );

    return processedGuests;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const guestsResponse = await guestService.getAllGuests();
        console.log("Guests fetched:", guestsResponse);
        setGuests(processGuests(guestsResponse));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === null || value === undefined || value === "") return true;
        if (typeof guest[key] === "boolean") {
          return guest[key] === (value === "Sí");
        }
        if (typeof value === "string") {
          return guest[key]?.toLowerCase().includes(value.toLowerCase());
        }
        return guest[key] === value;
      });
    });
  }, [guests, filters]);

  const handleCreateGuest = () => {
    setSelectedGuest(null);
    setModalOpen(true);
  };

  const handleEditGuest = (guest) => {
    setSelectedGuest(guest);
    setModalOpen(true);
  };

  const handleBulkActionComplete = async () => {
    try {
      const updatedGuestsResponse = await guestService.getAllGuests();
      setGuests(processGuests(updatedGuestsResponse));
    } catch (error) {
      console.error("Error updating guest list after bulk action:", error);
      setError("Failed to update guest list. Please refresh the page.");
    }
  };

  const handleGuestSubmitted = async () => {
    try {
      const updatedGuestsResponse = await guestService.getAllGuests();
      console.log("Updated guests fetched:", updatedGuestsResponse);
      setGuests(processGuests(updatedGuestsResponse));
      setModalOpen(false);
    } catch (error) {
      console.error("Error updating guest list:", error);
      setError("Failed to update guest list. Please refresh the page.");
    }
  };

  const excelData = useMemo(() => {
    return filteredGuests.map((guest) => ({
      ID: guest.id,
      "Nombre Completo": guest.fullName,
      Email: guest.email,
      Teléfono: guest.phone,
      Validado: guest.validated ? "Sí" : "No",
      Menú: guest.menu,
      Alergia: guest.allergy,
      "Necesita Hotel": guest.needs_hotel ? "Sí" : "No",
      "Necesita Transporte": guest.needs_transport ? "Sí" : "No",
      Discapacidad: guest.disability ? "Sí" : "No",
      Observaciones: guest.observations,
      "Plan de Alojamiento": guest.accommodation_plan,
      Tipo: guest.isMainGuest ? "Invitado Principal" : "Acompañante",
    }));
  }, [filteredGuests]);

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth={isSmallScreen ? "sm" : "xl"}>
      <Paper elevation={1} sx={{ padding: 2, marginBottom: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant={isSmallScreen ? "h5" : "h4"}
            component="h1"
            style={{ color: "black" }}
          >
            Invitados
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateGuest}
          >
            Crear Nuevo Invitado
          </Button>
        </Box>
      </Paper>
      <Paper elevation={1} sx={{ padding: 2, marginBottom: 2 }}>
        <GuestFilters guests={guests} onFilterChange={handleFilterChange} />
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <ExcelDownloader data={excelData} fileName="Invitados" />
        </Box>
        {loading ? (
          <SkeletonTable rowsNum={10} columnsNum={8} />
        ) : (
          <GuestTable
            guests={filteredGuests}
            onRowClick={handleEditGuest}
            onBulkActionComplete={handleBulkActionComplete}
          />
        )}
        <GuestModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          guest={selectedGuest}
          onSubmit={handleGuestSubmitted}
          menus={menus}
          allergies={allergies}
        />
      </Paper>
    </Container>
  );
};

export default GuestView;
