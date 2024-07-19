import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  CircularProgress,
  Typography,
} from "@mui/material";
import { userService } from "../../services/api";

const ProfileForm = () => {
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    email_verified_at: "",
    created_at: "",
    updated_at: "",
    date: "",
    bank_account: "",
    gift_list_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await userService.getCurrentUser();
        setUserData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Please try again.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userService.updateUser(userData.id, userData);
      // Puedes añadir un mensaje de éxito aquí si lo deseas
    } catch (err) {
      console.error("Error updating user data:", err);
      setError("Failed to update user data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nombre"
            name="name"
            value={userData.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            type="email"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Fecha"
            name="date"
            value={userData.date}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Cuenta Bancaria"
            name="bank_account"
            value={userData.bank_account}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="URL Lista de Regalos"
            name="gift_list_url"
            value={userData.gift_list_url}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Actualizar Perfil"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProfileForm;
