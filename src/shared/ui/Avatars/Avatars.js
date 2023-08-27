import * as React from "react";
import Stack from "@mui/material/Stack";
import BaseAvatar from "./Avatar";

export default function Avatars({ avatars }) {
  return (
    <Stack direction="row" spacing={2}>
      {avatars.map((el) => (
        <BaseAvatar avatar={el} />
      ))}
    </Stack>
  );
}
