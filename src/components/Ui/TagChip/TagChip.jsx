// React
import React from "react";

// Biblioteca de terceros
import PropTypes from "prop-types";

// Material-UI
import { Chip } from "@mui/material";

// Componentes propios
import {
  stringToColor,
  adjustColor,
  getContrastColor,
} from "../../index";

const TagChip = ({ tag, onDelete, style = {} }) => {
  const backgroundColor = adjustColor(stringToColor(tag.name), 20);
  const textColor = getContrastColor(backgroundColor);

  return (
    <Chip
      label={tag.name}
      onDelete={onDelete}
      style={{
        backgroundColor,
        color: textColor,
        margin: "2px",
        ...style,
      }}
    />
  );
};

TagChip.propTypes = {
  tag: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func,
  style: PropTypes.object,
};

export default TagChip;
