import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function DetectionTime({ date, color }) {
  let detectDate = new Date(date);
  return (
    <>
      <AccessTimeIcon style={{ color: color }} />
      {`Detected: ${detectDate?.toLocaleDateString()} ${detectDate?.toLocaleTimeString(
        [],
        { hour: "2-digit", minute: "2-digit" }
      )}`}
    </>
  );
}
