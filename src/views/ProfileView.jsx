import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  Paper,
  Button,
} from "@mui/material";
import ProfileForm from "../components/ProfileView/ProfileForm";
import LocationModal from "../components/ProfileView/LocationModal";

const ProfileView = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const handleOpenLocationModal = () => {
    setLocationModalOpen(true);
  };

  const handleCloseLocationModal = () => {
    setLocationModalOpen(false);
  };

  return (
    <Container maxWidth={isSmallScreen ? "sm" : "xl"}>
      <Paper elevation={1} sx={{ padding: 2, marginBottom: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant={isSmallScreen ? "h5" : "h4"}
            component="h1"
            style={{ color: "black" }}
          >
            Perfil de Usuario
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenLocationModal}
          >
            Ubicaciones
          </Button>
        </Box>
      </Paper>
      <Paper elevation={1} sx={{ padding: 2, marginBottom: 2 }}>
        <ProfileForm />
      </Paper>
      <LocationModal
        open={locationModalOpen}
        handleClose={handleCloseLocationModal}
      />
    </Container>
  );
};

export default ProfileView;
