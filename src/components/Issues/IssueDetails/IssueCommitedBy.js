import styles from "./IssueDetails.module.css";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import IconChip from "../../../shared/ui/Chips/IconChip";
import COLORS from "../../../shared/ui/Colors/colors";

export default function IssueCommitedBy({ selectedItemDetails }) {
  return (
    <div>
      <div className={`${styles.meta_data_unit}`}>
        <WarningAmberRoundedIcon style={{ color: COLORS.Red, fontSize: 20 }} />
        <div className={`${styles.boldtext} pr-l`}>{"Commited by"}</div>
        <div style={{ fontWeight: 600 }}>
          <IconChip customLabel={selectedItemDetails?.payload?.email} />
        </div>
      </div>
    </div>
  );
}
