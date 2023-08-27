import styles from "./IssueDetails.module.css";
import ResolvedStatus from "../shared/ResolvedStatus";
export default function IssueTitle({ selectedItemDetails }) {
  return (
    <div
      id="detailed-issue-details-title"
      className={`flx space-between items-center w-100 color-primary ${styles.title}`}
    >
      {selectedItemDetails?.title}
      <ResolvedStatus status={selectedItemDetails?.status} />
    </div>
  );
}
