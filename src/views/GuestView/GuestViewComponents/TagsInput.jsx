// React
import React from 'react';

// Material-UI
import { TextField, InputAdornment, IconButton, useMediaQuery, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Autocomplete } from '@mui/material';

// Componentes genéricos
import { TagChip } from "../../../components";

const TagsInput = ({ tags, formData, handleTagChange, onOpenTagModal, renderTags }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Autocomplete
      multiple
      options={tags}
      getOptionLabel={(option) => option?.name ?? ""}
      value={formData.tags}
      onChange={handleTagChange}
      renderTags={renderTags}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Etiquetas"
          variant="outlined"
          margin="normal"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={onOpenTagModal}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      padding: isMobile ? '4px' : '8px',
                      marginRight: isMobile ? '4px' : '8px'
                    }}
                  >
                    <AddIcon fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                </InputAdornment>
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <TagChip tag={option} />
        </li>
      )}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
    />
  );
};

export default TagsInput;