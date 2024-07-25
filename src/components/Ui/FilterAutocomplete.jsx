import React from "react";
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

export default FilterAutocomplete;
