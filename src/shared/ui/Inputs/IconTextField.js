import { TextField } from "@mui/material";
import { InputAdornment } from "@mui/material";


// custom wrapper to create input w icon
export default function IconTextField({ leftIcon, rightIcon, ...props }) {
  return (
    <TextField
      {...props}
      size="small"
      InputProps={{
        startAdornment: leftIcon ? (
          <InputAdornment position="start">{leftIcon}</InputAdornment>
        ) : null,
        endAdornment: rightIcon ? (
          <InputAdornment position="end">{rightIcon}</InputAdornment>
        ) : null,
      }}
    />
  );
}
