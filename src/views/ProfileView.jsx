import React from "react";
import { Container, Typography, Box } from "@mui/material";
import ProfileForm from "../components/ProfileView/ProfileForm";

const ProfileView = () => {
  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Perfil de Usuario
        </Typography>
        <ProfileForm />
      </Box>
    </Container>
  );
};

export default ProfileView;
