import styles from "./IssueDetails.module.css";
import CodeIcon from "@mui/icons-material/Code";
import ProductSvg from "../../../shared/icons/ad-product.svg";
import LegitSecurityOrg from "../shared/LegitSecurityOrg";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

export default function IssueMetaData({ selectedItemDetails }) {
  return (
    <div
      id="detailed-issue-meta-data"
      className={`flx items-center justify-center gap-l`}
    >
      <span className={`${styles.meta_data_unit}`}>
        <CodeIcon />
        <LegitSecurityOrg origin={selectedItemDetails.originId} />
      </span>
      <span className={`${styles.meta_data_unit}`}>
        <img src={ProductSvg} width="16rem" alt="product unit" />
        {`Product Unit: ${selectedItemDetails?.products.toString()}`}
      </span>
      <span className={`${styles.meta_data_unit}`}>
        <PersonOutlineOutlinedIcon />
        {`Owner: ${selectedItemDetails?.owner || "Unknown"}`}
      </span>
    </div>
  );
}
