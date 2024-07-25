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
import ChangePasswordModal from "../components/ProfileView/ChangePasswordModal";

const ProfileView = ({ visibleFields }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const handleOpenLocationModal = () => {
    setLocationModalOpen(true);
  };

  const handleCloseLocationModal = () => {
    setLocationModalOpen(false);
  };

  const handleOpenPasswordModal = () => {
    setPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setPasswordModalOpen(false);
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
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenLocationModal}
              sx={{ marginRight: 2 }}
            >
              Ubicaciones
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenPasswordModal}
            >
              Cambiar Contraseña
            </Button>
          </Box>
        </Box>
      </Paper>
      <Paper elevation={1} sx={{ padding: 2, marginBottom: 2 }}>
        <ProfileForm visibleFields={visibleFields} />
      </Paper>
      <LocationModal
        open={locationModalOpen}
        handleClose={handleCloseLocationModal}
      />
      <ChangePasswordModal
        open={passwordModalOpen}
        handleClose={handleClosePasswordModal}
      />
    </Container>
  );
};

export default ProfileView;
