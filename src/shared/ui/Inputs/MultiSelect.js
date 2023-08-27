import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { OutlinedInput, MenuItem, Select, FormControl } from "@mui/material";

export default function MultiSelect({
  options,
  label,
  callback = () => {},
  customDictionary,
}) {
  const [selectedItems, setSelectedItems] = useState([]);
  useEffect(() => {
    callback(selectedItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems]);
  return (
    <FormControl sx={{ width: 180 }}>
      <label style={{ position: "absolute", left: 0, top: "-2rem" }}>
        {label}
      </label>
      <Select
        sx={{ "& legend": { display: "none" }, "& fieldset": { top: 0 } }}
        size="small"
        multiple
        displayEmpty
        value={selectedItems}
        onChange={(e) => setSelectedItems(e.target.value)}
        IconComponent={ExpandMoreIcon}
        input={
          <OutlinedInput
            sx={{ "& legend": { display: "none" }, "& fieldset": { top: 0 } }}
            label={label}
            InputLabelProps={{ shrink: false }}
          />
        }
      >
        {options.map((name) => (
          <MenuItem key={name} value={name}>
            {(customDictionary && customDictionary[`${name}`]) || name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
