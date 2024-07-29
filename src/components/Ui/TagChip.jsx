import React from "react";
import PropTypes from "prop-types";
import { Chip } from "@mui/material";
import {
  stringToColor,
  adjustColor,
  getContrastColor,
} from "../Utils/TagColors";

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
