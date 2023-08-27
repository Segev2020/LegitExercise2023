import styles from "./IssueDetails.module.css";
import IconChips from "../../../shared/ui/Chips/IconChips";
import DetectionTime from "../shared/DetectionTime";
import COLORS from "../../../shared/ui/Colors/colors";

export default function IssueDetailedTagChips({ selectedItemDetails }) {
  return (
    <div
      id="detailed-issue-details-tag-chips"
      className={`flx items-center justify-center gap-xl`}
    >
      <IconChips
        chips={[
          { type: selectedItemDetails?.severity },
          { type: selectedItemDetails?.issueType },
        ]}
      />
      <div
        id="detailed-issue-detection-time"
        className={`${styles.date} flx items-center justify-center gap-s`}
      >
        <DetectionTime
          date={selectedItemDetails?.detectedAt}
          color={`${COLORS.TextPrimary}`}
          style={{ color: `${COLORS.TextPrimary} !important` }}
        />
      </div>
    </div>
  );
}
