import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import styles from "./IssueDetails.module.css";

export default function IssueDescription({ selectedItemDetails }) {
  return (
    <div
      className={`${styles.description} flx items-start justify-start p-m w-100 gap-m h-fit color-primary`}
    >
      <InfoOutlinedIcon />
      {selectedItemDetails?.description}
    </div>
  );
}
