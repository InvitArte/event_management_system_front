//React y hooks
import React, { useState, useEffect } from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import {
  Grid,
  List,
  Card,
  CardHeader,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Button,
  TextField,
  Autocomplete,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

// Función que devuelve los elementos de a que no están en b
function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

// Función que devuelve los elementos que están en a y en b
function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

const GuestTransferList = ({
  guests,
  selectedGuests,
  onSelectionChange,
  tagId,
}) => {
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [leftSearchValue, setLeftSearchValue] = useState("");
  const [rightSearchValue, setRightSearchValue] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const rightGuests = guests.filter((guest) =>
      guest.tags.some((tag) => tag.id === tagId)
    );
    const leftGuests = guests.filter(
      (guest) => !guest.tags.some((tag) => tag.id === tagId)
    );

    setLeft(leftGuests);
    setRight(rightGuests);
  }, [guests, tagId]);

  useEffect(() => {
    onSelectionChange(right);
  }, [right, onSelectionChange]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title, items, searchValue, setSearchValue) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        title={<Typography variant="h6">{title}</Typography>}
        subheader={<Typography variant="body2">{`${items.length} invitado(s)`}</Typography>}
      />
      <Autocomplete
        options={items}
        getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
        renderInput={(params) => (
          <TextField {...params} label="Buscar invitado" variant="outlined" size="small" />
        )}
        value={null}
        onChange={(event, newValue) => {
          if (newValue) {
            handleToggle(newValue)();
          }
        }}
        inputValue={searchValue}
        onInputChange={(event, newInputValue) => {
          setSearchValue(newInputValue);
        }}
        sx={{ m: 1 }}
      />
      <List
        dense
        component="div"
        role="list"
        sx={{
          flexGrow: 1,
          overflow: "auto",
          height: 250, // Altura fija
          '& .MuiListItem-root': {
            py: 0.5, // Reducir el padding vertical de los items
          }
        }}
      >
        {items
          .filter((guest) =>
            `${guest.first_name} ${guest.last_name}`
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          )
          .map((guest) => {
            const labelId = `transfer-list-item-${guest.id}-label`;
            return (
              <ListItem
                key={guest.id}
                role="listitem"
                onClick={handleToggle(guest)}
                dense
                sx={{ cursor: "pointer" }}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={checked.indexOf(guest) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                    size="small"
                  />
                </ListItemIcon>
                <ListItemText
                  id={labelId}
                  primary={`${guest.first_name} ${guest.last_name}`}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            );
          })}
      </List>
    </Card>
  );

  return (
    <Box sx={{ width: '100%', height: isMobile ? 'auto' : 450, display: 'flex', flexDirection: 'column' }}>
      <Grid container spacing={2} sx={{ flexGrow: 1 }} direction={isMobile ? 'column' : 'row'}>
        <Grid item xs={12} sm={5} sx={{ height: isMobile ? 'auto' : '100%' }}>
          {customList("Invitados", left, leftSearchValue, setLeftSearchValue)}
        </Grid>
        <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Grid container direction={isMobile ? "row" : "column"} spacing={1} justifyContent="center">
            <Grid item>
              <Button
                variant="outlined"
                size="small"
                onClick={handleCheckedRight}
                disabled={leftChecked.length === 0}
                aria-label="move selected right"
                fullWidth
              >
                {isMobile ? 'AGREGAR →' : '→'}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                size="small"
                onClick={handleCheckedLeft}
                disabled={rightChecked.length === 0}
                aria-label="move selected left"
                fullWidth
              >
                {isMobile ? '← QUITAR' : '←'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={5} sx={{ height: isMobile ? 'auto' : '100%' }}>
          {customList("Asignados", right, rightSearchValue, setRightSearchValue)}
        </Grid>
      </Grid>
    </Box>
  );
};

GuestTransferList.propTypes = {
  guests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
          name: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  selectedGuests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSelectionChange: PropTypes.func.isRequired,
  tagId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default GuestTransferList;