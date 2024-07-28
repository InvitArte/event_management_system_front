import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
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
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        title={title}
        subheader={`${items.length} invitado(s)`}
      />
      <Autocomplete
        options={items}
        getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
        renderInput={(params) => (
          <TextField {...params} label="Buscar invitado" variant="outlined" />
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
        sx={{ width: 200, height: 230, overflow: "auto" }}
      >
        {items
          .filter((guest) =>
            `${guest.first_name} ${guest.last_name}`
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          )
          .map((guest) => {
            const labelId = `transfer-list-all-item-${guest.id}-label`;

            return (
              <ListItem
                key={guest.id}
                role="listitem"
                onClick={handleToggle(guest)}
                sx={{ cursor: "pointer" }}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={checked.indexOf(guest) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <ListItemText
                  id={labelId}
                  primary={`${guest.first_name} ${guest.last_name}`}
                />
              </ListItem>
            );
          })}
      </List>
    </Card>
  );

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>
        {customList("Invitados", left, leftSearchValue, setLeftSearchValue)}
      </Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>
        {customList("Asignados", right, rightSearchValue, setRightSearchValue)}
      </Grid>
    </Grid>
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
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
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
