// React
import React from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import {
  Paper,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";

// Componentes propios
import translations from "./Translations";

const ConfigSection = ({
  title,
  config,
  localConfig,
  handleConfigChange,
  section,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Paper elevation={1} sx={{ padding: 2, marginBottom: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <FormGroup>
        <Grid container spacing={2}>
          {Object.entries(config).map(([key, value]) => (
            <Grid item xs={12} sm={6} md={3} key={key}>
              <FormControlLabel
                control={
                  <Switch
                    checked={localConfig[section][key]}
                    onChange={(e) =>
                      handleConfigChange(section, key, e.target.checked)
                    }
                    color="primary"
                  />
                }
                label={translations[section][key] || key}
                sx={{
                  margin: 0,
                  width: "100%",
                  justifyContent: "space-between",
                  "& .MuiFormControlLabel-label": {
                    flex: 1,
                    marginRight: 1,
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
      </FormGroup>
    </Paper>
  );
};

ConfigSection.propTypes = {
  title: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  localConfig: PropTypes.object.isRequired,
  handleConfigChange: PropTypes.func.isRequired,
  section: PropTypes.string.isRequired,
};

export default ConfigSection;
