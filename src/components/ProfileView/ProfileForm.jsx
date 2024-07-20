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
  const [displayDate, setDisplayDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await userService.getCurrentUser();
        setUserData(data);
        setDisplayDate(formatDateForDisplay(data.date));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Please try again.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const [year, month, day, hour, minute] = dateString.split(/[- :]/);
    return `${day}-${month}-${year} ${hour}:${minute}`;
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) return "";
    const [date, time] = dateString.split(" ");
    const [day, month, year] = date.split("-");
    const [hour, minute] = time.split(":");
    return `${year} ${month} ${day} ${hour} ${minute}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "date") {
      setDisplayDate(value);
    } else {
      setUserData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUserData = {
        ...userData,
        date: formatDateForAPI(displayDate),
      };

      // Update user data
      await userService.updateUser(updatedUserData.id, updatedUserData);

      // Update date separately
      await userService.updateDate(updatedUserData.date);

      // Update gift info
      await userService.updateGiftInfo({
        bank_account: updatedUserData.bank_account,
        gift_list_url: updatedUserData.gift_list_url,
      });

      setLoading(false);
    } catch (err) {
      console.error("Error updating user data:", err);
      setError("Failed to update user data. Please try again.");
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
            value={displayDate}
            onChange={handleChange}
            InputProps={{
              readOnly: false,
            }}
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
