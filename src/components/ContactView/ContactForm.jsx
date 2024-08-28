/**
 * @file ContactForm.jsx
 * @description Componente de formulario para la creación y edición de contactos.
 */

import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { TextField, Grid } from "@mui/material";

/**
 * @typedef {Object} Contact
 * @property {string} name - Nombre del contacto
 * @property {string} email - Correo electrónico del contacto
 * @property {string} phone - Número de teléfono del contacto
 * @property {string} description - Descripción del contacto
 * @property {string} observation - Observaciones sobre el contacto
 */

/**
 * @function ContactForm
 * @description Componente de formulario para crear o editar un contacto.
 * @param {Object} props - Propiedades del componente
 * @param {Contact} [props.contact] - Contacto a editar (si es null, se crea un nuevo contacto)
 * @param {function} props.onSubmit - Función a llamar con los datos del formulario al enviar
 * @returns {JSX.Element} Elemento JSX que representa el formulario de contacto
 */
const ContactForm = ({ contact, onSubmit }) => {
  /**
   * @type {[Contact, function]} formData
   * @description Estado para almacenar los datos del formulario
   */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    observation: "",
  });

  /**
   * @description Efecto para cargar los datos del contacto en el formulario cuando se edita
   */
  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || "",
        email: contact.email || "",
        phone: contact.phone || "",
        description: contact.description || "",
        observation: contact.observation || "",
      });
    }
  }, [contact]);

  /**
   * @function handleChange
   * @description Maneja los cambios en los campos del formulario
   * @param {Object} e - Evento de cambio
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  /**
   * @function handleSubmit
   * @description Maneja el envío del formulario
   * @param {Object} e - Evento de envío del formulario
   */
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSubmit(formData);
    },
    [formData, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Teléfono"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Observación"
            name="observation"
            value={formData.observation}
            onChange={handleChange}
            multiline
            rows={4}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />
        </Grid>
        <button
          type="submit"
          id="contact-form-submit"
          style={{ display: "none" }}
        />
      </Grid>
    </form>
  );
};

ContactForm.propTypes = {
  contact: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    description: PropTypes.string,
    observation: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
};

export default ContactForm;
