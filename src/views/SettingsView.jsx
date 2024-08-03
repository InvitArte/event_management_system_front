import React, { useState, useEffect } from "react";
import { useUserConfig } from "../context/UserConfigContext";
import defaultConfig from "../config/Config";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ConfigSection from "../components/SettingsView/ConfigSection";
import ConfigSectionSkeleton from "../components/SettingsView/ConfigSectionSkeleton";
import translations from "../components/SettingsView/Translations";

const SettingsView = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { userConfig, updateUserConfig } = useUserConfig();
  const [localConfig, setLocalConfig] = useState(null);

  useEffect(() => {
    setLocalConfig(userConfig);
  }, [userConfig]);

  const handleConfigChange = (section, key, value) => {
    setLocalConfig((prevConfig) => ({
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
      await updateUserConfig(localConfig);
    } catch (error) {
      console.error("Error updating user config:", error);
    }
  };

  const renderSkeletons = () => {
    return [...Array(4)].map((_, index) => (
      <ConfigSectionSkeleton key={index} />
    ));
  };

  return (
    <Container maxWidth="xl">
      <Paper elevation={1} sx={{ padding: 2, marginBottom: 2 }}>
        <Typography
          variant={isSmallScreen ? "h5" : "h4"}
          component="h1"
          gutterBottom
        >
          {translations.settingsView.title}
        </Typography>
      </Paper>

      {!localConfig ? (
        renderSkeletons()
      ) : (
        <form onSubmit={handleSubmit}>
          <ConfigSection
            title={translations.guestViewColumns.title}
            config={defaultConfig.guestViewColumns}
            localConfig={localConfig}
            handleConfigChange={handleConfigChange}
            section="guestViewColumns"
          />
          <ConfigSection
            title={translations.guestViewFilters.title}
            config={defaultConfig.guestViewFilters}
            localConfig={localConfig}
            handleConfigChange={handleConfigChange}
            section="guestViewFilters"
          />
          <ConfigSection
            title={translations.guestFormFields.title}
            config={defaultConfig.guestFormFields}
            localConfig={localConfig}
            handleConfigChange={handleConfigChange}
            section="guestFormFields"
          />
          <ConfigSection
            title={translations.profileViewFields.title}
            config={defaultConfig.profileViewFields}
            localConfig={localConfig}
            handleConfigChange={handleConfigChange}
            section="profileViewFields"
          />
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button type="submit" variant="contained" color="primary">
              {translations.settingsView.saveButton}
            </Button>
          </Box>
        </form>
      )}
    </Container>
  );
};

export default SettingsView;
