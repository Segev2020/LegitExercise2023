import * as React from "react";
import Avatar from "@mui/material/Avatar";
import styles from "./Avatar.module.css";

export default function BaseAvatar({ user }) {
  return (
    <Avatar
      sx={{
        bgcolor: user?.bgcolor,
        width: "3.5rem",
        height: "3.5rem",
        fontSize: 10,
        transform: "translateY(-20%)",
      }}
      alt={user?.image?.alt}
      src={user?.image?.src}
    >
      <div className={styles.avatar}>
        {user?.image?.src ? "" : user.displayName}
      </div>
    </Avatar>
  );
}
