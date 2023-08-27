import COLORS from "../../../shared/ui/Colors/colors";
import styles from "./ResolvedStatus.module.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function ResolvedStatus(status) {
  return (
    (status?.status === "Resolved" && (
      <div className={`${styles.resolved}`}>
        <CheckCircleIcon style={{ color: COLORS.DarkGreen }} /> Resolved
      </div>
    )) ||
    null
  );
}
