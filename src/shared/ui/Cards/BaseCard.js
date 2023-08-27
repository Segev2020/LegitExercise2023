import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function BaseCard({ children }) {
  return (
    <Card
      sx={{
        minWidth: "100%",
        minHeight: "100%",
        maxHeight: "100%",
        display: "flex",
        flex: 1,
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px;",
      }}
    >
      <CardContent>{children}</CardContent>
    </Card>
  );
}
