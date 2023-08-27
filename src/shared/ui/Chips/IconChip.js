import * as React from "react";
import Chip from "@mui/material/Chip";
import { getChipsProps } from "./utils";

export default function IconChip({
  customIcon,
  customLabel,
  type,
  disableColors = false,
}) {
  const chipsProps = getChipsProps(type);
  const Icon = customIcon || chipsProps?.icon;
  const label = customLabel || chipsProps?.label;
  if (!label) return null;
  return (
    <Chip
      icon={
        chipsProps?.icon && (
          <Icon
            style={{
              color: (!disableColors && chipsProps?.color) || "#475467",
              fontSize: "1.8rem",
            }}
          />
        )
      }
      label={label}
      sx={{
        bgcolor: !disableColors && chipsProps?.bgcolor,
        color: (!disableColors && chipsProps?.color) || "#475467",
      }}
    />
  );
}
