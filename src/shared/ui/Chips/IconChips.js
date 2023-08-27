import * as React from "react";
import Stack from "@mui/material/Stack";
import FaceIcon from "@mui/icons-material/Face";
import IconChip from "./IconChip";

export default function IconChips({ chips = [], disableColors, customSpace }) {
  return (
    <Stack direction="row" spacing={customSpace || 1}>
      {/* index is not a good key, but since there is no CRUD its ok here */}
      {chips.map((chip,index) => (
        <IconChip key={index} {...chip} disableColors={disableColors} />
      ))}
    </Stack>
  );
}
