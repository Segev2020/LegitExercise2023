import { useContext } from "react";
import IconChips from "../../../shared/ui/Chips/IconChips";
import styles from "./IssueListItem.module.css";
import { IssuesContext } from "../../../context/issuesCtx";
import DetectionTime from "../shared/DetectionTime";
import LegitSecurityOrg from "../shared/LegitSecurityOrg";
import ResolvedStatus from "../shared/ResolvedStatus";
import COLORS from "../../../shared/ui/Colors/colors";

export default function IssueListItem({ issue }) {
  const { selectedItem, setSelectedItem } = useContext(IssuesContext);
  return (
    <div
      id="issue-list-item-container"
      className={`${
        styles.container
      } flx flx-col items-start justifty-center w-100 gap-m p-l ${
        selectedItem?.id === issue?.id ? styles.selected : ""
      }`}
      onClick={() => setSelectedItem(issue)}
    >
      <div
        id="issue-list-item-title"
        className={`flx space-between items-start w-100 h-100 color-primary ${styles.title}`}
      >
        {issue.title} <ResolvedStatus status={issue?.status} />
      </div>
      <div
        id="issue-list-item-detection-date-and-info"
        className={`flx justify-start items-center ${styles.date_and_info}`}
      >
        <div id="issue-list-item-detection-date" className={`${styles.info}`}>
          <DetectionTime date={issue.detectedAt} color={COLORS.GRAY500} />
        </div>
        <div id="issue-list-item-info" className={`${styles.info}`}>
          <LegitSecurityOrg origin={issue?.originId} />
        </div>
      </div>
      <div
        id="issue-list-item-tag"
        className={`flx items-start justify-center pt-m`}
      >
        <IconChips
          chips={[{ type: issue.severity }, { type: issue.issueType }]}
        />
      </div>
    </div>
  );
}
