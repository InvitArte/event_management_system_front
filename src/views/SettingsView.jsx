import React, { useState, useEffect } from "react";
import api from "../services/Api";

const SettingsView = () => {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const userConfig = await api.userConfig.getUserConfig();
      setConfig(userConfig);
    } catch (error) {
      console.error("Error fetching user config:", error);
    }
  };

  const handleConfigChange = (section, key, value) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      [section]: {
        ...prevConfig[section],
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.userConfig.updateUserConfig(config);
      // Puedes agregar una notificación de éxito aquí si lo deseas
    } catch (error) {
      console.error("Error updating user config:", error);
    }
  };

  if (!config) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Configuración de la aplicación</h2>

      <h3>Columnas de la vista de invitados</h3>
      {Object.entries(config.guestViewColumns).map(([key, value]) => (
        <div key={key}>
          <label>
            <input
              type="checkbox"
              checked={value}
              onChange={(e) =>
                handleConfigChange("guestViewColumns", key, e.target.checked)
              }
            />
            {key}
          </label>
        </div>
      ))}

      <h3>Filtros de la vista de invitados</h3>
      {Object.entries(config.guestViewFilters).map(([key, value]) => (
        <div key={key}>
          <label>
            <input
              type="checkbox"
              checked={value}
              onChange={(e) =>
                handleConfigChange("guestViewFilters", key, e.target.checked)
              }
            />
            {key}
          </label>
        </div>
      ))}

      <h3>Campos del formulario de invitados</h3>
      {Object.entries(config.guestFormFields).map(([key, value]) => (
        <div key={key}>
          <label>
            <input
              type="checkbox"
              checked={value}
              onChange={(e) =>
                handleConfigChange("guestFormFields", key, e.target.checked)
              }
            />
            {key}
          </label>
        </div>
      ))}

      <h3>Campos de la vista de perfil</h3>
      {Object.entries(config.profileViewFields).map(([key, value]) => (
        <div key={key}>
          <label>
            <input
              type="checkbox"
              checked={value}
              onChange={(e) =>
                handleConfigChange("profileViewFields", key, e.target.checked)
              }
            />
            {key}
          </label>
        </div>
      ))}

      <button type="submit">Guardar configuración</button>
    </form>
  );
};

export default SettingsView;
