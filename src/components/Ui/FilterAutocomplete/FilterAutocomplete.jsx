// React
import React from "react";

// Biblioteca de terceros
import PropTypes from "prop-types";

// Material-UI
import { Autocomplete, TextField } from "@mui/material";

const FilterAutocomplete = ({
  label,
  options,
  onChange,
  width = 300,
  multiple = false,
  renderTags,
  renderOption,
  getOptionLabel,
  isOptionEqualToValue,
}) => (
  <Autocomplete
    multiple={multiple}
    options={options}
    renderInput={(params) => <TextField {...params} label={label} />}
    onChange={onChange}
    renderTags={renderTags}
    renderOption={renderOption}
    getOptionLabel={getOptionLabel}
    isOptionEqualToValue={isOptionEqualToValue}
    sx={{ width }}
  />
);

FilterAutocomplete.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  multiple: PropTypes.bool,
  renderTags: PropTypes.func,
  renderOption: PropTypes.func,
  getOptionLabel: PropTypes.func,
  isOptionEqualToValue: PropTypes.func,
};

export default FilterAutocomplete;
