import styles from "./IssueDetails.module.css";
import IconChips from "../../../shared/ui/Chips/IconChips";
import ListSvg from "../../../shared/icons/view-list.svg";

export default function IssueCompliance({ selectedItemDetails }) {
  return (
    <div id="detailed-issue-compliance" className={`${styles.meta_data_unit}`}>
      <img src={ListSvg} width="16rem" alt="compliance checklist" />
      <div className={`${styles.boldtext} pr-l`}>Compliance</div>

      <IconChips
        chips={selectedItemDetails?.compliances?.map((el) => {
          return { customLabel: el };
        })}
      />
    </div>
  );
}
