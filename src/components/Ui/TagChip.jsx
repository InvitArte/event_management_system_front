import React from "react";
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

export default TagChip;
