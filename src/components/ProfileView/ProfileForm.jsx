import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  TextField,
  Button,
  Grid,
  CircularProgress,
  Typography,
} from "@mui/material";
import { userService } from "../../services/Api";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const DATE_FORMAT = "YYYY MM DD HH mm";

const initialUserData = {
  id: "",
  name: "",
  email: "",
  email_verified_at: "",
  created_at: "",
  updated_at: "",
  date: "",
  bank_account: "",
  gift_list_url: "",
};

const ProfileForm = ({ visibleFields }) => {
  const [userData, setUserData] = useState(initialUserData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [date, setDate] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData.date) {
      setDate(dayjs(userData.date, DATE_FORMAT));
    }
  }, [userData.date]);

  const fetchUserData = async () => {
    try {
      const data = await userService.getCurrentUser();
      setUserData(sanitizeUserData(data));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load user data. Please try again.");
      setLoading(false);
    }
  };

  const sanitizeUserData = (data) => {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, value ?? ""])
    );
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const [year, month, day, hour, minute] = dateString.split(/[- :]/);
    return `${day}-${month}-${year} ${hour}:${minute}`;
  };

  //NO PUEDO USAR ESTA FUNCION CON 'dayjs'
  // const formatDateForAPI = (dateString) => {
  //   if (!dateString) return "";
  //   const [date, time] = dateString.split(" ");
  //   const [day, month, year] = date.split("-");
  //   const [hour, minute] = time.split(":");
  //   return `${year}-${month}-${day} ${hour}:${minute}`;
  // };

  const handleDateChange = (newValue) => {
    setDate(newValue);
    setUserData((prevData) => ({
      ...prevData,
      date: newValue ? newValue.format(DATE_FORMAT) : "",
    }));
  };

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
      const updatedUserData = {
        ...userData,
        date: date ? date.format(DATE_FORMAT) : "",
      };

      await Promise.all([
        userService.updateUser(updatedUserData.id, updatedUserData),
        userService.updateDate(updatedUserData.date),
        userService.updateGiftInfo({
          bank_account: updatedUserData.bank_account,
          gift_list_url: updatedUserData.gift_list_url,
        }),
      ]);

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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Fecha y Hora"
              value={date}
              onChange={handleDateChange}
              format={formatDateForDisplay(DATE_FORMAT)}
              slotProps={{
                textField: { fullWidth: true },
              }}
            />
          </LocalizationProvider>
        </Grid>
        {visibleFields.bankAccount && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Cuenta Bancaria"
              name="bank_account"
              value={userData.bank_account}
              onChange={handleChange}
            />
          </Grid>
        )}
        {visibleFields.giftList && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="URL Lista de Regalos"
              name="gift_list_url"
              value={userData.gift_list_url}
              onChange={handleChange}
            />
          </Grid>
        )}
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

ProfileForm.propTypes = {
  visibleFields: PropTypes.shape({
    bankAccount: PropTypes.bool,
    giftList: PropTypes.bool,
  }).isRequired,
};

export default ProfileForm;
