// React y hooks
import { useState } from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import {
  Container,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  Paper,
  Button,
} from "@mui/material";

// Componentes propios
import { ProfileForm, LocationModal, ChangePasswordModal, MenuModal } from "./ProfileViewComponents";

const ProfileView = ({ visibleFields }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [menuModalOpen, setMenuModalOpen] = useState(false);

  const toggleModal = (setter) => () => setter((prev) => !prev);

  return (
    <Container maxWidth={isSmallScreen ? "sm" : "xl"}>
      <Paper elevation={1} sx={{ padding: 2, marginBottom: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          <Typography
            variant={isSmallScreen ? "h5" : "h4"}
            component="h1"
            style={{
              color: "black",
              marginBottom: isSmallScreen ? theme.spacing(2) : 0,
            }}
          >
            Perfil de Usuario
          </Typography>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={toggleModal(setLocationModalOpen)}
              sx={{
                marginRight: 2,
                marginBottom: isSmallScreen ? theme.spacing(2) : 0,
              }}
            >
              Localizaciones
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={toggleModal(setMenuModalOpen)}
              sx={{
                marginRight: 2,
                marginBottom: isSmallScreen ? theme.spacing(2) : 0,
              }}
            >
              Gestionar Menús
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={toggleModal(setPasswordModalOpen)}
              sx={{
                marginRight: 2,
                marginBottom: isSmallScreen ? theme.spacing(2) : 0,
              }}
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
        handleClose={toggleModal(setLocationModalOpen)}
      />
      <ChangePasswordModal
        open={passwordModalOpen}
        handleClose={toggleModal(setPasswordModalOpen)}
      />
      <MenuModal
        open={menuModalOpen}
        handleClose={toggleModal(setMenuModalOpen)}
      />
    </Container>
  );
};

ProfileView.propTypes = {
  visibleFields: PropTypes.objectOf(PropTypes.bool),
};

export default ProfileView;